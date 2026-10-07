from flask import Flask, jsonify, request
from flask_cors import CORS

from db import get_connection, init_db
from engine import check_eligibility, recommend_schemes
from voice.voice_assistant import VoiceAssistant

app = Flask(__name__)
CORS(app)

# One conversation service for the local/demo application. The browser handles
# microphone capture and speech playback; Flask handles NLP and conversation state.
voice_assistant = VoiceAssistant()

# Ensure the seeded SQLite database exists even when Flask is started by a WSGI runner.
init_db()


def query_all(sql, params=()):
    with get_connection() as conn:
        return [dict(row) for row in conn.execute(sql, params).fetchall()]


def query_one(sql, params=()):
    with get_connection() as conn:
        row = conn.execute(sql, params).fetchone()
        return dict(row) if row else None


@app.get("/health")
def health():
    return jsonify({"status": "ok", "service": "AgriVoice Backend"})


@app.get("/schemes")
def get_schemes():
    q = request.args.get("q", "").strip().lower()
    if q:
        rows = query_all(
            """SELECT * FROM schemes
               WHERE active=1 AND
               (LOWER(scheme_name) LIKE ? OR LOWER(category) LIKE ?)
               ORDER BY scheme_name""",
            (f"%{q}%", f"%{q}%")
        )
    else:
        rows = query_all("SELECT * FROM schemes WHERE active=1 ORDER BY scheme_name")
    return jsonify({"count": len(rows), "schemes": rows})


@app.get("/schemes/<scheme_id>")
def get_scheme(scheme_id):
    scheme = query_one(
        "SELECT * FROM schemes WHERE scheme_id=? AND active=1", (scheme_id.upper(),)
    )
    if not scheme:
        return jsonify({"error": "Scheme not found"}), 404

    scheme["eligibility"] = query_all(
        "SELECT * FROM eligibility_rules WHERE scheme_id=?", (scheme_id.upper(),)
    )
    scheme["documents"] = query_all(
        "SELECT * FROM documents WHERE scheme_id=? ORDER BY mandatory DESC, document_name",
        (scheme_id.upper(),)
    )
    scheme["faqs"] = query_all(
        "SELECT * FROM faqs WHERE scheme_id=?", (scheme_id.upper(),)
    )
    scheme["application_steps"] = query_all(
        """SELECT step_order, title, description FROM application_steps
           WHERE scheme_id=? ORDER BY step_order""", (scheme_id.upper(),)
    )
    return jsonify(scheme)


@app.get("/schemes/<scheme_id>/documents")
def get_documents(scheme_id):
    if not query_one("SELECT scheme_id FROM schemes WHERE scheme_id=?", (scheme_id.upper(),)):
        return jsonify({"error": "Scheme not found"}), 404
    return jsonify({
        "scheme_id": scheme_id.upper(),
        "documents": query_all(
            "SELECT * FROM documents WHERE scheme_id=? ORDER BY mandatory DESC, document_name",
            (scheme_id.upper(),)
        )
    })


@app.post("/eligibility/check")
def eligibility():
    data = request.get_json(silent=True) or {}
    return jsonify(check_eligibility(data))


@app.post("/schemes/recommend")
def recommend():
    data = request.get_json(silent=True) or {}
    return jsonify(recommend_schemes(data))


@app.get("/voice/languages")
def voice_languages():
    """Return language options understood by the voice/NLP layer."""
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
    """Process typed or browser-transcribed speech through the NLP engine."""
    data = request.get_json(silent=True) or {}
    language = str(data.get("language") or "english").strip().lower()
    text = str(data.get("text") or "").strip()

    if not voice_assistant.set_language(language):
        return jsonify({"error": "Unsupported voice language"}), 400
    if not text:
        return jsonify({"error": "Text is required"}), 400

    result = voice_assistant.process_query(text)
    return jsonify({
        "language": language,
        "input": text,
        **result,
    })


@app.post("/voice/reset")
def voice_reset():
    voice_assistant.reset()
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
