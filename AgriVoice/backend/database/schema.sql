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
