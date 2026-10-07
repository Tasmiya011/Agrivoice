# backend/nlp_engine.py

import re
from .intents_config import INTENTS, LANGUAGE_MAPPING

class NLPEngine:
    def __init__(self):
        self.intents = INTENTS
        self.current_intent = None
        self.collected_info = {}
        self.conversation_stage = 0
        
    def detect_intent(self, text):
        """Detect the intent from user's text query"""
        text_lower = text.lower().strip()
        
        # Score each intent based on keyword matches
        intent_scores = {}
        for intent_name, intent_data in self.intents.items():
            score = 0
            for keyword in intent_data["keywords"]:
                if keyword in text_lower:
                    score += 1
            intent_scores[intent_name] = score
        
        # Get the intent with highest score
        if intent_scores:
            best_intent = max(intent_scores, key=intent_scores.get)
            if intent_scores[best_intent] > 0:
                return best_intent, intent_scores[best_intent]
        
        return "general_help", 0
    
    def extract_entities(self, text, intent):
        """Extract key information from user text based on intent"""
        entities = {}
        text_lower = text.lower()
        
        # Extract crop names
        crop_keywords = ["paddy", "wheat", "rice", "sugarcane", "cotton", "mango", "banana", "tomato", "potato", "onion", "groundnut", "maize"]
        for crop in crop_keywords:
            if crop in text_lower:
                entities["crop"] = crop
                break
        
        # Extract numbers (area, loss percentage, etc.)
        numbers = re.findall(r'\d+', text)
        if numbers:
            if "area" in text_lower or "acre" in text_lower:
                entities["area"] = numbers[0]
            elif "percent" in text_lower or "%" in text_lower:
                entities["loss_percentage"] = numbers[0]
            elif len(numbers) > 0:
                # If no context, store as generic number
                entities["number"] = numbers[0]
        
        # Extract location
        state_keywords = ["karnataka", "tamil nadu", "punjab", "up", "uttar pradesh", "bihar", "gujarat", "rajasthan", "maharashtra", "andhra", "telangana", "madhya pradesh", "west bengal"]
        for state in state_keywords:
            if state in text_lower:
                entities["state"] = state
                break
        
        return entities
    
    def start_conversation(self, intent):
        """Initialize conversation flow for the detected intent"""
        self.current_intent = intent
        self.conversation_stage = 0
        self.collected_info = {}
        
        intent_data = self.intents.get(intent, {})
        questions = intent_data.get("questions", [])
        
        if not questions:
            return {
                "message": intent_data.get("response_template", "How can I help you?"),
                "done": True,
                "stage": 0,
                "total_stages": 0,
                "collected": {}
            }
        
        return {
            "message": questions[0],
            "stage": self.conversation_stage,
            "total_stages": len(questions),
            "done": False,
            "collected": {}
        }
    
    def process_conversation(self, user_text):
        """Process the next step in conversation"""
        if self.current_intent is None:
            # First interaction
            intent, score = self.detect_intent(user_text)
            if score == 0:
                return {"message": "I didn't quite understand. Could you please rephrase?", "done": False}
            return self.start_conversation(intent)
        
        # Continue existing conversation
        intent_data = self.intents.get(self.current_intent, {})
        questions = intent_data.get("questions", [])
        
        # Extract and store information
        entities = self.extract_entities(user_text, self.current_intent)
        self.collected_info.update(entities)
        
        # Move to next question
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
            # All questions answered - generate final response
            final_response = self.generate_final_response()
            return {
                "message": final_response,
                "collected": self.collected_info,
                "done": True,
                "stage": self.conversation_stage,
                "total_stages": len(questions)
            }
    
    def generate_final_response(self):
        """Generate the final response based on collected information"""
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
        """Reset the conversation state"""
        self.current_intent = None
        self.conversation_stage = 0
        self.collected_info = {}