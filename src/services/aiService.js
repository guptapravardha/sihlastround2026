const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

async function parseJsonSafe(response) {
  try {
    return await response.json();
  } catch {
    return null;
  }
}

/**
 * Send a text message to the AI advisor.
 * @param {{message: string, language?: 'en'|'hi'|'mr', history?: Array<{role:string,text:string}>}} params
 */
export async function sendChatMessage({ message, language = "en", history = [] }) {
  const response = await fetch(`${API_BASE}/api/ai/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message, language, history }),
  });

  const body = await parseJsonSafe(response);

  if (!response.ok || !body?.success) {
    const error = new Error(body?.error?.message || "The AI advisor is unavailable right now.");
    error.code = body?.error?.code || "UNKNOWN_ERROR";
    throw error;
  }

  return body.data; // { reply, language }
}

/**
 * Send recorded audio to the backend voice pipeline (Bhashini ASR -> Gemini -> Bhashini TTS).
 * @param {Blob} audioBlob
 * @param {'en'|'hi'|'mr'} language
 */
export async function sendVoiceQuery(audioBlob, language = "hi") {
  const formData = new FormData();
  formData.append("audio", audioBlob, "recording.webm");
  formData.append("language", language);

  const response = await fetch(`${API_BASE}/api/ai/voice`, {
    method: "POST",
    body: formData,
  });

  const body = await parseJsonSafe(response);

  if (!response.ok || !body?.success) {
    const error = new Error(body?.error?.message || "Voice assistant is unavailable right now.");
    error.code = body?.error?.code || "UNKNOWN_ERROR";
    throw error;
  }

  return body.data; // { transcript, reply, audio (base64|null), language }
}

/**
 * Ask the backend to synthesize speech for arbitrary text via Bhashini.
 * Throws with code BHASHINI_NOT_CONFIGURED if unavailable — caller should
 * fall back to window.speechSynthesis in that case.
 */
export async function synthesizeSpeech(text, language = "hi") {
  const response = await fetch(`${API_BASE}/api/ai/tts`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text, language }),
  });

  const body = await parseJsonSafe(response);

  if (!response.ok || !body?.success) {
    const error = new Error(body?.error?.message || "Speech playback is unavailable right now.");
    error.code = body?.error?.code || "UNKNOWN_ERROR";
    throw error;
  }

  return body.data; // { audio (base64), language }
}

export function base64ToAudioUrl(base64, mimeType = "audio/wav") {
  const byteChars = atob(base64);
  const byteNumbers = new Array(byteChars.length);
  for (let i = 0; i < byteChars.length; i++) {
    byteNumbers[i] = byteChars.charCodeAt(i);
  }
  const byteArray = new Uint8Array(byteNumbers);
  const blob = new Blob([byteArray], { type: mimeType });
  return URL.createObjectURL(blob);
}
