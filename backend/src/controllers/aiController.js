import { askGemini } from "../ai/geminiService.js";
import { bhashiniSpeechToText, bhashiniTextToSpeech } from "../ai/bhashiniService.js";
import { isBhashiniConfigured } from "../config/env.js";
import { ok, ApiError } from "../utils/apiResponse.js";
import { getBusinessContextForUser } from "../services/businessContext.js";

const SUPPORTED_LANGUAGES = ["en", "hi", "mr"];

function normalizeLanguage(language) {
  return SUPPORTED_LANGUAGES.includes(language) ? language : "en";
}

// POST /api/ai/chat
// body: { message: string, language?: 'en'|'hi'|'mr', history?: [{role, text}] }
export async function chat(req, res, next) {
  try {
    const { message, language, history } = req.body || {};
    if (!message || typeof message !== "string") {
      throw new ApiError(400, "INVALID_MESSAGE", "`message` (string) is required.");
    }

    // Real, authenticated business context only — never fabricated. Anonymous
    // requests (no/invalid token) simply get general guidance, same as before.
    const businessContext = req.user ? await getBusinessContextForUser(req.user.id) : null;

    const { text } = await askGemini({
      message,
      language: normalizeLanguage(language),
      history: Array.isArray(history) ? history.slice(-10) : [],
      businessContext,
    });

    return ok(res, { reply: text, language: normalizeLanguage(language) });
  } catch (err) {
    next(err);
  }
}

// POST /api/ai/voice  (multipart/form-data, field name "audio")
// fields: audio (file), language ('en'|'hi'|'mr')
export async function voice(req, res, next) {
  try {
    const language = normalizeLanguage(req.body?.language);

    if (!req.file || !req.file.buffer) {
      throw new ApiError(400, "NO_AUDIO", "No audio file received under field `audio`.");
    }

    if (!isBhashiniConfigured()) {
      // Graceful fallback: tell the frontend to use browser-based speech recognition
      // instead of failing the whole request.
      throw new ApiError(
        503,
        "BHASHINI_NOT_CONFIGURED",
        "Server-side voice transcription is not configured yet. Use on-device speech " +
          "recognition, then call /api/ai/chat with the transcribed text."
      );
    }

    const transcript = await bhashiniSpeechToText(req.file.buffer, language);

    const businessContext = req.user ? await getBusinessContextForUser(req.user.id) : null;
    const { text: replyText } = await askGemini({
      message: transcript,
      language,
      businessContext,
    });

    let audioBase64 = null;
    try {
      audioBase64 = await bhashiniTextToSpeech(replyText, language);
    } catch (ttsErr) {
      // Voice reply audio failing shouldn't fail the whole turn — text still works.
      console.warn("[voice] TTS step failed, returning text only:", ttsErr.message);
    }

    return ok(res, {
      transcript,
      reply: replyText,
      audio: audioBase64, // base64 wav, or null if TTS unavailable
      language,
    });
  } catch (err) {
    next(err);
  }
}

// POST /api/ai/tts
// body: { text: string, language?: 'en'|'hi'|'mr' }
export async function tts(req, res, next) {
  try {
    const { text, language } = req.body || {};
    if (!text || typeof text !== "string") {
      throw new ApiError(400, "INVALID_TEXT", "`text` (string) is required.");
    }

    if (!isBhashiniConfigured()) {
      throw new ApiError(
        503,
        "BHASHINI_NOT_CONFIGURED",
        "Server-side speech synthesis is not configured. Use the browser's built-in " +
          "speech synthesis (window.speechSynthesis) as a fallback."
      );
    }

    const audioBase64 = await bhashiniTextToSpeech(text, normalizeLanguage(language));
    return ok(res, { audio: audioBase64, language: normalizeLanguage(language) });
  } catch (err) {
    next(err);
  }
}
