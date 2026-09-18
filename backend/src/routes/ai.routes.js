import { Router } from "express";
import multer from "multer";
import rateLimit from "express-rate-limit";
import { chat, voice, tts } from "../controllers/aiController.js";
import { optionalAuth } from "../middleware/auth.js";

const router = Router();

// Keep audio in memory; cap size to avoid abuse. No files touch disk.
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
});

const aiLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: { code: "RATE_LIMITED", message: "Too many AI requests. Please slow down." },
  },
});

router.use(aiLimiter);

// optionalAuth: attaches req.user when a valid token is sent (logged-in users
// get real business context in their AI replies) without breaking the
// existing anonymous/pre-login voice advisor flow.
router.post("/chat", optionalAuth, chat);
router.post("/voice", optionalAuth, upload.single("audio"), voice);
router.post("/tts", tts);

export default router;
