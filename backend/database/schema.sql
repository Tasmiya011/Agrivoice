CREATE TABLE IF NOT EXISTS schemes (
    scheme_id TEXT PRIMARY KEY,
    scheme_name TEXT NOT NULL,
    description TEXT NOT NULL,
    benefits TEXT NOT NULL,
    category TEXT NOT NULL,
    application_link TEXT NOT NULL,
    active INTEGER NOT NULL DEFAULT 1
);
CREATE TABLE IF NOT EXISTS eligibility_rules (
    rule_id TEXT PRIMARY KEY,
    scheme_id TEXT NOT NULL REFERENCES schemes(scheme_id),
    land_required INTEGER,
    farmer_type TEXT,
    income_tax_payer_allowed INTEGER,
    crop_damage_relevant INTEGER,
    crop_types TEXT,
    other_conditions TEXT
);
CREATE TABLE IF NOT EXISTS documents (
    document_id TEXT PRIMARY KEY,
    scheme_id TEXT NOT NULL REFERENCES schemes(scheme_id),
    document_name TEXT NOT NULL,
    description TEXT NOT NULL DEFAULT '',
    mandatory INTEGER NOT NULL DEFAULT 1
);
CREATE TABLE IF NOT EXISTS faqs (
    faq_id TEXT PRIMARY KEY,
    scheme_id TEXT NOT NULL REFERENCES schemes(scheme_id),
    question TEXT NOT NULL,
    answer TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS application_steps (
    step_id TEXT PRIMARY KEY,
    scheme_id TEXT NOT NULL REFERENCES schemes(scheme_id),
    step_order INTEGER NOT NULL,
    title TEXT NOT NULL,
    description TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS users (
    user_id INTEGER PRIMARY KEY AUTOINCREMENT,
    full_name TEXT NOT NULL,
    mobile TEXT NOT NULL UNIQUE,
    email TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    password_salt TEXT NOT NULL,
    farmer_type TEXT NOT NULL,
    country TEXT NOT NULL DEFAULT 'India',
    village TEXT NOT NULL,
    taluka TEXT NOT NULL,
    district TEXT NOT NULL,
    state TEXT NOT NULL,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS sessions (
    token TEXT PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    created_at TEXT NOT NULL
);
