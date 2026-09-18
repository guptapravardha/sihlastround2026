import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Mic, Send, Volume2, Loader2 } from "lucide-react";
import { sendChatMessage, sendVoiceQuery, synthesizeSpeech, base64ToAudioUrl } from "../services/aiService";
import {
  isSpeechRecognitionSupported,
  startBrowserRecognition,
  speakWithBrowser,
} from "../services/browserSpeech";

const LANGUAGES = [
  { code: "hi", label: "हिंदी" },
  { code: "en", label: "English" },
  { code: "mr", label: "मराठी" },
];

function VoiceAdvisor() {
  const navigate = useNavigate();

  const [language, setLanguage] = useState("hi");
  const [listening, setListening] = useState(false);
  const [question, setQuestion] = useState("");
  const [reply, setReply] = useState("");
  const [transcript, setTranscript] = useState("");
  const [asking, setAsking] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const [error, setError] = useState("");

  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const recognitionControllerRef = useRef(null);
  const audioElRef = useRef(null);

  useEffect(() => {
    return () => {
      recognitionControllerRef.current?.stop?.();
      mediaRecorderRef.current?.stream?.getTracks?.().forEach((t) => t.stop());
    };
  }, []);

  // --- Microphone flow -------------------------------------------------
  // Primary path: record real audio -> backend /api/ai/voice (Bhashini ASR + Gemini + Bhashini TTS).
  // Fallback path (when Bhashini isn't configured on the server, or mic/recorder APIs
  // are unavailable): browser SpeechRecognition for text, then /api/ai/chat for the reply.

  const startListening = async () => {
    setError("");
    setReply("");

    const canRecordAudio =
      typeof navigator !== "undefined" && navigator.mediaDevices?.getUserMedia && window.MediaRecorder;

    if (canRecordAudio) {
      try {
        await recordAndSendAudio();
        return;
      } catch (err) {
        // If the mic/recorder pipeline itself fails (permissions, unsupported codec),
        // fall through to browser speech recognition below.
        console.warn("Audio recording pipeline failed, falling back:", err.message);
      }
    }

    fallbackToBrowserRecognition();
  };

  const recordAndSendAudio = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const mimeType = MediaRecorder.isTypeSupported("audio/webm") ? "audio/webm" : "";
    const recorder = new MediaRecorder(stream, mimeType ? { mimeType } : undefined);

    audioChunksRef.current = [];
    mediaRecorderRef.current = recorder;

    recorder.ondataavailable = (e) => {
      if (e.data.size > 0) audioChunksRef.current.push(e.data);
    };

    const stopped = new Promise((resolve) => {
      recorder.onstop = resolve;
    });

    recorder.start();
    setListening(true);

    // Record a short utterance (~5s). Users can also tap the mic again to stop early.
    const autoStopTimer = setTimeout(() => {
      if (recorder.state !== "inactive") recorder.stop();
    }, 5000);
    mediaRecorderRef.current._autoStopTimer = autoStopTimer;

    await stopped;
    clearTimeout(autoStopTimer);
    stream.getTracks().forEach((t) => t.stop());
    setListening(false);

    const audioBlob = new Blob(audioChunksRef.current, { type: mimeType || "audio/webm" });
    if (audioBlob.size < 500) {
      throw new Error("No audio captured.");
    }

    setAsking(true);
    try {
      const data = await sendVoiceQuery(audioBlob, language);
      setTranscript(data.transcript || "");
      setQuestion(data.transcript || "");
      setReply(data.reply || "");
      if (data.audio) {
        playBase64Audio(data.audio);
      } else {
        speakReply(data.reply);
      }
    } catch (err) {
      if (err.code === "BHASHINI_NOT_CONFIGURED") {
        // Server can't transcribe audio yet — retry this turn via browser recognition instead.
        fallbackToBrowserRecognition();
      } else {
        setError(err.message);
      }
    } finally {
      setAsking(false);
    }
  };

  const fallbackToBrowserRecognition = () => {
    if (!isSpeechRecognitionSupported()) {
      setError(
        "Voice input isn't available in this browser yet. Please type your question below."
      );
      setListening(false);
      return;
    }

    setListening(true);
    recognitionControllerRef.current = startBrowserRecognition(
      language,
      (text) => {
        setListening(false);
        setQuestion(text);
        setTranscript(text);
        if (text.trim()) askAdvisor(text);
      },
      (errMsg) => {
        setListening(false);
        setError(errMsg);
      }
    );
  };

  const stopListening = () => {
    recognitionControllerRef.current?.stop?.();
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
      mediaRecorderRef.current.stop();
    }
    setListening(false);
  };

  // --- Text chat flow ----------------------------------------------------

  const askAdvisor = async (overrideText) => {
    const text = (overrideText ?? question).trim();
    if (!text) {
      setError("Please enter your business question.");
      return;
    }

    setError("");
    setAsking(true);
    setReply("");

    try {
      const data = await sendChatMessage({ message: text, language });
      setReply(data.reply);
    } catch (err) {
      setError(err.message);
    } finally {
      setAsking(false);
    }
  };

  // --- Listen / TTS --------------------------------------------------------

  const playBase64Audio = (base64) => {
    try {
      const url = base64ToAudioUrl(base64);
      if (!audioElRef.current) audioElRef.current = new Audio();
      audioElRef.current.src = url;
      audioElRef.current.play();
    } catch {
      speakReply(reply);
    }
  };

  const speakReply = async (text) => {
    const textToSpeak = text || reply;
    if (!textToSpeak.trim()) {
      setError("Ask a question first so there is something to listen to.");
      return;
    }

    setSpeaking(true);
    try {
      const data = await synthesizeSpeech(textToSpeak, language);
      playBase64Audio(data.audio);
    } catch (err) {
      if (err.code === "BHASHINI_NOT_CONFIGURED") {
        speakWithBrowser(textToSpeak, language);
      } else {
        setError(err.message);
      }
    } finally {
      setSpeaking(false);
    }
  };

  const currentLanguageLabel = LANGUAGES.find((l) => l.code === language)?.label || "हिंदी";

  return (
    <div className="advisor-page">
      {/* Navbar */}
      <nav className="advisor-navbar">
        <button className="back-button" onClick={() => navigate("/dashboard")}>
          <ArrowLeft size={20} />
        </button>

        <div className="advisor-logo">
          <span>🌱</span>
          <strong>Gram-Pragati AI</strong>
        </div>

        <select
          className="advisor-language-select"
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          aria-label="Choose language"
        >
          {LANGUAGES.map((l) => (
            <option key={l.code} value={l.code}>
              {l.label}
            </option>
          ))}
        </select>
      </nav>

      {/* Main */}
      <main className="advisor-container">
        <div className="advisor-header">
          <h1>Tell me your business idea</h1>

          <p>
            Speak in Hindi, English or Marathi.
            <br />
            I'll help you understand your business idea.
          </p>
        </div>

        {error && <div className="advisor-error-banner">{error}</div>}

        {/* Microphone */}
        <div className="mic-section">
          <button
            className={`big-mic ${listening ? "listening" : ""}`}
            onClick={listening ? stopListening : startListening}
            disabled={asking}
            aria-label={listening ? "Stop listening" : "Start listening"}
          >
            {asking ? <Loader2 size={55} className="spin" /> : <Mic size={55} />}
          </button>

          <p className="mic-status">
            {listening
              ? "Listening... tap again to stop"
              : asking
              ? "Thinking..."
              : `Tap the microphone and speak (${currentLanguageLabel})`}
          </p>
        </div>

        {/* Input */}
        <div className="advisor-input-card">
          <textarea
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Example: Mujhe dairy business shuru karna hai..."
            rows="4"
            disabled={asking}
          />

          <div className="input-actions">
            <button className="listen-button" onClick={() => speakReply()} disabled={speaking || !reply}>
              <Volume2 size={18} />
              {speaking ? "Speaking..." : "Listen"}
            </button>

            <button className="ask-button" onClick={() => askAdvisor()} disabled={asking}>
              <Send size={18} />
              {asking ? "Asking..." : "Ask Advisor"}
            </button>
          </div>
        </div>

        {reply && (
          <div className="advisor-response-card">
            <h4>AI Advisor</h4>
            <p className="advisor-response-text">{reply}</p>
            {transcript && <p className="advisor-transcript">You said: "{transcript}"</p>}
          </div>
        )}

        {/* Examples */}
        <section className="examples-section">
          <h3>Try asking</h3>

          <div className="example-buttons">
            <button
              disabled={asking}
              onClick={() => setQuestion("Mere paas ₹20,000 hain. Main kaunsa business kar sakta hoon?")}
            >
              💰 I have ₹20,000
            </button>

            <button disabled={asking} onClick={() => setQuestion("Mere gaon mein kaunsa business chal sakta hai?")}>
              🏪 Business for my village
            </button>

            <button disabled={asking} onClick={() => setQuestion("Mujhe dairy business shuru karna hai.")}>
              🐄 Dairy business
            </button>
          </div>
        </section>

        {/* Trust */}
        <div className="advisor-trust">
          <span>🔵 AI Suggestion</span>
          <span>🟡 Calculated</span>
          <span>🟢 Verify Important Information</span>
        </div>

        <p className="advisor-disclaimer">
          AI suggestions are for guidance only. Financial and government information should be
          verified before making decisions.
        </p>
      </main>
    </div>
  );
}

export default VoiceAdvisor;
