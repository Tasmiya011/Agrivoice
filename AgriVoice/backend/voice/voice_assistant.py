"""Conversation orchestration for the AgriVoice web application.

The browser handles microphone capture and speech playback.  This class handles
language conversion, intent detection and multi-turn conversation state.
"""

from .nlp_engine import NLPEngine
from .intents_config import LANGUAGE_MAPPING
from .translator import translate_text, translate_to_english
from .translations import SUPPORTED_LANGUAGES


class VoiceAssistant:
    def __init__(self, enable_server_tts=False):
        self.nlp = NLPEngine()
        self.enable_server_tts = enable_server_tts
        self.current_language = "english"
        self.supported_languages = {
            key: {"stt": self._stt_code(key), "tts": val["code"]}
            for key, val in SUPPORTED_LANGUAGES.items()
        }

        # Optional server-side speech components. They are not required for the
        # web app because the browser owns the microphone/speaker.
        self.stt = None
        self.tts = None

    def _stt_code(self, lang):
        codes = {
            "english": "en-IN", "hindi": "hi-IN", "kannada": "kn-IN",
            "tamil": "ta-IN", "telugu": "te-IN", "malayalam": "ml-IN",
            "marathi": "mr-IN", "bengali": "bn-IN", "punjabi": "pa-IN",
        }
        return codes.get(lang, "en-IN")

    def set_language(self, language_code):
        if language_code in self.supported_languages:
            self.current_language = language_code
            return True
        return False

    def process_query(self, user_input=None):
        if not user_input or not str(user_input).strip():
            msg = "Sorry, I couldn't hear you. Please try again."
            return {"message": translate_text(msg, self.current_language), "done": False}

        user_input = str(user_input).strip()
        english_input = translate_to_english(user_input, self.current_language)

        try:
            response = self.nlp.process_conversation(english_input)
        except Exception:
            response = {
                "message": "Sorry, I had trouble understanding that. Please try again.",
                "done": False,
            }

        if isinstance(response, dict):
            message = response.get("message", "I didn't understand.")
            if self.current_language != "english":
                response["original_message"] = message
                response["message"] = translate_text(message, self.current_language)
            return response

        message = str(response)
        if self.current_language != "english":
            message = translate_text(message, self.current_language)
        return {"message": message, "done": True}

    def reset(self):
        self.nlp.reset()

    def get_intents(self):
        return self.nlp.intents
