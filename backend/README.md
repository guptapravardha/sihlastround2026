# Gram-Pragati AI — Backend (Phase 1: Voice + Chat Advisor)

Node.js + Express backend. Phase 1 scope: real AI chat and voice pipeline.
Database/auth land in a later phase (folders are scaffolded but not yet wired).

## Setup

```bash
cd backend
npm install
cp .env.example .env
# edit .env and add at least GEMINI_API_KEY
npm run dev
```

Server starts on `http://localhost:5000` (override with `PORT`).

## Required credentials

| Variable | Required for | Where to get it |
|---|---|---|
| `GEMINI_API_KEY` | `/api/ai/chat`, `/api/ai/voice` text reasoning | https://aistudio.google.com/app/apikey |
| `BHASHINI_API_KEY`, `BHASHINI_USER_ID`, `BHASHINI_ULCA_API_KEY`, `BHASHINI_PIPELINE_ID` | server-side speech-to-text/text-to-speech in `/api/ai/voice` and `/api/ai/tts` | https://bhashini.gov.in — register for ULCA API access |

**If Bhashini credentials are missing**, the voice endpoints respond with
`503 BHASHINI_NOT_CONFIGURED` and the frontend automatically falls back to the
browser's built-in `SpeechRecognition` / `speechSynthesis` APIs so voice still
works end-to-end (with English/Hindi/Marathi support, subject to what the
user's browser supports) — see `FALLBACK STRATEGY` in the project brief.

## Endpoints (Phase 1)

- `GET  /api/health` — reports which integrations are configured
- `POST /api/ai/chat` — `{ message, language?, history? }` → `{ reply, language }`
- `POST /api/ai/voice` — multipart form: `audio` (file), `language` → `{ transcript, reply, audio, language }`
- `POST /api/ai/tts` — `{ text, language? }` → `{ audio, language }` (base64 wav)

All responses use the standard envelope:
```json
{ "success": true, "data": {}, "message": "" }
```
or
```json
{ "success": false, "error": { "code": "...", "message": "..." } }
```

## Security notes

- `helmet`, CORS allow-list (`CORS_ORIGIN`), and a 30 req/min rate limiter on `/api/ai/*` are enabled.
- No API keys are ever sent to the frontend; all third-party calls happen server-side.
- The Gemini system prompt explicitly instructs the model to treat any retrieved/business
  context data as reference data, never as instructions (prompt-injection guard), and to
  never invent financial figures or government scheme details.
- Audio is processed in memory only (multer memory storage) — never written to disk.

## Folder layout

```
backend/src/
  config/        env loading + feature-flag helpers
  middleware/    error handling
  routes/        Express routers
  controllers/   HTTP layer (validation, response shaping)
  ai/            Gemini + Bhashini integration services
  utils/         shared response/error helpers
  server.js      entrypoint
  app.js         Express app assembly
```

Future phases will add `models/`, `db/`, and `integrations/` for auth, PostgreSQL and
government-scheme RAG, following the same routes → controllers → services layering.
