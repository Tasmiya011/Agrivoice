# backend/tts_module.py

import pyttsx3
import os
import sys

# Check if gTTS and playsound are available
try:
    from gtts import gTTS
    import playsound
    GTTS_AVAILABLE = True
except ImportError:
    GTTS_AVAILABLE = False
    print("⚠️ gTTS or playsound not installed. Online TTS will not work.")

class TextToSpeech:
    def __init__(self, engine_type="offline"):
        """engine_type: 'offline' uses pyttsx3, 'online' uses Google TTS"""
        self.engine_type = engine_type
        self.engine = None
        
        if engine_type == "offline":
            try:
                self.engine = pyttsx3.init()
                # Configure voice properties
                try:
                    voices = self.engine.getProperty('voices')
                    for voice in voices:
                        if "female" in voice.name.lower():
                            self.engine.setProperty('voice', voice.id)
                            break
                except:
                    pass
                self.engine.setProperty('rate', 150)
                self.engine.setProperty('volume', 0.9)
            except Exception as e:
                print(f"⚠️ Offline TTS not available: {e}")
                self.engine = None
    
    def speak(self, text, language='en'):
        """Convert text to speech and play it"""
        if not text:
            return
            
        try:
            if self.engine_type == "offline" and self.engine:
                self.engine.say(text)
                self.engine.runAndWait()
            elif self.engine_type == "online" and GTTS_AVAILABLE:
                tts = gTTS(text=text, lang=language, slow=False)
                filename = "response.mp3"
                tts.save(filename)
                playsound.playsound(filename)
                os.remove(filename)
            else:
                print(f"🗣️ Would have said: {text}")
                
            print(f"🗣️ Speaking: {text}")
            
        except Exception as e:
            print(f"❌ TTS Error: {e}")
            print(f"📝 Would have said: {text}")
    
    def set_voice_property(self, property_name, value):
        """Set voice properties for offline engine"""
        if self.engine_type == "offline" and self.engine:
            try:
                self.engine.setProperty(property_name, value)
            except:
                pass
    
    def get_available_voices(self):
        """Get list of available voices"""
        if self.engine_type == "offline" and self.engine:
            try:
                return self.engine.getProperty('voices')
            except:
                return []
        return []