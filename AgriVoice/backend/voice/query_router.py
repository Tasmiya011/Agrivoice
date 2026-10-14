# AgriVoice/backend/voice/query_router.py
#
# Understands free-form farmer questions and pulls data from
# the schemes database. No hardcoded responses needed.

import re
from db import get_connection


def search_schemes(query):
    """Search schemes by name, category, or keyword."""
    q = query.lower().strip()
    with get_connection() as conn:
        rows = conn.execute("""
            SELECT * FROM schemes
            WHERE active=1 AND (
                LOWER(scheme_name) LIKE ? OR
                LOWER(category) LIKE ? OR
                LOWER(description) LIKE ?
            )
            ORDER BY scheme_name
        """, (f"%{q}%", f"%{q}%", f"%{q}%")).fetchall()
        return [dict(r) for r in rows]


def get_scheme_by_name(name):
    """Fuzzy-find a scheme by name."""
    keywords = name.lower().split()
    with get_connection() as conn:
        for kw in keywords:
            if len(kw) < 3:
                continue
            rows = conn.execute("""
                SELECT * FROM schemes
                WHERE active=1 AND LOWER(scheme_name) LIKE ?
                LIMIT 1
            """, (f"%{kw}%",)).fetchall()
            if rows:
                return dict(rows[0])
    return None


def get_scheme_documents(scheme_id):
    with get_connection() as conn:
        rows = conn.execute("""
            SELECT document_name, description, mandatory
            FROM documents
            WHERE scheme_id=?
            ORDER BY mandatory DESC, document_name
        """, (scheme_id.upper(),)).fetchall()
        return [dict(r) for r in rows]


def get_scheme_eligibility(scheme_id):
    with get_connection() as conn:
        rows = conn.execute("""
            SELECT rule_name, rule_value
            FROM eligibility_rules
            WHERE scheme_id=?
        """, (scheme_id.upper(),)).fetchall()
        return [dict(r) for r in rows]


def get_scheme_steps(scheme_id):
    with get_connection() as conn:
        rows = conn.execute("""
            SELECT step_order, title, description
            FROM application_steps
            WHERE scheme_id=?
            ORDER BY step_order
        """, (scheme_id.upper(),)).fetchall()
        return [dict(r) for r in rows]


def get_all_schemes():
    with get_connection() as conn:
        rows = conn.execute("""
            SELECT scheme_id, scheme_name, category
            FROM schemes
            WHERE active=1
            ORDER BY scheme_name
        """).fetchall()
        return [dict(r) for r in rows]


# ============================================================
# QUESTION INTENT DETECTION — richer than keyword match
# ============================================================

def detect_question_type(text):
    """Detect what kind of question the farmer is asking."""
    t = text.lower()

    # Document-related
    if any(w in t for w in ["document", "paper", "certificate", "proof", "aadhaar", "required"]):
        return "documents"

    # Eligibility-related
    if any(w in t for w in ["eligible", "eligibility", "qualify", "who can", "can i get"]):
        return "eligibility"

    # Steps / process
    if any(w in t for w in ["how to apply", "process", "steps", "procedure", "apply"]):
        return "steps"

    # Benefits
    if any(w in t for w in ["benefit", "money", "amount", "how much", "benefits"]):
        return "benefits"

    # List of schemes
    if any(w in t for w in ["what schemes", "which schemes", "list", "all schemes", "available"]):
        return "list"

    # Specific scheme query
    if any(w in t for w in ["tell me about", "details", "information", "info about"]):
        return "info"

    return "unknown"


def answer_question(text):
    """
    Answer a free-form question about schemes by querying the database.
    Returns (answer_text, scheme_reference) or (None, None) if nothing found.
    """
    qtype = detect_question_type(text)

    # --- Q1: "What schemes are available?" ---
    if qtype == "list":
        schemes = get_all_schemes()
        if not schemes:
            return "No schemes found.", None
        lines = [f"• {s['scheme_name']} ({s['category']})" for s in schemes]
        return "Available schemes:\n" + "\n".join(lines), None

    # --- Q2: Look for a scheme name in the question ---
    scheme = get_scheme_by_name(text)
    if not scheme:
        # Try broader search
        matches = search_schemes(text)
        if matches:
            scheme = matches[0]

    if not scheme:
        return None, None

    scheme_id = scheme["scheme_id"]
    scheme_name = scheme["scheme_name"]

    # --- Q3: Answer based on question type ---
    if qtype == "documents":
        docs = get_scheme_documents(scheme_id)
        if not docs:
            return f"No documents listed for {scheme_name}.", scheme
        lines = [f"• {d['document_name']}" + (" (required)" if d["mandatory"] else "") for d in docs]
        return f"Documents required for {scheme_name}:\n" + "\n".join(lines), scheme

    if qtype == "eligibility":
        rules = get_scheme_eligibility(scheme_id)
        if not rules:
            return f"No eligibility info for {scheme_name}.", scheme
        lines = [f"• {r['rule_name']}: {r['rule_value']}" for r in rules]
        return f"Eligibility for {scheme_name}:\n" + "\n".join(lines), scheme

    if qtype == "steps":
        steps = get_scheme_steps(scheme_id)
        if not steps:
            return f"No application steps for {scheme_name}.", scheme
        lines = [f"{s['step_order']}. {s['title']} — {s['description']}" for s in steps]
        return f"How to apply for {scheme_name}:\n" + "\n".join(lines), scheme

    if qtype == "benefits":
        return f"{scheme_name} benefits: {scheme.get('description', 'No details available')}", scheme

    # --- Default: show scheme info ---
    return f"{scheme_name} ({scheme['category']}): {scheme.get('description', '')}", scheme
