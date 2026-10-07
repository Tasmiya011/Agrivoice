# backend/translator.py

import hashlib
import time
import json
import os

from .translations import SUPPORTED_LANGUAGES

# ============ OFFLINE DICTIONARY ============
# Common farmer queries pre-translated — NO API CALL NEEDED
OFFLINE_PHRASES = {
    # Kannada → English
    "ನನ್ನ ಬೆಳೆ ಹಾನಿಯಾಗಿದೆ": "My crop is damaged",
    "ನನ್ನ ಬೆಳೆ ಹಾನಿಯಾಗಿದೆ.": "My crop is damaged",
    "ಬೆಳೆ ಹಾನಿ": "crop damage",
    "ಬೆಳೆ ವಿಮೆ": "crop insurance",
    "ಯೋಜನೆ": "scheme",
    "ಸರ್ಕಾರಿ ಯೋಜನೆ": "government scheme",
    "ಮಳೆ": "rain",
    "ಹವಾಮಾನ": "weather",
    "ಭತ್ತ": "paddy",
    "ಗೋಧಿ": "wheat",
    "ರೈತರಿಗೆ ಯಾವ ಯೋಜನೆಗಳು ಲಭ್ಯವಿವೆ": "What schemes are available for farmers",
    "ನನಗೆ ಹವಾಮಾನ ಮಾಹಿತಿ ಬೇಕು": "I need weather information",
    "ಭತ್ತವನ್ನು ಹೇಗೆ ಬೆಳೆಯುವುದು": "How to grow paddy",
    "ಭತ್ತ ಹೇಗೆ ಬೆಳೆಯುವುದು": "How to grow paddy",
    "ಧಾನ ಕೇಸೆ ಉಗಾಯೆ": "How to grow paddy",
    
    # Hindi → English
    "धान कैसे उगाएँ?": "How to grow paddy?",
    "धान कैसे उगाएँ": "How to grow paddy",
    "मेरी फसल खराब हो गई है": "My crop is damaged",
    "फसल बीमा": "crop insurance",
    "फसल नुकसान": "crop damage",
    "योजना": "scheme",
    "सरकारी योजना": "government scheme",
    "बारिश": "rain",
    "मौसम": "weather",
    "किसानों के लिए कौन सी योजनाएँ उपलब्ध हैं": "What schemes are available for farmers",
    "मुझे मौसम की जानकारी चाहिए": "I need weather information",
    
    # Tamil → English
    "என் பயிர் சேதமடைந்தது": "My crop is damaged",
    "பயிர் காப்பீடு": "crop insurance",
    "திட்டம்": "scheme",
    "மழை": "rain",
    "வானிலை": "weather",
    
    # Telugu → English
    "నా పంట దెబ్బతింది": "My crop is damaged",
    "పంట బీమా": "crop insurance",
    "పథకం": "scheme",
    "వర్షం": "rain",
    "వాతావరణం": "weather",
    
    # English → Other (responses)
    "Which crop was damaged?": {
        "kannada": "ಯಾವ ಬೆಳೆ ಹಾನಿಯಾಗಿದೆ?",
        "hindi": "कौन सी फसल खराब हुई?",
        "tamil": "எந்த பயிர் சேதமடைந்தது?",
        "telugu": "ఏ పంట దెబ్బతింది?",
    },
    "What is the area of land affected (in acres)?": {
        "kannada": "ಎಷ್ಟು ಎಕರೆ ಜಮೀನು ಹಾನಿಯಾಗಿದೆ?",
        "hindi": "कितने एकड़ भूमि प्रभावित हुई?",
        "tamil": "எத்தனை ஏக்கர் நிலம் பாதிக்கப்பட்டது?",
        "telugu": "ఎన్ని ఎకరాల భూమి దెబ్బతింది?",
    },
    "When did the damage occur?": {
        "kannada": "ಹಾನಿ ಯಾವಾಗ ಸಂಭವಿಸಿತು?",
        "hindi": "नुकसान कब हुआ?",
        "tamil": "சேதம் எப்போது நிகழ்ந்தது?",
        "telugu": "నష్టం ఎప్పుడు సంభవించింది?",
    },
    "What is the approximate loss percentage?": {
        "kannada": "ಅಂದಾಜು ನಷ್ಟ ಶೇಕಡಾವಾರು ಎಷ್ಟು?",
        "hindi": "अनुमानित नुकसान प्रतिशत क्या है?",
        "tamil": "தோராயமான இழப்பு சதவீதம் என்ன?",
        "telugu": "సుమారు నష్టం శాతం ఎంత?",
    },
    "Hello! I'm your agricultural assistant. I can help with crop insurance, government schemes, weather updates, and crop advice.": {
        "kannada": "ನಮಸ್ಕಾರ! ನಾನು ನಿಮ್ಮ ಕೃಷಿ ಸಹಾಯಕ. ಬೆಳೆ ವಿಮೆ, ಸರ್ಕಾರಿ ಯೋಜನೆಗಳು, ಹವಾಮಾನ ಮಾಹಿತಿ ಮತ್ತು ಬೆಳೆ ಸಲಹೆ ನೀಡಬಲ್ಲೆ.",
        "hindi": "नमस्ते! मैं आपका कृषि सहायक हूँ। फसल बीमा, सरकारी योजनाएँ, मौसम अपडेट और फसल सलाह में मदद कर सकता हूँ।",
    },
    "I didn't quite understand. Could you please rephrase?": {
        "kannada": "ನನಗೆ ಸರಿಯಾಗಿ ಅರ್ಥವಾಗಲಿಲ್ಲ. ದಯವಿಟ್ಟು ಮತ್ತೊಮ್ಮೆ ಹೇಳಿ.",
        "hindi": "मुझे ठीक से समझ नहीं आया। कृपया फिर से कहें।",
        "tamil": "எனக்கு சரியாக புரியவில்லை. மீண்டும் கூறுங்கள்.",
        "telugu": "నాకు సరిగ్గా అర్థం కాలేదు. దయచేసి మళ్ళీ చెప్పండి.",
    },
}

# ============ CACHE ============
CACHE_FILE = os.path.join(os.path.dirname(__file__), "translation_cache.json")
_translation_cache = {}

def _load_cache():
    """Load cache from disk"""
    global _translation_cache
    if os.path.exists(CACHE_FILE):
        try:
            with open(CACHE_FILE, "r", encoding="utf-8") as f:
                _translation_cache = json.load(f)
            print(f"✅ Loaded {len(_translation_cache)} cached translations")
        except Exception as e:
            print(f"⚠️ Cache load failed: {e}")
            _translation_cache = {}

def _save_cache():
    """Save cache to disk"""
    try:
        with open(CACHE_FILE, "w", encoding="utf-8") as f:
            json.dump(_translation_cache, f, ensure_ascii=False, indent=2)
    except Exception as e:
        print(f"⚠️ Cache save failed: {e}")

# Load cache on module import
_load_cache()

# ============ RATE LIMITER ============
_last_request_time = 0
MIN_INTERVAL = 0.4  # 2.5 requests per second (safe under Google's 5/sec limit)

def _rate_limit():
    """Ensure we don't exceed 1 request per MIN_INTERVAL seconds"""
    global _last_request_time
    now = time.time()
    elapsed = now - _last_request_time
    if elapsed < MIN_INTERVAL:
        time.sleep(MIN_INTERVAL - elapsed)
    _last_request_time = time.time()


# ============ MAIN TRANSLATION FUNCTION ============
def _translate(text, source, target):
    """Translate with offline dictionary + cache + rate limit + fallback"""
    if not text or not text.strip():
        return text
    
    # Check offline dictionary first (NO API call)
    if source == "en" or source == "auto":
        # Check reverse dictionary (English → target)
        if text in OFFLINE_PHRASES and isinstance(OFFLINE_PHRASES[text], dict):
            if target in OFFLINE_PHRASES[text]:
                return OFFLINE_PHRASES[text][target]
    else:
        # Check forward dictionary (source → English)
        if text in OFFLINE_PHRASES and isinstance(OFFLINE_PHRASES[text], str):
            if target == "en":
                return OFFLINE_PHRASES[text]
    
    # Cache key
    cache_key = f"{source}|{target}|{hashlib.md5(text.encode()).hexdigest()}"
    if cache_key in _translation_cache:
        return _translation_cache[cache_key]
    
    # Try primary: deep-translator (Google)
    translated = None
    try:
        _rate_limit()
        from deep_translator import GoogleTranslator
        translated = GoogleTranslator(source=source, target=target).translate(text)
        print(f"🔤 [Google] {source}→{target}: {text[:40]}... → {translated[:40]}...")
    except Exception as e:
        print(f"⚠️ Google failed: {str(e)[:80]}")
    
    # Fallback: MyMemory (unlimited, no rate limit)
    if not translated or translated == text:
        try:
            from deep_translator import MyMemoryTranslator
            # MyMemory uses full language names, not codes
            lang_names = {
                "en": "english", "hi": "hindi", "kn": "kannada",
                "ta": "tamil", "te": "telugu", "ml": "malayalam",
                "mr": "marathi", "bn": "bengali", "pa": "punjabi",
            }
            src_name = lang_names.get(source, "english")
            tgt_name = lang_names.get(target, "english")
            translated = MyMemoryTranslator(source=src_name, target=tgt_name).translate(text)
            print(f"🔤 [MyMemory] {source}→{target}: {text[:40]}... → {translated[:40]}...")
        except Exception as e:
            print(f"⚠️ MyMemory failed: {str(e)[:80]}")
    
    # If both fail, return original
    if not translated:
        print(f"❌ All translation providers failed for: {text[:40]}")
        return text
    
    # Save to cache
    _translation_cache[cache_key] = translated
    _save_cache()
    return translated


# ============ PUBLIC FUNCTIONS ============
def translate_to_english(text, source_language):
    """Translate any language → English"""
    if not text or source_language == "english":
        return text
    if source_language not in SUPPORTED_LANGUAGES:
        return text
    source_code = SUPPORTED_LANGUAGES[source_language]["code"]
    return _translate(text, source_code, "en")


def translate_text(text, target_language, source_language="en"):
    """Translate English text → target language"""
    if not text or target_language == "english" or target_language == source_language:
        return text
    if target_language not in SUPPORTED_LANGUAGES:
        return text
    target_code = SUPPORTED_LANGUAGES[target_language]["code"]
    return _translate(text, source_language, target_code)


def translate_response(response_text, target_language):
    """Wrapper for translating bot responses"""
    return translate_text(response_text, target_language)