import hashlib
import hmac
import json
import os
import re
import secrets
import sqlite3
from datetime import datetime, timezone

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DB_PATH = os.path.join(BASE_DIR, "database", "agrivoice.db")
DATA_DIR = os.path.join(BASE_DIR, "data")
SCHEMA_PATH = os.path.join(BASE_DIR, "database", "schema.sql")
LOCATIONS_PATH = os.path.join(DATA_DIR, "india_locations.json")
try:
    with open(LOCATIONS_PATH, encoding="utf-8") as _f:
        INDIA_LOCATIONS = json.load(_f)
except Exception:
    INDIA_LOCATIONS = {}
PASSWORD_ITERATIONS = 210_000


def get_connection():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    conn.execute("PRAGMA foreign_keys = ON")
    return conn


def _now():
    return datetime.now(timezone.utc).isoformat()


def _validate_email(email):
    email = str(email or "").strip()
    return bool(re.fullmatch(r"(?!.*\.\.)[A-Za-z0-9.!#$%&'*+/=?^_`{|}~-]{1,64}@[A-Za-z0-9](?:[A-Za-z0-9-]{0,61}[A-Za-z0-9])?(?:\.[A-Za-z0-9](?:[A-Za-z0-9-]{0,61}[A-Za-z0-9])?)+", email))


def _validate_mobile(mobile):
    return bool(re.fullmatch(r"\d{10}", str(mobile or "").strip()))


def validate_password(password):
    password = str(password or "")
    checks = {
        "length": len(password) >= 8,
        "uppercase": bool(re.search(r"[A-Z]", password)),
        "lowercase": bool(re.search(r"[a-z]", password)),
        "number": bool(re.search(r"\d", password)),
        "special": bool(re.search(r"[^A-Za-z0-9]", password)),
    }
    return checks, all(checks.values())


def hash_password(password, salt=None):
    salt = salt or secrets.token_bytes(16)
    digest = hashlib.pbkdf2_hmac(
        "sha256", str(password).encode("utf-8"), salt, PASSWORD_ITERATIONS
    )
    return salt.hex(), digest.hex()


def verify_password(password, salt_hex, stored_hash):
    try:
        salt = bytes.fromhex(salt_hex)
    except (TypeError, ValueError):
        return False
    _, digest = hash_password(password, salt)
    return hmac.compare_digest(digest, str(stored_hash))


def user_to_dict(row):
    if not row:
        return None
    row = dict(row)
    row.pop("password_hash", None)
    row.pop("password_salt", None)
    # Frontend-friendly names while retaining the database id/timestamps.
    row["name"] = row.get("full_name", "")
    row["farmerType"] = row.get("farmer_type", "")
    return row


def init_db():
    os.makedirs(os.path.dirname(DB_PATH), exist_ok=True)
    with get_connection() as conn:
        with open(SCHEMA_PATH, encoding="utf-8") as f:
            conn.executescript(f.read())
        cols = {row[1] for row in conn.execute("PRAGMA table_info(users)").fetchall()}
        if "country" not in cols:
            conn.execute("ALTER TABLE users ADD COLUMN country TEXT NOT NULL DEFAULT 'India'")
        dcols = {row[1] for row in conn.execute("PRAGMA table_info(documents)").fetchall()}
        if "description" not in dcols:
            conn.execute("ALTER TABLE documents ADD COLUMN description TEXT NOT NULL DEFAULT ''")

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
                conn.execute("INSERT INTO documents (document_id, scheme_id, document_name, description, mandatory) VALUES (?, ?, ?, ?, ?)",
                             (d["document_id"], d["scheme_id"], d["document_name"], d.get("description", ""), d["mandatory"]))

            for d in load("documents.json"):
                conn.execute("UPDATE documents SET description=? WHERE document_id=?", (d.get("description", ""), d["document_id"]))

            for q in load("faqs.json"):
                conn.execute("INSERT INTO faqs VALUES (?, ?, ?, ?)",
                             (q["faq_id"], q["scheme_id"], q["question"], q["answer"]))

            for step in load("application_steps.json"):
                conn.execute("INSERT INTO application_steps VALUES (?, ?, ?, ?, ?)",
                             (step["step_id"], step["scheme_id"], step["step_order"],
                              step["title"], step["description"]))

        # Refresh document descriptions on every startup so an existing DB also gets the richer guidance.
        with open(os.path.join(DATA_DIR, "documents.json"), encoding="utf-8") as f:
            for d in json.load(f):
                conn.execute("UPDATE documents SET description=? WHERE document_id=?", (d.get("description", ""), d["document_id"]))



def create_user(data):
    name = str(data.get("name") or "").strip()
    mobile = str(data.get("mobile") or "").strip()
    email = str(data.get("email") or "").strip().lower()
    password = str(data.get("password") or "")
    farmer_type = str(data.get("farmerType") or "").strip()
    address = {
        "village": str(data.get("village") or "").strip(),
        "taluka": str(data.get("taluka") or "").strip(),
        "district": str(data.get("district") or "").strip(),
        "state": str(data.get("state") or "").strip(),
        "country": str(data.get("country") or "").strip(),
    }

    if not re.fullmatch(r"[A-Za-z][A-Za-z .'-]{1,79}", name):
        raise ValueError("Full name should contain letters and spaces only.")
    if not _validate_mobile(mobile):
        raise ValueError("Mobile number must contain exactly 10 digits.")
    if not _validate_email(email):
        raise ValueError("Please enter a valid email address.")
    checks, valid_password = validate_password(password)
    if not valid_password:
        raise ValueError("Password must be at least 8 characters and include uppercase, lowercase, number and special character.")
    if not farmer_type:
        raise ValueError("Farmer type is required.")
    if address["country"] != "India":
        raise ValueError("Country must be India for the current location dataset.")
    if address["state"] not in INDIA_LOCATIONS:
        raise ValueError("Please select a valid Indian state or union territory.")
    if address["district"] not in INDIA_LOCATIONS.get(address["state"], []):
        raise ValueError("Please select a valid district for the selected state.")
    if not re.fullmatch(r"[A-Za-z .'-]{2,20}", address["village"]):
        raise ValueError("Village must contain 2 to 20 letters/spaces only.")
    if not all(address.values()):
        raise ValueError("Country, Village, Taluka, District and State are required.")

    salt, password_hash = hash_password(password)
    now = _now()
    try:
        with get_connection() as conn:
            cur = conn.execute(
                """INSERT INTO users
                (full_name, mobile, email, password_hash, password_salt, farmer_type,
                 country, village, taluka, district, state, created_at, updated_at)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)""",
                (name, mobile, email, password_hash, salt, farmer_type,
                 address["country"], address["village"], address["taluka"], address["district"], address["state"], now, now)
            )
            user_id = cur.lastrowid
            row = conn.execute("SELECT * FROM users WHERE user_id=?", (user_id,)).fetchone()
            return user_to_dict(row)
    except sqlite3.IntegrityError as exc:
        message = str(exc).lower()
        if "email" in message:
            raise ValueError("An account already exists with this email address.")
        if "mobile" in message:
            raise ValueError("An account already exists with this mobile number.")
        raise ValueError("An account with these details already exists.")


def authenticate(identifier, password):
    identifier = str(identifier or "").strip().lower()
    with get_connection() as conn:
        row = conn.execute(
            "SELECT * FROM users WHERE LOWER(email)=? OR mobile=? LIMIT 1",
            (identifier, identifier)
        ).fetchone()
    if not row or not verify_password(password, row["password_salt"], row["password_hash"]):
        return None
    return user_to_dict(row)


def create_session(user_id):
    token = secrets.token_urlsafe(32)
    with get_connection() as conn:
        conn.execute("INSERT INTO sessions(token, user_id, created_at) VALUES (?, ?, ?)",
                     (token, user_id, _now()))
    return token


def get_user_by_token(token):
    if not token:
        return None
    with get_connection() as conn:
        row = conn.execute(
            """SELECT u.* FROM users u
               JOIN sessions s ON s.user_id=u.user_id
               WHERE s.token=?""", (token,)
        ).fetchone()
    return user_to_dict(row)


def delete_session(token):
    if token:
        with get_connection() as conn:
            conn.execute("DELETE FROM sessions WHERE token=?", (token,))


def update_user(user_id, data):
    fields = {
        "full_name": str(data.get("name") or "").strip(),
        "mobile": str(data.get("mobile") or "").strip(),
        "email": str(data.get("email") or "").strip().lower(),
        "farmer_type": str(data.get("farmerType") or "").strip(),
        "country": str(data.get("country") or "").strip(),
        "village": str(data.get("village") or "").strip(),
        "taluka": str(data.get("taluka") or "").strip(),
        "district": str(data.get("district") or "").strip(),
        "state": str(data.get("state") or "").strip(),
    }
    if not re.fullmatch(r"[A-Za-z][A-Za-z .'-]{1,79}", fields["full_name"]):
        raise ValueError("Full name should contain letters and spaces only.")
    if not _validate_mobile(fields["mobile"]):
        raise ValueError("Mobile number must contain exactly 10 digits.")
    if not _validate_email(fields["email"]):
        raise ValueError("Please enter a valid email address.")
    if fields["country"] != "India":
        raise ValueError("Country must be India for the current location dataset.")
    if fields["state"] not in INDIA_LOCATIONS:
        raise ValueError("Please select a valid Indian state or union territory.")
    if fields["district"] not in INDIA_LOCATIONS.get(fields["state"], []):
        raise ValueError("Please select a valid district for the selected state.")
    if not re.fullmatch(r"[A-Za-z .'-]{2,20}", fields["village"]):
        raise ValueError("Village must contain 2 to 20 letters/spaces only.")
    if not fields["farmer_type"] or not all(fields[k] for k in ("country", "village", "taluka", "district", "state")):
        raise ValueError("Farmer type and complete address are required.")

    try:
        with get_connection() as conn:
            conn.execute(
                """UPDATE users SET full_name=?, mobile=?, email=?, farmer_type=?, country=?, village=?,
                   taluka=?, district=?, state=?, updated_at=? WHERE user_id=?""",
                (fields["full_name"], fields["mobile"], fields["email"], fields["farmer_type"], fields["country"],
                 fields["village"], fields["taluka"], fields["district"], fields["state"], _now(), user_id)
            )
            row = conn.execute("SELECT * FROM users WHERE user_id=?", (user_id,)).fetchone()
            return user_to_dict(row)
    except sqlite3.IntegrityError as exc:
        message = str(exc).lower()
        if "email" in message:
            raise ValueError("Another account already uses this email address.")
        if "mobile" in message:
            raise ValueError("Another account already uses this mobile number.")
        raise ValueError("Could not update the account.")
