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

## Added in the integrated version

- Natural-language voice/chat flow is no longer limited to three fixed example questions.
- Multi-turn eligibility flow asks for missing information and then checks all stored schemes.
- Eligibility/recommendation results include benefits, required documents, application steps and official application links.
- Scheme detail pages load eligibility rules, documents, steps and official links from the Flask API.
- SQLite-backed farmer registration/login with persistent accounts and sessions.
- Duplicate email/mobile registration is rejected with a popup/message.
- Registration validation for name, 10-digit mobile, email, password policy and required address fields.
- Village, Taluka, District and State are stored in the user database and shown in My Profile after login.
- Profile editing updates the same database record.
- Voice conversations use a per-user session so one farmer's pending eligibility questions do not mix with another farmer's conversation.

### New authentication APIs

```text
POST /auth/register
POST /auth/login
POST /auth/logout
GET  /auth/me
PUT  /profile
```

### Example voice flow

```text
Farmer: My sugarcane crop was damaged by heavy rain.
AgriVoice: Do you own agricultural land?
Farmer: Yes.
AgriVoice: What type of farmer are you?
Farmer: Small farmer.
AgriVoice: Are you an income-tax payer?
Farmer: No.
AgriVoice: Which state is your farm in?
Farmer: Karnataka.
AgriVoice: Shows potentially relevant schemes + benefits + documents + steps + official links.
```

The system intentionally labels the result as **preliminary guidance**, because the real government portal/department/bank remains the final authority for eligibility and application status.

## New integrated features (October 2026)
- Registration now requires a valid email, 10-digit mobile number, password policy, farmer type, country/state/district/taluka/village.
- Country is currently India; state and district are dependent dropdowns using local location data. Village is user-entered and limited to 2–20 letters/spaces.
- Farmer type is a dropdown with multiple farmer categories.
- Login accepts the registered email or mobile number and password; unknown credentials are rejected.
- Duplicate email/mobile registration is rejected.
- Address is stored in SQLite and displayed again after login in the Profile page.
- Scheme eligibility details now show required documents with explanations, detailed application steps, and official application links.
- The whole React website uses one global language selector for English, Marathi, Hindi and Kannada; the selection is persisted in the browser and applies across navigation, authentication, profile, eligibility, scheme details, documents, guidance, settings and voice UI.
- Scheme names, benefits, eligibility details, document explanations and application steps are localized for the four supported languages.
- Voice assistant accepts free-form farmer questions and uses intent/entity extraction, FAQ matching, scheme matching and multi-turn follow-up questions instead of only three fixed questions.

## Voice libraries
The browser voice module uses the Chrome Web Speech API (`SpeechRecognition` / `speechSynthesis`) for microphone input and spoken replies, so no browser package is required. The backend requirements also include optional Python voice libraries:
- `SpeechRecognition` – Python speech-recognition support
- `pyttsx3` – offline text-to-speech
- `gTTS` + `playsound3` – online Google text-to-speech option
- `rapidfuzz` – flexible matching of free-form farmer questions to the local FAQ knowledge base
- built-in local dictionaries – offline multilingual UI text

For the current React application, **Chrome Web Speech API is the primary microphone path**. `PyAudio` is not required unless the project is later changed to capture the microphone directly from Python on the server.


## Eligibility rules and translation service update

- The eligibility engine now displays only schemes that match the answers supplied. It asks whether the farmer owns land, cultivates land, farmer type, state, income-tax status and whether other PM-KISAN exclusions may apply. A blank required answer does not produce a positive match.
- PM-KISAN is screened as a landholding-farmer-family scheme, with income-tax and additional exclusion checks. Official land-record/family conditions still need verification.
- KCC preliminary matching includes owner cultivators and eligible tenant/oral-lessee/sharecropper categories, subject to bank assessment.
- PMFBY is only shown when a crop and state are provided and the farmer indicates ownership/cultivation; actual cover depends on the notified crop, area, season and applicable enrolment/claim rules.
- Soil Health Card guidance is only shown when the answers indicate ownership or cultivation of a farm/field.
- The global language selector now calls the backend `/translate/batch` endpoint, which uses `deep-translator` (Google Translate service) for runtime translation into English, Marathi, Hindi and Kannada. Internet access is required for API translation; if the service fails, original text remains rather than showing fabricated translation.
- A Back button is available on non-home pages.

### Official scheme references

- PM-KISAN operational guidelines: https://pmkisan.gov.in/Documents/RevisedPM-KISANOperationalGuidelines%28English%29.pdf
- PM-KISAN official portal: https://pmkisan.gov.in/
- Kisan Credit Card eligibility and application guidance (Government of India myScheme): https://www.myscheme.gov.in/schemes/kcc
- PM Fasal Bima Yojana official portal: https://pmfby.gov.in/
- Soil Health Card official portal: https://soilhealth.dac.gov.in/

These rules are an initial eligibility filter based on the cited public guidance, not an official government eligibility decision. Scheme notifications and requirements can change.


## Voice assistant: exact execution steps

1. Start the backend by double-clicking `start_backend.bat`, or in a terminal run:
   ```powershell
   cd backend
   py -m venv venv
   .\venv\Scripts\Activate.ps1
   python -m pip install -r requirements.txt
   python app.py
   ```
2. In a second terminal at the main `AgriVoice` folder, run:
   ```powershell
   npm install
   npm run dev
   ```
3. Open the Vite URL, normally `http://localhost:5173`, in Google Chrome or Microsoft Edge.
4. Open **Voice Assistant**, choose English/Marathi/Hindi/Kannada, click the microphone button and allow microphone access.
5. Speak naturally, for example: “My sugarcane crop was damaged by heavy rain.” You can also type the question and press Send if microphone recognition is unavailable.
6. Keep both backend and frontend terminals open. Translation API calls require internet access.

The backend translation endpoint is `POST /translate/batch`, accepting `{ "texts": ["text one", "text two"], "target": "mr" }`; target codes are `en`, `mr`, `hi`, and `kn`. Translation is provided at runtime using `deep-translator`. If the external translation service is unavailable, the UI keeps the source text rather than inventing a translation.


## Offline multilingual mode (no Google Cloud billing/API key)

This version does not call Google Translate or `deep-translator`. The frontend has built-in translated dictionaries for English, Marathi, Hindi and Kannada for the interface strings already defined in the project. Scheme names/details also have a small built-in localized catalogue. Text that is not present in a dictionary is left unchanged; this avoids misleading or unreliable automatic translations. To translate every new dynamic scheme/FAQ/chatbot response, add its translated value to the corresponding local dictionary.

## Exact Windows execution steps

### Backend (PowerShell terminal 1)
From the extracted `AgriVoice` folder:

```powershell
cd backend
py -m venv venv
.\\venv\\Scripts\\Activate.ps1
python -m pip install --upgrade pip
python -m pip install -r requirements.txt
python app.py
```

If PowerShell blocks activation, run `Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass` in that terminal, then activate again. If `venv` already exists, skip `py -m venv venv`.

Check the backend at `http://127.0.0.1:5000/health`.

### Frontend (PowerShell terminal 2)
Open a second terminal in the main `AgriVoice` folder:

```powershell
npm install
npm run dev
```

Open the URL printed by Vite, usually `http://localhost:5173`. Keep both terminals running.

### Use the speak module
1. Open the site in Google Chrome or Microsoft Edge.
2. Open **Voice Assistant** and select English, Marathi, Hindi or Kannada.
3. Click the microphone button and choose **Allow** when the browser asks for microphone permission.
4. Speak a question, e.g. “My sugarcane crop was damaged by heavy rain.” The recognized text is sent to the Flask `/voice/process` endpoint.
5. The answer appears in chat and the browser's speech synthesis reads it aloud. If the microphone is unsupported or denied, type the question and press Send.
6. If it doesn't speak, check that the computer is not muted and that the selected browser voice/language is available.

Browser speech recognition requires a supported browser and may need internet depending on the browser/language. The browser speaks the returned response; it does not require Python microphone libraries. The voice answer quality is limited to the local FAQ/intent/scheme knowledge and is not a guaranteed answer to every possible question.
