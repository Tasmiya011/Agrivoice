"""Conversation orchestration for AgriVoice.

The browser handles microphone capture and speech playback. Flask handles
intent/entity extraction, multi-turn questions, scheme lookup and eligibility.
"""
from engine import check_eligibility, recommend_schemes, scheme_details
from db import get_connection
from .nlp_engine import NLPEngine
from .translator import translate_text, translate_to_english
from .translations import SUPPORTED_LANGUAGES


class VoiceAssistant:
    def __init__(self, enable_server_tts=False):
        self.enable_server_tts = enable_server_tts
        self.current_language = "english"
        self.supported_languages = {
            key: {"stt": self._stt_code(key), "tts": val["code"]}
            for key, val in SUPPORTED_LANGUAGES.items()
        }
        self.sessions = {}

    def _stt_code(self, lang):
        codes = {
            "english": "en-IN", "hindi": "hi-IN", "kannada": "kn-IN", "tamil": "ta-IN",
            "telugu": "te-IN", "malayalam": "ml-IN", "marathi": "mr-IN", "bengali": "bn-IN", "punjabi": "pa-IN",
        }
        return codes.get(lang, "en-IN")

    def set_language(self, language_code):
        if language_code in self.supported_languages:
            self.current_language = language_code
            return True
        return False

    def _state(self, session_id, profile=None):
        state = self.sessions.setdefault(session_id, {
            "nlp": NLPEngine(), "intent": None, "pending": [], "profile": {}, "target_scheme": None,
        })
        if profile:
            # Keep backend-required field names while accepting frontend profile names.
            mapped = {
                "farmer_type": profile.get("farmerType", profile.get("farmer_type")),
                "state": profile.get("state"),
                "village": profile.get("village"),
                "taluka": profile.get("taluka"),
                "district": profile.get("district"),
            }
            for key, value in mapped.items():
                if value not in (None, ""):
                    state["profile"][key] = value
        return state

    def _scheme_id_from_text(self, text):
        low = text.lower()
        if "pm-kisan" in low or "pm kisan" in low or "samman nidhi" in low:
            return "S001"
        if "pmfby" in low or "fasal bima" in low or "crop insurance" in low:
            return "S002"
        if "kisan credit" in low or "kcc" in low:
            return "S003"
        if "soil health" in low:
            return "S004"
        return None

    def _missing_questions(self, state, intent):
        profile = state["profile"]
        missing = []
        if intent == "weather_query":
            if not profile.get("weather_location"):
                return [("weather_location", "Which village, district or city do you want the weather for?")]
            return []
        if profile.get("land_owner") is None:
            missing.append(("land_owner", "Do you own agricultural land? Please say yes or no."))
        if profile.get("cultivates_land") is None:
            missing.append(("cultivates_land", "Do you currently cultivate agricultural land, either your own or rented/shared land?"))
        if not profile.get("farmer_type"):
            missing.append(("farmer_type", "What type of farmer are you? For example: landowner, owner cultivator, tenant farmer or sharecropper."))
        if profile.get("income_tax_payer") is None:
            missing.append(("income_tax_payer", "Are you an income-tax payer? Please say yes or no."))
        if profile.get("pm_kisan_exclusion") is None:
            missing.append(("pm_kisan_exclusion", "Apart from income tax, does any other PM-KISAN exclusion apply, such as specified government service, pension of ₹10,000 or more per month, constitutional post, minister/legislator/mayor, institutional landholding or registered professional? Please say yes or no."))
        if not profile.get("state"):
            missing.append(("state", "Which state is your farm in?"))
        if intent == "crop_damage" and not profile.get("crop"):
            missing.append(("crop", "Which crop was damaged?"))
        return missing

    def _answer_to_field(self, field, text, nlp):
        low = text.lower().strip()
        if field == "land_owner":
            if any(x in low for x in ("no", "not", "don't", "do not", "tenant", "sharecrop")):
                return False
            if any(x in low for x in ("yes", "yeah", "yup", "own", "mine")):
                return True
            return None
        if field == "income_tax_payer":
            if any(x in low for x in ("yes", "yeah", "i pay", "payer")) and "not" not in low:
                return True
            if any(x in low for x in ("no", "not", "don't", "do not")):
                return False
            return None
        if field in {"cultivates_land", "pm_kisan_exclusion"}:
            if any(x in low for x in ("yes", "yeah", "yup", "i do", "correct", "applies")) and not any(x in low for x in ("no", "not", "don't", "doesn't")):
                return True
            if any(x in low for x in ("no", "not", "don't", "do not", "doesn't", "none")):
                return False
            return None
        entities = nlp.extract_entities(text)
        if field in entities:
            return entities[field]
        if field == "farmer_type" and low:
            return low
        if field == "state" and low:
            return low
        if field == "crop" and low:
            return entities.get("crop", low)
        if field == "weather_location" and low:
            return low
        return None

    def _ask_next(self, state, intent):
        questions = self._missing_questions(state, intent)
        state["pending"] = questions
        if questions:
            field, question = questions[0]
            return {
                "message": question,
                "question_field": field,
                "done": False,
                "collected": state["profile"],
                "requires_information": True,
            }
        return None

    def _general_answer(self, text):
        """Answer free-form farmer questions from the local scheme/FAQ knowledge base."""
        low = str(text or "").lower()
        with get_connection() as conn:
            rows = conn.execute("SELECT faq_id, scheme_id, question, answer FROM faqs").fetchall()
            schemes = conn.execute("SELECT scheme_id, scheme_name, description, benefits, application_link FROM schemes WHERE active=1").fetchall()
        # Lightweight fuzzy matching when available; otherwise use word overlap.
        try:
            from rapidfuzz.fuzz import token_set_ratio
            best = max(rows, key=lambda r: token_set_ratio(low, str(r[2]).lower()), default=None)
            score = token_set_ratio(low, str(best[2]).lower()) if best else 0
            if best and score >= 55:
                return {"message": best[3], "done": True, "scheme_id": best[1]}
        except Exception:
            words=set(low.split())
            best=None; score=0
            for r in rows:
                overlap=len(words & set(str(r[2]).lower().split()))
                if overlap>score: best,score=r,overlap
            if best and score>=2:
                return {"message":best[3],"done":True,"scheme_id":best[1]}
        # Search scheme descriptions/benefits for natural questions.
        for row in schemes:
            hay=f"{row[1]} {row[2]} {row[3]}".lower()
            if any(w in hay for w in low.split() if len(w)>4):
                return {"message":f"{row[1]}: {row[2]} {row[3]}", "done":True, "scheme":dict(row), "application_link":row[4]}
        return {"message":"I can understand free-form farmer questions and search the AgriVoice knowledge base for government schemes, eligibility, crop insurance, documents, application steps and farmer support. Please mention your crop, problem, scheme name or what help you need, and I will ask only the missing questions.","done":False}

    def _all_schemes_response(self):
        with get_connection() as conn:
            rows=[dict(r) for r in conn.execute("SELECT scheme_id, scheme_name, description, benefits, application_link FROM schemes WHERE active=1 ORDER BY scheme_name").fetchall()]
        names=", ".join(r["scheme_name"] for r in rows)
        return {"message":f"The AgriVoice database currently includes: {names}. Tell me what you grow, your farming situation, or the problem you are facing and I can narrow the list and check preliminary eligibility.","done":True,"schemes":rows}

    def _final_scheme_response(self, scheme_id):
        details = scheme_details(scheme_id)
        if not details:
            return None
        return {
            "message": f"{details['scheme_name']}: {details['description']} {details['benefits']} You can open the official application link below.",
            "done": True,
            "scheme": details,
            "application_link": details["application_link"],
        }

    def _finish_guidance(self, state):
        profile = state["profile"]
        eligibility = check_eligibility({**profile, "intent": state["intent"]})
        recommendations = recommend_schemes({**profile, "query": state.get("original_query", ""), "problem": "crop damage" if state["intent"] == "crop_damage" else ""})
        eligible = eligibility["eligible_schemes"]
        recs = recommendations["recommendations"]
        names = ", ".join(item["scheme"] for item in eligible[:3])
        if names:
            message = f"Based on the information you provided, these schemes appear potentially relevant: {names}. I have shown the benefits, required documents, application steps and official links below. Please verify the final eligibility on the official portal."
        elif recs:
            message = f"I found relevant schemes: {', '.join(item['scheme'] for item in recs[:3])}. I have shown their details and official links below."
        else:
            message = "I could not find a strong match from the information provided. You can ask me about a specific scheme or describe your farming problem."
        return {
            "message": message,
            "done": True,
            "collected": profile,
            "eligibility": eligibility,
            "recommendations": recs,
        }

    def process_query(self, user_input=None, session_id="default", profile=None):
        if not user_input or not str(user_input).strip():
            return {"message": "Sorry, I couldn't hear you. Please try again.", "done": False}

        user_input = str(user_input).strip()
        english_input = translate_to_english(user_input, self.current_language)
        state = self._state(session_id, profile)
        nlp = state["nlp"]

        # If a previous response asked a question, treat this message as its answer.
        if state["pending"]:
            field, _ = state["pending"][0]
            value = self._answer_to_field(field, english_input, nlp)
            if value is None:
                return {"message": f"I need a clear answer for this. {state['pending'][0][1]}", "done": False, "question_field": field, "collected": state["profile"]}
            state["profile"][field] = value
            state["pending"] = []
            next_answer = self._ask_next(state, state["intent"])
            if next_answer:
                return self._translate_response(next_answer)
            if state["intent"] == "weather_query":
                location = state["profile"].get("weather_location", "your area")
                state["intent"] = None
                return self._translate_response({
                    "message": f"For {location}, use the official India Meteorological Department weather service for current forecasts and warnings. This demo does not invent live weather values.",
                    "application_link": "https://mausam.imd.gov.in/",
                    "weather_location": location,
                    "done": True,
                })
            result = self._finish_guidance(state)
            state["intent"] = None
            return self._translate_response(result)

        intent, score = nlp.detect_intent(english_input)
        entities = nlp.extract_entities(english_input, intent)
        state["intent"] = intent
        state["original_query"] = english_input
        state["profile"].update(entities)
        state["target_scheme"] = self._scheme_id_from_text(english_input)

        if intent == "greeting":
            return self._translate_response({"message": "Hello! I can answer scheme questions, check eligibility, find relevant schemes, explain documents and application steps, and guide you through crop-damage support.", "done": True})

        if intent in {"scheme_info", "application_help", "document_query"} and state["target_scheme"]:
            result = self._final_scheme_response(state["target_scheme"])
            if intent == "document_query":
                result["message"] += " Required documents are listed below."
            elif intent == "application_help":
                result["message"] += " The application steps are listed below."
            return self._translate_response(result)

        if intent == "weather_query":
            next_answer = self._ask_next(state, intent)
            if next_answer:
                return self._translate_response(next_answer)
            location = state["profile"].get("weather_location", "your area")
            return self._translate_response({
                "message": f"For {location}, use the official India Meteorological Department weather service for current forecasts and warnings. This demo does not invent live weather values.",
                "application_link": "https://mausam.imd.gov.in/",
                "done": True,
                "weather_location": location,
            })

        if intent == "crop_advice":
            crop = entities.get("crop", "your crop")
            return self._translate_response({
                "message": f"For {crop}, I can give general farming guidance. Tell me the crop stage, soil or pest problem, and your location for more specific guidance. For pesticide or disease treatment, verify recommendations with the local agriculture department.",
                "done": True,
            })

        if intent in {"scheme_inquiry", "scheme_info"} and not state["target_scheme"]:
            if intent == "scheme_inquiry":
                return self._translate_response(self._all_schemes_response())
            return self._translate_response(self._general_answer(english_input))

        # Scheme discovery, eligibility and crop-damage queries use the same guided flow.
        if intent in {"eligibility", "scheme_inquiry", "crop_damage"}:
            next_answer = self._ask_next(state, intent)
            if next_answer:
                return self._translate_response(next_answer)
            result = self._finish_guidance(state)
            state["intent"] = None
            return self._translate_response(result)

        return self._translate_response(self._general_answer(english_input))

    def _translate_response(self, response):
        if self.current_language != "english" and response.get("message"):
            response = dict(response)
            response["original_message"] = response["message"]
            response["message"] = translate_text(response["message"], self.current_language)
        return response

    def reset(self, session_id="default"):
        self.sessions.pop(session_id, None)

    def get_intents(self):
        return list(self.sessions.get("default", {}).get("nlp", NLPEngine()).intents.keys())
