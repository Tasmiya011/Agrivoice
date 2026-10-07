import json
import os
import sqlite3

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DB_PATH = os.path.join(BASE_DIR, "database", "agrivoice.db")
DATA_DIR = os.path.join(BASE_DIR, "data")
SCHEMA_PATH = os.path.join(BASE_DIR, "database", "schema.sql")


def get_connection():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    conn.execute("PRAGMA foreign_keys = ON")
    return conn


def init_db():
    os.makedirs(os.path.dirname(DB_PATH), exist_ok=True)
    with get_connection() as conn:
        with open(SCHEMA_PATH, encoding="utf-8") as f:
            conn.executescript(f.read())

        # Seed only when the database is empty.
        count = conn.execute("SELECT COUNT(*) FROM schemes").fetchone()[0]
        if count == 0:
            def load(name):
                with open(os.path.join(DATA_DIR, name), encoding="utf-8") as f:
                    return json.load(f)

            for s in load("schemes.json"):
                conn.execute(
                    """INSERT INTO schemes
                    (scheme_id, scheme_name, description, benefits, category, application_link, active)
                    VALUES (?, ?, ?, ?, ?, ?, ?)""",
                    (s["scheme_id"], s["scheme_name"], s["description"], s["benefits"],
                     s["category"], s["application_link"], s["active"])
                )

            for r in load("eligibility_rules.json"):
                conn.execute(
                    """INSERT INTO eligibility_rules
                    (rule_id, scheme_id, land_required, farmer_type, income_tax_payer_allowed,
                     crop_damage_relevant, crop_types, other_conditions)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?)""",
                    (r["rule_id"], r["scheme_id"], r["land_required"], r["farmer_type"],
                     r["income_tax_payer_allowed"], r["crop_damage_relevant"],
                     r["crop_types"], r["other_conditions"])
                )

            for d in load("documents.json"):
                conn.execute(
                    "INSERT INTO documents VALUES (?, ?, ?, ?)",
                    (d["document_id"], d["scheme_id"], d["document_name"], d["mandatory"])
                )

            for q in load("faqs.json"):
                conn.execute(
                    "INSERT INTO faqs VALUES (?, ?, ?, ?)",
                    (q["faq_id"], q["scheme_id"], q["question"], q["answer"])
                )

            for step in load("application_steps.json"):
                conn.execute(
                    "INSERT INTO application_steps VALUES (?, ?, ?, ?, ?)",
                    (step["step_id"], step["scheme_id"], step["step_order"],
                     step["title"], step["description"])
                )


def row_to_dict(row):
    return dict(row) if row else None
