import express from "express";
import cors from "cors";
import helmet from "helmet";
import { env, isGeminiConfigured, isBhashiniConfigured, isDbConfigured } from "./config/env.js";
import aiRoutes from "./routes/ai.routes.js";
import authRoutes from "./routes/auth.routes.js";
import businessProfileRoutes from "./routes/businessProfile.routes.js";
import inventoryRoutes from "./routes/inventory.routes.js";
import salesRoutes from "./routes/sales.routes.js";
import expensesRoutes from "./routes/expenses.routes.js";
import financialRoutes from "./routes/financial.routes.js";
import { notFoundHandler, errorHandler } from "./middleware/errorHandler.js";

const app = express();

app.use(helmet());
app.use(
  cors({
    origin: env.corsOrigin,
    credentials: true,
  })
);
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true }));

app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    data: {
      status: "ok",
      gemini: isGeminiConfigured() ? "configured" : "missing_api_key",
      bhashini: isBhashiniConfigured() ? "configured" : "missing_credentials",
      database: isDbConfigured() ? "configured" : "missing_database_url",
    },
  });
});

app.use("/api/ai", aiRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/business-profile", businessProfileRoutes);
app.use("/api/inventory", inventoryRoutes);
app.use("/api/sales", salesRoutes);
app.use("/api/expenses", expensesRoutes);
app.use("/api/financial-records", financialRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

export default app;
