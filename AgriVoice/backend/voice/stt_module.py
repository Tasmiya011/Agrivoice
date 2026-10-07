# backend/stt_module.py

import speech_recognition as sr

class SpeechToText:
    def __init__(self):
        self.recognizer = sr.Recognizer()
        try:
            self.microphone = sr.Microphone()
        except:
            print("⚠️ Warning: No microphone found. Voice input will not work.")
            self.microphone = None
        
    def listen_and_convert(self, timeout=5, phrase_time_limit=10, language="en-IN"):
        """Listens to microphone and converts speech to text"""
        if self.microphone is None:
            print("❌ No microphone available")
            return None
            
        try:
            print("🎤 Listening... Please speak clearly.")
            
            with self.microphone as source:
                self.recognizer.adjust_for_ambient_noise(source, duration=1)
                audio = self.recognizer.listen(source, timeout=timeout, phrase_time_limit=phrase_time_limit)
                
            print("🔄 Processing your speech...")
            
            # Try Google Speech Recognition
            text = self.recognizer.recognize_google(audio, language=language)
            print(f"✅ You said: {text}")
            return text
            
        except sr.WaitTimeoutError:
            print("⏰ No speech detected. Please try again.")
            return None
        except sr.UnknownValueError:
            print("❌ Could not understand audio. Please speak clearly.")
            return None
        except sr.RequestError as e:
            print(f"❌ Speech service error: {e}")
            return None
        except Exception as e:
            print(f"❌ Error: {e}")
            return None