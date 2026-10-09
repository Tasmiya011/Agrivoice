INTENTS = {
    "eligibility": {"keywords": ["eligible", "eligibility", "qualify", "can i get"], "questions": []},
    "scheme_inquiry": {"keywords": ["scheme", "yojana", "subsidy", "benefit"], "questions": []},
    "scheme_info": {"keywords": ["what is", "details", "benefit"], "questions": []},
    "crop_damage": {"keywords": ["crop damage", "crop damaged", "insurance", "claim", "loss"], "questions": []},
    "application_help": {"keywords": ["how to apply", "application", "registration"], "questions": []},
    "document_query": {"keywords": ["document", "documents", "proof"], "questions": []},
    "weather_query": {"keywords": ["weather", "forecast", "rain", "temperature"], "questions": []},
    "crop_advice": {"keywords": ["fertilizer", "pesticide", "sowing", "harvest", "disease"], "questions": []},
    "greeting": {"keywords": ["hello", "hi", "namaste"], "questions": []},
    "general_help": {"keywords": [], "questions": []},
}
LANGUAGE_MAPPING = {
    "hindi": {"greeting": "नमस्ते! मैं आपकी कैसे मदद कर सकता हूँ?", "error": "क्षमा करें, मुझे समझ नहीं आया। कृपया फिर से कहें।"},
    "kannada": {"greeting": "ನಮಸ್ಕಾರ! ನಾನು ನಿಮಗೆ ಹೇಗೆ ಸಹಾಯ ಮಾಡಬಹುದು?", "error": "ಕ್ಷಮಿಸಿ, ನನಗೆ ಅರ್ಥವಾಗಲಿಲ್ಲ. ದಯವಿಟ್ಟು ಮತ್ತೆ ಹೇಳಿ."},
    "english": {"greeting": "Hello! How can I help you today?", "error": "Sorry, I didn't understand. Please say that again."},
}
