// Browser-native speech helpers used as a graceful fallback when the backend
// Bhashini integration isn't configured with credentials yet (see aiService.js).

const RECOGNITION_LOCALE = { en: "en-IN", hi: "hi-IN", mr: "mr-IN" };
const SYNTHESIS_LOCALE = { en: "en-IN", hi: "hi-IN", mr: "mr-IN" };

export function isSpeechRecognitionSupported() {
  return typeof window !== "undefined" && (window.SpeechRecognition || window.webkitSpeechRecognition);
}

export function isSpeechSynthesisSupported() {
  return typeof window !== "undefined" && "speechSynthesis" in window;
}

/**
 * Start browser speech recognition for one utterance.
 * @param {'en'|'hi'|'mr'} language
 * @param {(transcript: string) => void} onResult
 * @param {(error: string) => void} onError
 * @returns {{ stop: () => void }} controller to stop listening early
 */
export function startBrowserRecognition(language, onResult, onError) {
  const SpeechRecognitionImpl = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRecognitionImpl) {
    onError("Speech recognition is not supported in this browser.");
    return { stop: () => {} };
  }

  const recognition = new SpeechRecognitionImpl();
  recognition.lang = RECOGNITION_LOCALE[language] || "en-IN";
  recognition.interimResults = false;
  recognition.maxAlternatives = 1;

  recognition.onresult = (event) => {
    const transcript = event.results?.[0]?.[0]?.transcript || "";
    onResult(transcript);
  };

  recognition.onerror = (event) => {
    onError(event.error || "Could not hear you clearly. Please try again.");
  };

  try {
    recognition.start();
  } catch (err) {
    onError(err.message);
  }

  return { stop: () => recognition.stop() };
}

/**
 * Speak text aloud using the browser's built-in speech synthesis.
 */
export function speakWithBrowser(text, language = "hi") {
  if (!isSpeechSynthesisSupported()) return;
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = SYNTHESIS_LOCALE[language] || "hi-IN";
  window.speechSynthesis.speak(utterance);
}
