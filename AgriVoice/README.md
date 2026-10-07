# AgriVoice — Integrated React + Flask + Voice/NLP

AgriVoice is a multilingual agricultural government-scheme guidance application. The React frontend and Flask backend are now integrated with the voice/NLP modules from the original `MP` project.

## Project structure

```text
AgriVoice/
├── src/
│   ├── main.jsx
│   ├── styles.css
│   └── api.js
├── public/images/
├── backend/
│   ├── app.py
│   ├── db.py
│   ├── engine.py
│   ├── requirements.txt
│   ├── voice/
│   │   ├── voice_assistant.py
│   │   ├── nlp_engine.py
│   │   ├── intents_config.py
│   │   ├── translator.py
│   │   ├── translations.py
│   │   ├── stt_module.py
│   │   └── tts_module.py
│   ├── database/
│   └── data/
├── package.json
└── index.html
```

## How the integration works

```text
Browser microphone
       ↓
Browser Speech Recognition
       ↓ text
React Voice page
       ↓ POST /voice/process
Flask backend
       ↓
VoiceAssistant → Translator → NLP Engine
       ↓ JSON response
React
       ↓
Browser Speech Synthesis + chat display
```

The browser owns the microphone and speaker. This is intentional: a Flask server running locally should not need to access the browser's microphone.

## Backend API

Existing APIs:

```text
GET  /health
GET  /schemes
GET  /schemes/{id}
GET  /schemes/{id}/documents
GET  /faqs
POST /eligibility/check
POST /schemes/recommend
```

Integrated voice APIs:

```text
GET  /voice/languages
POST /voice/language
POST /voice/process
POST /voice/reset
GET  /voice/intents
```

Example:

```http
POST http://localhost:5000/voice/process
Content-Type: application/json
```

```json
{
  "language": "english",
  "text": "My crop is damaged"
}
```

## Run on Windows

### 1. Backend

Open PowerShell:

```powershell
cd AgriVoice\backend
py -m venv venv
.\venv\Scripts\Activate.ps1
python -m pip install -r requirements.txt
python app.py
```

Backend:

```text
http://localhost:5000
```

Test:

```text
http://localhost:5000/health
http://localhost:5000/schemes
```

### 2. Frontend

Open a second PowerShell window:

```powershell
cd AgriVoice
npm install
npm run dev
```

Open the Vite URL shown in the terminal, normally:

```text
http://localhost:5173
```

### 3. Voice

Use Google Chrome for the best browser Speech Recognition support. Allow microphone access when Chrome asks.

You can also type a message in the Voice Assistant page, so the NLP backend can be tested even if microphone permissions are unavailable.

## Important

Do not copy the old `agrivoice_env` virtual environment from the MP project into this project. Create a fresh `venv` using the requirements above.

The application remains a guidance/recommendation system. Eligibility results and scheme information must be verified against official government sources before real-world use.
