import app from "./app.js";
import {
  env,
  isGeminiConfigured,
  isBhashiniConfigured,
  isDbConfigured,
  isJwtConfigured
} from "./config/env.js";

const PORT = process.env.PORT || env.port || 5000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`\nGram-Pragati AI backend running on port ${PORT}`);
  console.log(`  GET  /api/health`);
  console.log(`  POST /api/ai/chat`);
  console.log(`  POST /api/ai/voice`);
  console.log(`  POST /api/ai/tts`);
  console.log(`  POST /api/auth/register | /api/auth/login | GET /api/auth/me`);
  console.log(`  GET/PUT /api/business-profile`);
  console.log(`  /api/inventory (CRUD, /stock-in, /stock-out, /adjust, /low-stock, /valuation, /transactions)`);
  console.log(`  /api/sales (CRUD)`);
  console.log(`  /api/expenses (CRUD)`);
  console.log(`  /api/financial-records (CRUD, /summary)\n`);
  console.log(`Gemini:   ${isGeminiConfigured() ? "configured" : "NOT configured (set GEMINI_API_KEY)"}`);
  console.log(`Bhashini: ${isBhashiniConfigured() ? "configured" : "NOT configured (voice will use browser fallback)"}`);
  console.log(`Database: ${isDbConfigured() ? "configured" : "NOT configured (set DATABASE_URL, then npm run migrate)"}`);
  console.log(`JWT:      ${isJwtConfigured() ? "configured" : "NOT configured (using ephemeral dev secret)"}\n`);
});
