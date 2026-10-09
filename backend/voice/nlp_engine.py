import re
from .intents_config import INTENTS


class NLPEngine:
    """Lightweight, explainable intent/entity extraction for the local demo."""

    CROP_KEYWORDS = [
        "paddy", "rice", "wheat", "sugarcane", "cotton", "mango", "banana",
        "tomato", "potato", "onion", "groundnut", "maize", "soybean", "grape",
    ]
    STATES = [
        "karnataka", "maharashtra", "punjab", "gujarat", "rajasthan", "bihar",
        "tamil nadu", "telangana", "andhra pradesh", "uttar pradesh", "madhya pradesh",
        "west bengal", "odisha", "kerala", "haryana", "assam", "goa",
    ]

    def __init__(self):
        self.intents = INTENTS
        self.current_intent = None
        self.collected_info = {}
        self.conversation_stage = 0

    def detect_intent(self, text):
        text_lower = str(text or "").lower().strip()
        scores = {
            "greeting": 0,
            "eligibility": 0,
            "scheme_inquiry": 0,
            "scheme_info": 0,
            "crop_damage": 0,
            "application_help": 0,
            "document_query": 0,
            "weather_query": 0,
            "crop_advice": 0,
        }

        if any(k in text_lower for k in ("hello", "hi", "hey", "namaste", "namaskara")):
            scores["greeting"] += 3
        if any(k in text_lower for k in ("eligible", "eligibility", "can i get", "am i eligible", "qualify", "qualification")):
            scores["eligibility"] += 6
        if any(k in text_lower for k in ("scheme", "schemes", "yojana", "government benefit", "subsidy", "support for farmers")):
            scores["scheme_inquiry"] += 4
        if any(k in text_lower for k in ("what is", "tell me about", "benefit of", "how much", "details of")):
            scores["scheme_info"] += 2
        if any(k in text_lower for k in ("crop damage", "crop damaged", "damaged crop", "crop loss", "destroyed crop", "heavy rain", "flood damage", "insurance claim", "crop insurance")):
            scores["crop_damage"] += 7
        if any(k in text_lower for k in ("how to apply", "apply for", "application", "registration", "where can i apply")):
            scores["application_help"] += 4
        if any(k in text_lower for k in ("document", "documents", "papers", "proof", "required for application")):
            scores["document_query"] += 4
        if any(k in text_lower for k in ("weather", "forecast", "temperature", "rain today", "will it rain", "climate")):
            scores["weather_query"] += 5
        if any(k in text_lower for k in ("fertilizer", "pesticide", "sowing", "harvest", "disease", "how to grow", "crop advice")):
            scores["crop_advice"] += 4

        best = max(scores, key=scores.get)
        if scores[best] == 0:
            # A scheme name by itself should still produce a useful scheme answer.
            if any(k in text_lower for k in ("pm kisan", "pm-kisan", "pmfb y", "pmfby", "fasal bima", "kisan credit", "kcc", "soil health")):
                return "scheme_info", 2
            return "general_help", 0
        return best, scores[best]

    def extract_entities(self, text, intent=None):
        text_lower = str(text or "").lower()
        entities = {}
        for crop in self.CROP_KEYWORDS:
            if re.search(rf"\b{re.escape(crop)}\b", text_lower):
                entities["crop"] = crop
                break
        for state in self.STATES:
            if state in text_lower:
                entities["state"] = state
                break
        if any(k in text_lower for k in ("own land", "my land", "land owner", "i own")):
            entities["land_owner"] = True
        elif any(k in text_lower for k in ("do not own", "don't own", "not my land", "tenant", "sharecropper")):
            entities["land_owner"] = False
            entities["cultivates_land"] = True
        if any(k in text_lower for k in ("income tax payer", "pay income tax", "i pay tax", "tax payer")):
            entities["income_tax_payer"] = True
        if any(k in text_lower for k in ("not an income tax payer", "do not pay income tax", "don't pay income tax", "not a tax payer")):
            entities["income_tax_payer"] = False
        if any(k in text_lower for k in ("small farmer", "small")):
            entities["farmer_type"] = "small farmer"
        elif "tenant" in text_lower:
            entities["farmer_type"] = "tenant farmer"
        elif "sharecrop" in text_lower:
            entities["farmer_type"] = "sharecropper"
        elif any(k in text_lower for k in ("landowner", "land owner", "owner cultivator")):
            entities["farmer_type"] = "owner cultivator"
        elif "cultivator" in text_lower:
            entities["farmer_type"] = "cultivator"

        if any(k in text_lower for k in ("damage", "damaged", "destroyed", "crop loss", "lost my crop", "heavy rain", "flood")):
            entities["crop_damage"] = True
        numbers = re.findall(r"\d+(?:\.\d+)?", text_lower)
        if numbers:
            if "acre" in text_lower or "area" in text_lower:
                entities["area"] = numbers[0]
            elif "%" in text_lower or "percent" in text_lower:
                entities["loss_percentage"] = numbers[0]
        return entities

    def reset(self):
        self.current_intent = None
        self.collected_info = {}
        self.conversation_stage = 0
