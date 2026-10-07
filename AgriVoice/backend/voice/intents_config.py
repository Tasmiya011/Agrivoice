# backend/intents_config.py

INTENTS = {
    "crop_insurance": {
        "keywords": ["crop damage", "insurance", "claim", "damaged crop", "crop loss", "crop insurance", "loss of crop", "crop destroyed", "my crop is damaged"],
        "questions": [
            "Which crop was damaged?",
            "What is the area of land affected (in acres)?",
            "When did the damage occur?",
            "What is the approximate loss percentage?"
        ],
        "response_template": "I understand you want to file a crop insurance claim. Let me help you with that."
    },
    
    "scheme_inquiry": {
        "keywords": ["scheme", "government scheme", "subsidy", "benefits", "help", "support", "yojana", "pm kisan", "pmfby", "schemes for farmers"],
        "questions": [
            "Which scheme are you interested in?",
            "What is your land holding size (in acres)?",
            "Which state do you belong to?"
        ],
        "response_template": "I can help you find relevant government schemes."
    },
    
    "weather_query": {
        "keywords": ["weather", "rain", "forecast", "temperature", "climate", "monsoon", "hot", "cold", "will it rain"],
        "questions": [
            "Which location's weather do you need?",
            "Are you looking for current or forecasted weather?"
        ],
        "response_template": "Let me check the weather information for you."
    },
    
    "crop_advice": {
        "keywords": ["sow", "harvest", "plant", "fertilizer", "pesticide", "disease", "crop health", "yield", "grow", "how to grow"],
        "questions": [
            "Which crop are you growing?",
            "What is the current stage of the crop?"
        ],
        "response_template": "I can provide agricultural advice for your crop."
    },
    
    "general_help": {
        "keywords": ["hello", "hi", "help", "support", "assist", "what can you do", "hey", "namaste", "namaskara"],
        "questions": [],
        "response_template": "Hello! I'm your agricultural assistant. I can help with crop insurance, government schemes, weather updates, and crop advice."
    }
}

LANGUAGE_MAPPING = {
    "hindi": {
        "greeting": "नमस्ते! मैं आपकी कैसे मदद कर सकता हूँ?",
        "error": "क्षमा करें, मुझे समझ नहीं आया। कृपया फिर से कहें।"
    },
    "kannada": {
        "greeting": "ನಮಸ್ಕಾರ! ನಾನು ನಿಮಗೆ ಹೇಗೆ ಸಹಾಯ ಮಾಡಬಹುದು?",
        "error": "ಕ್ಷಮಿಸಿ, ನನಗೆ ಅರ್ಥವಾಗಲಿಲ್ಲ. ದಯವಿಟ್ಟು ಮತ್ತೆ ಹೇಳಿ."
    },
    "english": {
        "greeting": "Hello! How can I help you today?",
        "error": "Sorry, I didn't understand. Please say that again."
    }
}