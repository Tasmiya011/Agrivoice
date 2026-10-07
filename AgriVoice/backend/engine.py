from db import get_connection

KNOWN_FARMER_TYPES = {
    "landholder", "owner cultivator", "tenant farmer", "sharecropper",
    "cultivator", "farmer", "landowner"
}


def _bool(value):
    if value is None:
        return None
    if isinstance(value, bool):
        return value
    if isinstance(value, (int, float)):
        return bool(value)
    return str(value).strip().lower() in {"true", "yes", "1", "y"}


def _scheme_rows():
    with get_connection() as conn:
        return conn.execute(
            "SELECT * FROM schemes WHERE active=1 ORDER BY scheme_name"
        ).fetchall()


def _rule_for(scheme_id):
    with get_connection() as conn:
        return conn.execute(
            "SELECT * FROM eligibility_rules WHERE scheme_id=?", (scheme_id,)
        ).fetchone()


def check_eligibility(profile):
    """Preliminary rule-based check. Never claims official eligibility."""
    profile = profile or {}
    land_owner = _bool(profile.get("land_owner"))
    cultivates = _bool(profile.get("cultivates_land"))
    income_tax_payer = _bool(profile.get("income_tax_payer"))
    farmer_type = str(profile.get("farmer_type") or "").strip().lower()
    crop_damage = _bool(profile.get("crop_damage"))
    crop = str(profile.get("crop") or "").strip()

    missing = []
    if land_owner is None and cultivates is None:
        missing.append("land_owner or cultivates_land")
    if not farmer_type:
        missing.append("farmer_type")

    results = []
    for scheme in _scheme_rows():
        rule = _rule_for(scheme["scheme_id"])
        reasons, warnings = [], []
        possible = True

        if rule["land_required"] and land_owner is False and cultivates is False:
            possible = False
            reasons.append("Agricultural land/landholding information does not match the preliminary rule.")

        if rule["income_tax_payer_allowed"] == 0 and income_tax_payer is True:
            possible = False
            reasons.append("The provided information matches an exclusion condition in the preliminary rule.")

        # PMFBY-like schemes need crop/season/state verification.
        if scheme["scheme_id"] == "S002":
            if not crop:
                warnings.append("Crop is required for a more useful insurance check.")
            if crop_damage is True:
                warnings.append("Crop damage should be reported through the applicable official claim/loss process; damage alone does not establish eligibility.")
            warnings.append("Verify notified crop, season, area, state rules and enrolment/claim conditions.")

        if scheme["scheme_id"] == "S003" and farmer_type:
            allowed = ("owner" in farmer_type or "tenant" in farmer_type or
                       "share" in farmer_type or "cultivat" in farmer_type)
            if not allowed:
                warnings.append("Confirm that your farmer category is accepted by the participating bank.")

        if scheme["scheme_id"] == "S004" and not (land_owner or cultivates):
            possible = False
            reasons.append("The preliminary flow expects agricultural land/field information.")

        if missing:
            status = "More information required"
        elif possible:
            status = "Appears potentially eligible"
        else:
            status = "Does not match preliminary rules"

        results.append({
            "scheme_id": scheme["scheme_id"],
            "scheme": scheme["scheme_name"],
            "status": status,
            "reasons": reasons,
            "warnings": warnings,
            "official_verification_required": True
        })

    return {
        "notice": "This is a preliminary guidance result, not an official eligibility decision.",
        "missing_information": missing,
        "results": results
    }


def recommend_schemes(profile):
    profile = profile or {}
    problem = str(profile.get("problem") or "").lower()
    crop = str(profile.get("crop") or "").lower()
    crop_damage = _bool(profile.get("crop_damage"))
    land = _bool(profile.get("land_owner"))
    cultivates = _bool(profile.get("cultivates_land"))
    farmer_type = str(profile.get("farmer_type") or "").lower()

    scored = []
    for scheme in _scheme_rows():
        score = 0
        reasons = []

        if scheme["scheme_id"] == "S001":
            if land:
                score += 5; reasons.append("landholding support")
            if "income" in problem or "financial" in problem or "support" in problem:
                score += 3; reasons.append("financial-support need")

        elif scheme["scheme_id"] == "S002":
            if crop_damage or "damage" in problem or "insurance" in problem:
                score += 6; reasons.append("crop-risk/insurance need")
            if crop:
                score += 1; reasons.append(f"crop mentioned: {crop}")

        elif scheme["scheme_id"] == "S003":
            if "loan" in problem or "credit" in problem or "money" in problem or "finance" in problem:
                score += 6; reasons.append("agricultural credit need")
            if farmer_type:
                score += 1; reasons.append("farmer category supplied")

        elif scheme["scheme_id"] == "S004":
            if "soil" in problem or "fertilizer" in problem or "nutrient" in problem:
                score += 6; reasons.append("soil/nutrient-management need")
            if land or cultivates:
                score += 2; reasons.append("agricultural field information supplied")

        if score > 0:
            scored.append({
                "scheme_id": scheme["scheme_id"],
                "scheme": scheme["scheme_name"],
                "category": scheme["category"],
                "score": score,
                "reasons": reasons,
                "application_link": scheme["application_link"]
            })

    scored.sort(key=lambda x: (-x["score"], x["scheme"]))
    return {
        "notice": "Recommendations are based on the information provided and are not official scheme decisions.",
        "recommendations": scored[:5]
    }
