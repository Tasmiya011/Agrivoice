# AgriVoice/backend/voice/nlp_engine.py

import re
from .intents_config import INTENTS, LANGUAGE_MAPPING
from db import get_connection


# =============================================================
# COMPLETE SCHEME DATABASE (fallback if DB is empty)
# =============================================================

SCHEME_DATA = {
    "S001": {
        "scheme_id": "S001",
        "scheme_name": "PM-KISAN Samman Nidhi",
        "aliases": ["pm kisan", "pm kisan samman nidhi", "pm kisan yojana", "kisan samman nidhi"],
        "category": "Financial Support",
        "description": "Income support of ₹6,000 per year to small and marginal farmers, paid in three equal instalments of ₹2,000 every four months.",
        "application_link": "https://pmkisan.gov.in",
        "eligibility": [
            "Small and Marginal landholding farmer family (husband, wife, and minor children)",
            "Collective land ownership of up to 2 hectares",
            "Must have Aadhaar-linked bank account",
            "Excluded: institutional landholders, income tax payers, government employees, professionals",
        ],
        "documents": [
            {"name": "Aadhaar Card", "mandatory": True},
            {"name": "Bank Account Details (Aadhaar seeded)", "mandatory": True},
            {"name": "Land Ownership Records", "mandatory": True},
            {"name": "Mobile Number", "mandatory": True},
        ],
        "steps": [
            {"title": "Visit PM-KISAN Portal", "description": "Go to https://pmkisan.gov.in and click on 'New Farmer Registration'."},
            {"title": "Enter Aadhaar Number", "description": "Provide your Aadhaar number and complete OTP verification."},
            {"title": "Fill Personal Details", "description": "Enter name, date of birth, mobile number, and bank account details."},
            {"title": "Upload Land Documents", "description": "Upload land ownership records (Khatauni/Patta)."},
            {"title": "Submit Application", "description": "Review and submit. Note your registration number for future tracking."},
            {"title": "Track Status", "description": "Use 'Know Your Status' on the portal to check approval and payment status."},
        ],
    },
    "S002": {
        "scheme_id": "S002",
        "scheme_name": "Pradhan Mantri Fasal Bima Yojana (PMFBY)",
        "aliases": ["pmfby", "pm fasal bima", "fasal bima", "crop insurance", "fasal bima yojana"],
        "category": "Crop Insurance",
        "description": "Comprehensive crop insurance against natural calamities. Lowest premium in India: 2% for Kharif food crops, 1.5% for Rabi food crops, 5% for commercial crops.",
        "application_link": "https://pmfby.gov.in",
        "eligibility": [
            "All farmers growing notified crops in notified areas",
            "Both loanee and non-loanee farmers are eligible",
            "Voluntary enrollment for all farmers (post-Kharif 2020)",
            "Must apply within cut-off dates (Kharif: 15-31 July, Rabi: 15 Oct - 31 Dec)",
        ],
        "documents": [
            {"name": "Aadhaar Card", "mandatory": True},
            {"name": "Bank Account Details", "mandatory": True},
            {"name": "Land Ownership Records (7/12 extract or equivalent)", "mandatory": True},
            {"name": "Sowing Certificate (for non-loanee farmers)", "mandatory": False},
            {"name": "Passport Size Photo", "mandatory": True},
        ],
        "steps": [
            {"title": "Visit PMFBY Portal", "description": "Go to https://pmfby.gov.in and click on 'Farmer Corner'."},
            {"title": "Select Enrollment Type", "description": "Choose whether you are a loanee farmer (through bank) or non-loanee farmer."},
            {"title": "Fill Application Form", "description": "Enter personal details, crop details, and land information."},
            {"title": "Upload Documents", "description": "Upload Aadhaar, bank passbook, and land records."},
            {"title": "Pay Premium", "description": "Pay the low premium amount (2% or 1.5% of sum insured)."},
            {"title": "Get Policy", "description": "Receive your insurance policy document via email/SMS."},
        ],
    },
    "S003": {
        "scheme_id": "S003",
        "scheme_name": "Kisan Credit Card (KCC)",
        "aliases": ["kcc", "kisan credit card", "credit card"],
        "category": "Credit Support",
        "description": "Provides short-term credit up to ₹3 lakh per annum for crop cultivation, allied activities, and household needs. Interest rate as low as 4% per annum with subvention.",
        "application_link": "https://www.indianbank.bank.in/",
        "eligibility": [
            "All farmers - individuals or joint borrowers who are owner cultivators",
            "Tenant farmers, oral lessees, and share croppers",
            "Self Help Groups (SHGs) and Joint Liability Groups (JLGs)",
            "Should not have defaulted on previous agricultural loans",
        ],
        "documents": [
            {"name": "Proof of Identity (Aadhaar/Voter ID)", "mandatory": True},
            {"name": "Proof of Address", "mandatory": True},
            {"name": "Land Ownership or Lease Documents", "mandatory": True},
            {"name": "Bank Account Details", "mandatory": True},
            {"name": "Passport Size Photographs", "mandatory": True},
            {"name": "Income Proof (if required by bank)", "mandatory": False},
        ],
        "steps": [
            {"title": "Visit Your Bank", "description": "Go to the nearest branch of any bank (SBI, PNB, etc.) or visit their website."},
            {"title": "Get KCC Application Form", "description": "Ask for the Kisan Credit Card application form or apply online."},
            {"title": "Fill the Form", "description": "Enter personal details, land details, and crop information."},
            {"title": "Submit Documents", "description": "Attach all required documents with the form."},
            {"title": "Bank Verification", "description": "Bank verifies your documents and may conduct field verification."},
            {"title": "Receive KCC", "description": "Once approved, receive your Kisan Credit Card with sanctioned limit."},
        ],
    },
    "S004": {
        "scheme_id": "S004",
        "scheme_name": "Soil Health Card Scheme",
        "aliases": ["soil health card", "soil card", "soil health"],
        "category": "Soil Testing",
        "description": "Provides farmers with a report on nutrient status of their soil along with recommendations on appropriate dosage of nutrients for improving soil health.",
        "application_link": "https://soilhealth.dac.gov.in",
        "eligibility": [
            "All farmers with agricultural land",
            "Soil samples collected from farmer's field",
            "Card issued once every 3 years",
        ],
        "documents": [
            {"name": "Aadhaar Card", "mandatory": True},
            {"name": "Land Details (Survey Number/Khasra)", "mandatory": True},
            {"name": "Mobile Number", "mandatory": True},
        ],
        "steps": [
            {"title": "Visit Agriculture Officer", "description": "Visit District or Block Agriculture Officer to request soil testing."},
            {"title": "Officer Checks Coverage", "description": "Officer verifies if your area is covered under the State Annual Action Plan."},
            {"title": "Soil Sample Collection", "description": "Authorized agent collects soil samples from your field (4 corners + center)."},
            {"title": "Lab Testing", "description": "Samples tested for 12 parameters (N, P, K, S, Zn, Fe, Cu, Mn, B, pH, EC, OC)."},
            {"title": "Card Generation", "description": "Soil Health Card generated and uploaded to portal within 25 days."},
            {"title": "Download Card", "description": "Download your card from https://soilhealth.dac.gov.in or receive at home."},
        ],
    },
}


# =============================================================
# DATABASE ROUTER (uses DB if available, else SCHEME_DATA)
# =============================================================

class _SchemeRouter:
    @staticmethod
    def _norm(text):
        return re.sub(r"[^a-z0-9]+", " ", str(text).lower()).strip()

    @classmethod
    def find_scheme(cls, text):
        """Find scheme by name or alias. Returns scheme dict or None."""
        query = cls._norm(text)

        # Check aliases first (fast path)
        for scheme_id, scheme in SCHEME_DATA.items():
            for alias in scheme["aliases"]:
                if cls._norm(alias) in query:
                    return scheme

        # Check by scheme name
        for scheme_id, scheme in SCHEME_DATA.items():
            if cls._norm(scheme["scheme_name"]) in query:
                return scheme

        # Try DB as fallback
        try:
            with get_connection() as conn:
                rows = conn.execute(
                    "SELECT scheme_id, scheme_name FROM schemes WHERE active=1"
                ).fetchall()
            for row in rows:
                if cls._norm(row["scheme_name"]) in query:
                    return SCHEME_DATA.get(row["scheme_id"])
        except Exception:
            pass

        return None

    @classmethod
    def answer(cls, text):
        """
        Answer a free-form question about schemes.
        Returns (answer_text, scheme_id) or (None, None).
        """
        t = str(text).lower()

        # Find scheme first
        scheme = cls.find_scheme(text)

        if scheme:
            scheme_id = scheme["scheme_id"]
            scheme_name = scheme["scheme_name"]
            link = scheme["application_link"]

            # --- Documents ---
            if any(w in t for w in ("document", "paper", "certificate", "aadhaar",
                                     "proof", "required", "kagaz", "kagad")):
                docs = scheme["documents"]
                lines = [
                    f"• {d['name']}" + (" (required)" if d["mandatory"] else " (optional)")
                    for d in docs
                ]
                return (
                    f"📄 Documents required for {scheme_name}:\n" +
                    "\n".join(lines) +
                    f"\n\n🔗 Official Portal: {link}"
                ), scheme_id

            # --- Eligibility ---
            if any(w in t for w in ("eligible", "eligibility", "qualify", "who can",
                                     "can i get", "patrata")):
                rules = scheme["eligibility"]
                lines = [f"• {r}" for r in rules]
                return (
                    f"✅ Eligibility for {scheme_name}:\n" +
                    "\n".join(lines) +
                    f"\n\n🔗 Official Portal: {link}"
                ), scheme_id

            # --- Steps / How to Apply ---
            if any(w in t for w in ("how to apply", "process", "steps", "procedure",
                                     "apply", "kaise", "guide")):
                steps = scheme["steps"]
                lines = [f"{i+1}. {s['title']}: {s['description']}" for i, s in enumerate(steps)]
                return (
                    f"📝 How to apply for {scheme_name}:\n" +
                    "\n".join(lines) +
                    f"\n\n🔗 Apply Online: {link}"
                ), scheme_id

            # --- Benefits ---
            if any(w in t for w in ("benefit", "money", "amount", "how much", "fayda")):
                return (
                    f"💰 {scheme_name} Benefits:\n" +
                    f"{scheme['description']}\n\n" +
                    f"🔗 Official Portal: {link}"
                ), scheme_id

            # --- Default: Full info ---
            return (
                f"📋 {scheme_name} ({scheme['category']}):\n" +
                f"{scheme['description']}\n\n" +
                f"🔗 Official Portal: {link}"
            ), scheme_id

        # --- List all schemes ---
        if any(w in t for w in ("what schemes", "which schemes", "list schemes",
                                 "all schemes", "available schemes",
                                 "show schemes", "schemes available")):
            lines = []
            for sid, s in SCHEME_DATA.items():
                lines.append(f"• {s['scheme_name']} — {s['description']}")
                lines.append(f"  🔗 {s['application_link']}")
            return "📋 Available Government Schemes:\n\n" + "\n".join(lines), None

        # --- Nothing matched ---
        return None, None


# =============================================================
# NLP ENGINE
# =============================================================

class NLPEngine:
    def __init__(self):
        self.intents = INTENTS
        self.current_intent = None
        self.collected_info = {}
        self.conversation_stage = 0
        self.application_guide = None
        self.application_step_index = 0

    @staticmethod
    def _normalize(text):
        return re.sub(r"[^a-z0-9]+", " ", str(text).lower()).strip()

    def _find_scheme(self, text):
        """Find scheme (used by application guide). Returns dict or None."""
        return _SchemeRouter.find_scheme(text)

    @staticmethod
    def _is_application_request(text):
        text = str(text).lower()
        return any(term in text for term in (
            "apply", "applying", "application", "registration", "register",
            "enroll", "enrol", "steps", "step by step", "guide me",
            "how do i get", "how can i get",
        ))

    @staticmethod
    def _is_continue_request(text):
        text = NLPEngine._normalize(text)
        return text in {
            "next", "continue", "yes", "ok", "okay", "next step",
            "tell me more", "what next",
        }

    def _start_application_guide(self, scheme):
        self.application_guide = scheme
        self.application_step_index = 0
        self.current_intent = None
        if not scheme.get("steps"):
            self.application_guide = None
            return {
                "message": (
                    f"I don't have step-by-step instructions stored for "
                    f"{scheme['scheme_name']} yet. Check the official portal: "
                    f"{scheme['application_link']}"
                ),
                "done": True,
            }
        return self._application_step_response()

    def _application_step_response(self):
        scheme = self.application_guide
        step = scheme["steps"][self.application_step_index]
        total = len(scheme["steps"])
        message = (
            f"To apply for {scheme['scheme_name']}, follow these steps. "
            f"Step {self.application_step_index + 1} of {total}: "
            f"{step['title']}. {step['description']}"
        )
        if self.application_step_index + 1 < total:
            message += " Say next when you are ready for the next step."
            done = False
        else:
            message += (
                f" These are all the steps. Apply online at: "
                f"{scheme['application_link']}"
            )
            done = True
            self.application_guide = None
        self.application_step_index += 1
        return {
            "message": message,
            "done": done,
            "stage": self.application_step_index,
            "total_stages": total,
            "collected": {},
        }

    def detect_intent(self, text):
        """Detect the intent from user's text query"""
        text_lower = text.lower().strip()
        intent_scores = {}
        for intent_name, intent_data in self.intents.items():
            score = 0
            for keyword in intent_data["keywords"]:
                if keyword in text_lower:
                    score += 1
            intent_scores[intent_name] = score

        if intent_scores:
            best_intent = max(intent_scores, key=intent_scores.get)
            if intent_scores[best_intent] > 0:
                return best_intent, intent_scores[best_intent]
        return "general_help", 0

    def extract_entities(self, text, intent):
        entities = {}
        text_lower = text.lower()
        crop_keywords = ["paddy", "wheat", "rice", "sugarcane", "cotton",
                          "mango", "banana", "tomato", "potato", "onion",
                          "groundnut", "maize"]
        for crop in crop_keywords:
            if crop in text_lower:
                entities["crop"] = crop
                break
        numbers = re.findall(r'\d+', text)
        if numbers:
            if "area" in text_lower or "acre" in text_lower:
                entities["area"] = numbers[0]
            elif "percent" in text_lower or "%" in text_lower:
                entities["loss_percentage"] = numbers[0]
        state_keywords = ["karnataka", "tamil nadu", "punjab", "up",
                           "uttar pradesh", "bihar", "gujarat", "rajasthan",
                           "maharashtra", "andhra", "telangana",
                           "madhya pradesh", "west bengal"]
        for state in state_keywords:
            if state in text_lower:
                entities["state"] = state
                break
        return entities

    def start_conversation(self, intent):
        self.current_intent = intent
        self.conversation_stage = 0
        self.collected_info = {}
        intent_data = self.intents.get(intent, {})
        questions = intent_data.get("questions", [])
        if not questions:
            return {
                "message": intent_data.get("response_template", "How can I help you?"),
                "done": True, "stage": 0, "total_stages": 0, "collected": {}
            }
        return {
            "message": questions[0],
            "stage": self.conversation_stage,
            "total_stages": len(questions),
            "done": False,
            "collected": {}
        }

    def process_conversation(self, user_text):
        """Process conversation — DB FIRST, then intents."""
        text = str(user_text or "").strip()

        # --- Application guide flow ---
        if self.application_guide:
            if self._is_application_request(text):
                scheme = self._find_scheme(text)
                if scheme:
                    return self._start_application_guide(scheme)
            if self._is_continue_request(text):
                return self._application_step_response()
            return {
                "message": "Say next to continue the application steps, or ask for another scheme.",
                "done": False,
                "stage": self.application_step_index,
                "total_stages": len(self.application_guide["steps"]),
                "collected": {},
            }

        if self.current_intent == "scheme_application":
            scheme = self._find_scheme(text)
            if scheme:
                return self._start_application_guide(scheme)
            return {
                "message": "Which scheme would you like help applying for: PM-KISAN, PMFBY, Kisan Credit Card, or Soil Health Card?",
                "done": False,
            }

        if self._is_application_request(text):
            scheme = self._find_scheme(text)
            if scheme:
                return self._start_application_guide(scheme)
            self.current_intent = "scheme_application"
            return {
                "message": "Which scheme would you like help applying for: PM-KISAN, PMFBY, Kisan Credit Card, or Soil Health Card?",
                "done": False,
            }

        # --- FIRST INTERACTION: DB router FIRST, intents second ---
        if self.current_intent is None:
            # Step 1: Try DB router
            answer, scheme_id = _SchemeRouter.answer(user_text)
            if answer:
                return {
                    "message": answer,
                    "done": True,
                    "source": "database",
                    "scheme": scheme_id,
                    "stage": 0,
                    "total_stages": 0,
                    "collected": {},
                }

            # Step 2: Fall back to keyword intents
            intent, score = self.detect_intent(user_text)
            if score > 0:
                return self.start_conversation(intent)

            # Step 3: Nothing matched
            return {
                "message": (
                    "I couldn't find that information. Try asking about a "
                    "scheme, or ask: 'What schemes are available?', "
                    "'What documents for PM-Kisan?', or 'Who is eligible for KCC?'"
                ),
                "done": False,
            }

        # --- Continue existing intent conversation ---
        intent_data = self.intents.get(self.current_intent, {})
        questions = intent_data.get("questions", [])
        entities = self.extract_entities(user_text, self.current_intent)
        self.collected_info.update(entities)
        self.conversation_stage += 1

        if self.conversation_stage < len(questions):
            return {
                "message": questions[self.conversation_stage],
                "stage": self.conversation_stage,
                "total_stages": len(questions),
                "collected": self.collected_info,
                "done": False
            }
        else:
            final_response = self.generate_final_response()
            return {
                "message": final_response,
                "collected": self.collected_info,
                "done": True,
                "stage": self.conversation_stage,
                "total_stages": len(questions)
            }

    def generate_final_response(self):
        intent_data = self.intents.get(self.current_intent, {})
        if self.current_intent == "crop_insurance":
            info = self.collected_info
            crop = info.get("crop", "your crop")
            loss = info.get("loss_percentage", "some")
            area = info.get("area", "")
            response = f"✅ Based on your information about {crop} crop"
            if loss:
                response += f" with {loss}% loss"
            if area:
                response += f" on {area} acres"
            response += ", I recommend filing a crop insurance claim immediately. The government offers coverage through PMFBY. Would you like me to guide you through the application process?"
            return response
        elif self.current_intent == "scheme_inquiry":
            info = self.collected_info
            state = info.get("state", "your state")
            return f"📋 I found several schemes applicable in {state}. The most relevant are: PM-KISAN (₹6000/year), PMFBY (crop insurance), and the Soil Health Card scheme. Which one would you like to know more about?"
        elif self.current_intent == "weather_query":
            info = self.collected_info
            location = info.get("state", "your area")
            return f"🌤️ Based on your request for weather in {location}, I recommend checking the IMD (India Meteorological Department) website or app for accurate, real-time weather updates."
        elif self.current_intent == "crop_advice":
            crop = self.collected_info.get("crop", "your crop")
            return f"🌱 For your {crop} crop, I recommend: 1) Regular monitoring for pests and diseases, 2) Proper irrigation schedule based on crop stage, 3) Soil testing for optimal nutrient management. Would you like more specific advice?"
        return intent_data.get("response_template", "Thank you for sharing information. I'll help you further based on this.")

    def reset(self):
        self.current_intent = None
        self.conversation_stage = 0
        self.collected_info = {}
        self.application_guide = None
        self.application_step_index = 0