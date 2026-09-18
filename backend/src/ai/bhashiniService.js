import axios from "axios";
import { env, isBhashiniConfigured } from "../config/env.js";
import { ApiError } from "../utils/apiResponse.js";

// Bhashini (ULCA / NLLB) meity.gov.in inference pipeline.
// Docs: https://bhashini.gov.in / https://github.com/bhashini-ulca
const CONFIG_URL =
  "https://meity-auth.ulcacontrib.org/ulca/apis/v0/model/getModelsPipeline";
const INFERENCE_URL_FALLBACK =
  "https://dhruva-api.bhashini.gov.in/services/inference/pipeline";

const ASR_LANG_MAP = { en: "en", hi: "hi", mr: "mr" };
const TTS_VOICE_MAP = { en: "en", hi: "hi", mr: "mr" };

function assertConfigured() {
  if (!isBhashiniConfigured()) {
    throw new ApiError(
      503,
      "BHASHINI_NOT_CONFIGURED",
      "Voice (Bhashini) service is not configured on the server. Add BHASHINI_API_KEY, " +
        "BHASHINI_USER_ID and BHASHINI_ULCA_API_KEY to backend/.env. Falling back to " +
        "browser-based speech is recommended until then."
    );
  }
}

function authHeaders() {
  return {
    userID: env.bhashini.userId,
    ulcaApiKey: env.bhashini.ulcaApiKey,
    "Content-Type": "application/json",
  };
}

/**
 * Ask Bhashini's config API which service IDs to use for a given task+language,
 * then call the actual inference pipeline. This two-step flow mirrors Bhashini's
 * official ULCA integration pattern.
 */
async function getPipelineConfig(task, sourceLanguage) {
  const payload = {
    pipelineTasks: [
      {
        taskType: task, // "asr" | "tts"
        config: { language: { sourceLanguage } },
      },
    ],
    pipelineRequestConfig: { pipelineId: env.bhashini.pipelineId },
  };

  const { data } = await axios.post(CONFIG_URL, payload, { headers: authHeaders(), timeout: 15000 });
  return data;
}

/**
 * Speech-to-text via Bhashini ASR.
 * @param {Buffer} audioBuffer - raw audio bytes (webm/wav base64 content upstream)
 * @param {string} language - 'en' | 'hi' | 'mr'
 * @returns {Promise<string>} transcript
 */
export async function bhashiniSpeechToText(audioBuffer, language = "hi") {
  assertConfigured();
  const sourceLanguage = ASR_LANG_MAP[language] || "hi";

  try {
    const pipelineConfig = await getPipelineConfig("asr", sourceLanguage);
    const asrConfig = pipelineConfig?.pipelineResponseConfig?.[0]?.config?.[0];
    const inferenceEndpoint =
      pipelineConfig?.pipelineInferenceAPIEndPoint?.callbackUrl || INFERENCE_URL_FALLBACK;
    const inferenceApiKey =
      pipelineConfig?.pipelineInferenceAPIEndPoint?.inferenceApiKey?.value || env.bhashini.apiKey;

    const body = {
      pipelineTasks: [
        {
          taskType: "asr",
          config: {
            language: { sourceLanguage },
            serviceId: asrConfig?.serviceId,
            audioFormat: "webm",
            samplingRate: 16000,
          },
        },
      ],
      inputData: {
        audio: [{ audioContent: audioBuffer.toString("base64") }],
      },
    };

    const { data } = await axios.post(inferenceEndpoint, body, {
      headers: { Authorization: inferenceApiKey, "Content-Type": "application/json" },
      timeout: 30000,
    });

    const transcript = data?.pipelineResponse?.[0]?.output?.[0]?.source;
    if (!transcript) {
      throw new ApiError(502, "BHASHINI_ASR_EMPTY", "Bhashini returned no transcript.");
    }
    return transcript;
  } catch (err) {
    if (err instanceof ApiError) throw err;
    throw new ApiError(
      502,
      "BHASHINI_ASR_FAILED",
      `Bhashini ASR request failed: ${err.response?.data?.message || err.message}`
    );
  }
}

/**
 * Text-to-speech via Bhashini TTS.
 * @returns {Promise<string>} base64-encoded audio (wav)
 */
export async function bhashiniTextToSpeech(text, language = "hi") {
  assertConfigured();
  const sourceLanguage = TTS_VOICE_MAP[language] || "hi";

  try {
    const pipelineConfig = await getPipelineConfig("tts", sourceLanguage);
    const ttsConfig = pipelineConfig?.pipelineResponseConfig?.[0]?.config?.[0];
    const inferenceEndpoint =
      pipelineConfig?.pipelineInferenceAPIEndPoint?.callbackUrl || INFERENCE_URL_FALLBACK;
    const inferenceApiKey =
      pipelineConfig?.pipelineInferenceAPIEndPoint?.inferenceApiKey?.value || env.bhashini.apiKey;

    const body = {
      pipelineTasks: [
        {
          taskType: "tts",
          config: {
            language: { sourceLanguage },
            serviceId: ttsConfig?.serviceId,
            gender: "female",
            samplingRate: 22050,
          },
        },
      ],
      inputData: { input: [{ source: text }] },
    };

    const { data } = await axios.post(inferenceEndpoint, body, {
      headers: { Authorization: inferenceApiKey, "Content-Type": "application/json" },
      timeout: 30000,
    });

    const audioBase64 = data?.pipelineResponse?.[0]?.audio?.[0]?.audioContent;
    if (!audioBase64) {
      throw new ApiError(502, "BHASHINI_TTS_EMPTY", "Bhashini returned no audio.");
    }
    return audioBase64;
  } catch (err) {
    if (err instanceof ApiError) throw err;
    throw new ApiError(
      502,
      "BHASHINI_TTS_FAILED",
      `Bhashini TTS request failed: ${err.response?.data?.message || err.message}`
    );
  }
}
