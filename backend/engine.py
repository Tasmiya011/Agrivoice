from db import get_connection


def _bool(value):
    if value is None or value == "":
        return None
    if isinstance(value, bool):
        return value
    if isinstance(value, (int, float)):
        return bool(value)
    text = str(value).strip().lower()
    if text in {"true", "yes", "1", "y", "owner", "owned"}:
        return True
    if text in {"false", "no", "0", "n", "none", "not owned"}:
        return False
    return None


def _scheme_rows():
    with get_connection() as conn:
        return [dict(row) for row in conn.execute(
            "SELECT * FROM schemes WHERE active=1 ORDER BY scheme_name"
        ).fetchall()]


def _scheme_bundle(scheme_id):
    scheme_id = str(scheme_id).upper()
    with get_connection() as conn:
        scheme = conn.execute("SELECT * FROM schemes WHERE scheme_id=? AND active=1", (scheme_id,)).fetchone()
        if not scheme:
            return None
        data = dict(scheme)
        data["eligibility"] = [dict(r) for r in conn.execute(
            "SELECT * FROM eligibility_rules WHERE scheme_id=?", (scheme_id,)
        ).fetchall()]
        data["documents"] = [dict(r) for r in conn.execute(
            "SELECT * FROM documents WHERE scheme_id=? ORDER BY mandatory DESC, document_name", (scheme_id,)
        ).fetchall()]
        data["faqs"] = [dict(r) for r in conn.execute(
            "SELECT * FROM faqs WHERE scheme_id=?", (scheme_id,)
        ).fetchall()]
        data["application_steps"] = [dict(r) for r in conn.execute(
            "SELECT step_order, title, description FROM application_steps WHERE scheme_id=? ORDER BY step_order", (scheme_id,)
        ).fetchall()]
        return data


def scheme_details(scheme_id):
    return _scheme_bundle(scheme_id)


def _farmer_type(profile):
    return str(profile.get("farmer_type") or "").strip().lower().replace("-", " ")


def _profile_missing(profile):
    missing = []
    if _bool(profile.get("land_owner")) is None:
        missing.append("land_owner")
    if _bool(profile.get("cultivates_land")) is None:
        missing.append("cultivates_land")
    if not _farmer_type(profile):
        missing.append("farmer_type")
    if not str(profile.get("state") or "").strip():
        missing.append("state")
    return missing


def _status_for_scheme(scheme, profile):
    sid = scheme["scheme_id"]
    owner = _bool(profile.get("land_owner"))
    cultivates = _bool(profile.get("cultivates_land"))
    income_tax = _bool(profile.get("income_tax_payer"))
    exclusion = _bool(profile.get("pm_kisan_exclusion"))
    farmer_type = _farmer_type(profile)
    crop = str(profile.get("crop") or "").strip()
    warnings = []
    reasons = []

    owner_types = ("landowner", "land owner", "owner cultivator", "owner-cultivator")
    tenant_types = ("tenant", "sharecropper", "share cropper", "lessee", "cultivator", "cooperative")
    is_owner_type = any(x in farmer_type for x in owner_types)
    is_tenant_type = any(x in farmer_type for x in tenant_types)
    is_farming_type = is_owner_type or is_tenant_type or "farmer" in farmer_type

    if sid == "S001":  # PM-KISAN: landholding farmer family; official exclusions apply.
        if owner is not True:
            reasons.append("PM-KISAN is for eligible landholding farmer families; you indicated that you do not own agricultural land.")
        if income_tax is True:
            reasons.append("People who paid income tax in the last assessment year are excluded under PM-KISAN rules.")
        if exclusion is True:
            reasons.append("You indicated that at least one additional PM-KISAN exclusion may apply.")
        if income_tax is None or exclusion is None:
            warnings.append("Answer the PM-KISAN exclusion questions before this scheme can be recommended.")
        eligible = owner is True and income_tax is False and exclusion is False and (is_owner_type or "farmer" in farmer_type)
        if eligible:
            warnings.append("Final coverage depends on land records, family-level conditions, date/record rules and all official exclusions.")

    elif sid == "S002":  # PMFBY: cultivators of notified crops, including eligible tenants/sharecroppers.
        eligible = (owner is True or cultivates is True) and is_farming_type and bool(crop) and bool(str(profile.get("state") or "").strip())
        if not crop:
            warnings.append("A crop must be selected before checking crop-insurance relevance.")
        if not (owner is True or cultivates is True):
            reasons.append("You indicated that you neither own nor cultivate agricultural land.")
        warnings.append("Coverage requires an eligible insurable interest in a notified crop/area and compliance with the season, enrolment and claim rules. Tenant/sharecropper documents may be required.")
        if eligible:
            reasons.append("Your answers indicate farming/ cultivation and a crop was supplied; verify the crop and area notification for your state and season.")

    elif sid == "S003":  # KCC eligibility includes owner cultivators, tenant farmers, oral lessees and sharecroppers.
        eligible = (owner is True or cultivates is True) and is_farming_type
        if not (owner is True or cultivates is True):
            reasons.append("KCC is intended for farmers and eligible agricultural/allied activities; your answers do not indicate land ownership or cultivation.")
        if not is_farming_type:
            reasons.append("The selected farmer category does not match the scheme's listed farmer categories.")
        if eligible:
            warnings.append("KCC eligibility includes owner cultivators and tenant/oral lessee/sharecropper farmers; participating banks assess documents, credit and local requirements.")

    elif sid == "S004":  # Soil sampling/SHC is field based; don't recommend to a non-cultivating landless user.
        eligible = (owner is True or cultivates is True) and is_farming_type
        if not (owner is True or cultivates is True):
            reasons.append("Soil Health Card guidance is tied to a farm/field soil sample; you indicated no owned or cultivated agricultural land.")
        if eligible:
            warnings.append("Contact the local agriculture department/soil-testing service for sample collection and local process.")

    else:
        eligible = False
        reasons.append("No verified eligibility rule is configured for this scheme.")

    return eligible, reasons, warnings


def check_eligibility(profile):
    """Rule-based preliminary screening aligned to the published scheme summaries; not an official decision."""
    profile = profile or {}
    missing = _profile_missing(profile)
    results = []
    not_eligible = []

    for scheme in _scheme_rows():
        # PM-KISAN needs explicit answers to both tax and additional exclusion checks.
        if scheme["scheme_id"] == "S001" and (_bool(profile.get("income_tax_payer")) is None or _bool(profile.get("pm_kisan_exclusion")) is None):
            continue
        # A missing shared answer must not create a false positive.
        if missing:
            continue
        eligible, reasons, warnings = _status_for_scheme(scheme, profile)
        item = {
            "scheme_id": scheme["scheme_id"],
            "scheme": scheme["scheme_name"],
            "category": scheme["category"],
            "status": "Potentially eligible" if eligible else "Does not match preliminary rules",
            "reasons": reasons,
            "warnings": warnings,
            "application_link": scheme["application_link"],
            "benefits": scheme["benefits"],
            "official_verification_required": True,
        }
        if eligible:
            results.append(item)
        else:
            not_eligible.append(item)

    return {
        "notice": "These are preliminary matches based on your answers and published scheme summaries, not an official eligibility decision. Verify current state/season rules and documents with the official department or participating bank.",
        "missing_information": missing,
        "eligible_schemes": results,
        "results": results,
        "not_eligible_schemes": not_eligible,
    }


def recommend_schemes(profile):
    profile = profile or {}
    result = check_eligibility(profile)
    eligible_ids = {x["scheme_id"] for x in result["eligible_schemes"]}
    problem = str(profile.get("problem") or "").lower()
    crop_damage = _bool(profile.get("crop_damage"))
    text = " ".join(str(profile.get(k) or "") for k in ("query", "question", "problem")).lower()
    priorities = []
    for scheme in result["eligible_schemes"]:
        score = 0
        sid = scheme["scheme_id"]
        if sid == "S002" and (crop_damage is True or any(k in text for k in ("damage", "insurance", "claim", "rain", "flood", "drought", "storm", "loss"))):
            score += 10
        if sid == "S003" and any(k in text for k in ("loan", "credit", "money", "finance", "kcc")):
            score += 10
        if sid == "S004" and any(k in text for k in ("soil", "fertilizer", "nutrient")):
            score += 10
        if sid == "S001" and any(k in text for k in ("income", "financial", "money", "support", "benefit")):
            score += 10
        priorities.append((score, scheme))
    priorities.sort(key=lambda x: (-x[0], x[1]["scheme"]))
    return {
        "notice": result["notice"],
        "missing_information": result["missing_information"],
        "recommendations": [dict(item, score=score) for score, item in priorities if item["scheme_id"] in eligible_ids],
    }
