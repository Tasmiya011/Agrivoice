from flask import Flask, jsonify, request
from flask_cors import CORS

from db import (
    create_session, create_user, delete_session, get_connection, get_user_by_token,
    init_db, authenticate, update_user, validate_password,
)
from engine import check_eligibility, recommend_schemes
from voice.voice_assistant import VoiceAssistant

app = Flask(__name__)
CORS(app)
voice_assistant = VoiceAssistant()
_TRANSLATION_CACHE = {}
init_db()


def query_all(sql, params=()):
    with get_connection() as conn:
        return [dict(row) for row in conn.execute(sql, params).fetchall()]


def query_one(sql, params=()):
    with get_connection() as conn:
        row = conn.execute(sql, params).fetchone()
        return dict(row) if row else None


def bearer_token():
    header = request.headers.get("Authorization", "")
    if header.lower().startswith("bearer "):
        return header[7:].strip()
    return request.headers.get("X-Session-Token", "").strip()


def current_user():
    return get_user_by_token(bearer_token())


@app.post("/translate/batch")
def translate_batch():
    """Offline-safe endpoint. UI translations are stored in frontend dictionaries."""
    data = request.get_json(silent=True) or {}
    texts = data.get("texts") or []
    target = str(data.get("target") or "en").strip().lower()
    if target not in {"en", "mr", "hi", "kn"}:
        return jsonify({"error": "Unsupported target language"}), 400
    if not isinstance(texts, list) or len(texts) > 40 or not all(isinstance(x, str) for x in texts):
        return jsonify({"error": "texts must be a list of at most 40 strings"}), 400
    # No external translation service: preserve unknown text rather than returning fabricated translations.
    return jsonify({"target": target, "translations": texts})


@app.get("/health")
def health():
    return jsonify({"status": "ok", "service": "AgriVoice Backend"})


# -------------------- Authentication --------------------
@app.post("/auth/register")
def register():
    data = request.get_json(silent=True) or {}
    try:
        user = create_user(data)
        token = create_session(user["user_id"])
        return jsonify({"message": "Account created successfully.", "token": token, "user": user}), 201
    except ValueError as exc:
        return jsonify({"error": str(exc)}), 409 if "already exists" in str(exc).lower() else 400


@app.post("/auth/login")
def login():
    data = request.get_json(silent=True) or {}
    identifier = data.get("identifier") or data.get("email") or data.get("mobile")
    password = data.get("password")
    user = authenticate(identifier, password)
    if not user:
        return jsonify({"error": "Invalid email/mobile or password."}), 401
    token = create_session(user["user_id"])
    return jsonify({"message": "Login successful.", "token": token, "user": user})


@app.post("/auth/logout")
def logout():
    delete_session(bearer_token())
    return jsonify({"message": "Logged out successfully."})


@app.get("/auth/me")
def me():
    user = current_user()
    if not user:
        return jsonify({"error": "Not logged in."}), 401
    return jsonify({"user": user})


@app.put("/profile")
def profile_update():
    user = current_user()
    if not user:
        return jsonify({"error": "Please login first."}), 401
    data = request.get_json(silent=True) or {}
    try:
        updated = update_user(user["user_id"], data)
        return jsonify({"message": "Profile updated successfully.", "user": updated})
    except ValueError as exc:
        return jsonify({"error": str(exc)}), 409 if "another account" in str(exc).lower() else 400


# -------------------- Scheme APIs --------------------
@app.get("/schemes")
def get_schemes():
    q = request.args.get("q", "").strip().lower()
    if q:
        rows = query_all(
            """SELECT * FROM schemes WHERE active=1 AND
               (LOWER(scheme_name) LIKE ? OR LOWER(category) LIKE ? OR LOWER(description) LIKE ?)
               ORDER BY scheme_name""",
            (f"%{q}%", f"%{q}%", f"%{q}%")
        )
    else:
        rows = query_all("SELECT * FROM schemes WHERE active=1 ORDER BY scheme_name")
    return jsonify({"count": len(rows), "schemes": rows})


@app.get("/schemes/<scheme_id>")
def get_scheme(scheme_id):
    scheme = query_one("SELECT * FROM schemes WHERE scheme_id=? AND active=1", (scheme_id.upper(),))
    if not scheme:
        return jsonify({"error": "Scheme not found"}), 404
    scheme["eligibility"] = query_all("SELECT * FROM eligibility_rules WHERE scheme_id=?", (scheme_id.upper(),))
    scheme["documents"] = query_all("SELECT * FROM documents WHERE scheme_id=? ORDER BY mandatory DESC, document_name", (scheme_id.upper(),))
    scheme["faqs"] = query_all("SELECT * FROM faqs WHERE scheme_id=?", (scheme_id.upper(),))
    scheme["application_steps"] = query_all(
        "SELECT step_order, title, description FROM application_steps WHERE scheme_id=? ORDER BY step_order", (scheme_id.upper(),)
    )
    return jsonify(scheme)


@app.get("/schemes/<scheme_id>/documents")
def get_documents(scheme_id):
    if not query_one("SELECT scheme_id FROM schemes WHERE scheme_id=?", (scheme_id.upper(),)):
        return jsonify({"error": "Scheme not found"}), 404
    return jsonify({"scheme_id": scheme_id.upper(), "documents": query_all(
        "SELECT * FROM documents WHERE scheme_id=? ORDER BY mandatory DESC, document_name", (scheme_id.upper(),)
    )})


@app.post("/eligibility/check")
def eligibility():
    data = request.get_json(silent=True) or {}
    return jsonify(check_eligibility(data))


@app.post("/schemes/recommend")
def recommend():
    data = request.get_json(silent=True) or {}
    return jsonify(recommend_schemes(data))


# -------------------- Voice / NLP --------------------
@app.get("/voice/languages")
def voice_languages():
    return jsonify({"languages": voice_assistant.supported_languages})


@app.post("/voice/language")
def voice_language():
    data = request.get_json(silent=True) or {}
    language = str(data.get("language") or "english").strip().lower()
    if not voice_assistant.set_language(language):
        return jsonify({"error": "Unsupported voice language"}), 400
    return jsonify({"language": language})


@app.post("/voice/process")
def voice_process():
    data = request.get_json(silent=True) or {}
    language = str(data.get("language") or "english").strip().lower()
    text = str(data.get("text") or "").strip()
    session_id = str(data.get("session_id") or bearer_token() or "browser-demo").strip()
    if not voice_assistant.set_language(language):
        return jsonify({"error": "Unsupported voice language"}), 400
    if not text:
        return jsonify({"error": "Text is required"}), 400
    user = current_user()
    profile = user if user else data.get("profile")
    result = voice_assistant.process_query(text, session_id=session_id, profile=profile)
    return jsonify({"language": language, "input": text, **result})


@app.post("/voice/reset")
def voice_reset():
    data = request.get_json(silent=True) or {}
    session_id = str(data.get("session_id") or bearer_token() or "browser-demo").strip()
    voice_assistant.reset(session_id)
    return jsonify({"status": "ok", "message": "Voice conversation reset"})


@app.get("/voice/intents")
def voice_intents():
    return jsonify({"intents": voice_assistant.get_intents()})


@app.get("/faqs")
def faqs():
    scheme_id = request.args.get("scheme_id")
    if scheme_id:
        rows = query_all("SELECT * FROM faqs WHERE scheme_id=?", (scheme_id.upper(),))
    else:
        rows = query_all("SELECT * FROM faqs ORDER BY scheme_id, faq_id")
    return jsonify({"count": len(rows), "faqs": rows})


@app.errorhandler(404)
def not_found(_):
    return jsonify({"error": "Endpoint not found"}), 404


@app.errorhandler(500)
def server_error(_):
    return jsonify({"error": "Internal server error"}), 500


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
