import "dotenv/config";
import express from "express";
import helmet from "helmet";
import cors from "cors";
import cookieParser from "cookie-parser";
import pinoHttp from "pino-http";
import { authRouter } from "./routes/auth.routes.js";
import { servicesRouter } from "./routes/services.routes.js";
import { applicationsRouter } from "./routes/applications.routes.js";
import { paymentsRouter } from "./routes/payments.routes.js";
import { adminRouter } from "./routes/admin.routes.js";
import { supportRouter } from "./routes/support.routes.js";
import { errorHandler } from "./middleware/error.js";
import { globalLimiter } from "./middleware/rateLimit.js";
import { csrfProtection, csrfToken } from "./middleware/csrf.js";

const app = express();
app.set("trust proxy", 1);

app.use(helmet({ crossOriginResourcePolicy: false }));
app.use(cors({
  origin: (process.env.CORS_ORIGINS || "").split(","),
  credentials: true,
}));
app.use(pinoHttp());
app.use(express.json({ limit: "2mb" }));
app.use(cookieParser());
app.use(globalLimiter);

app.get("/health", (_req, res) => res.json({ ok: true, service: "onegov-api" }));
app.get("/api/csrf", csrfProtection, csrfToken);

const isDev = process.env.NODE_ENV === "development";
const withCsrf: any[] = [];

app.use("/api/auth", ...withCsrf, authRouter);
app.use("/api/services", servicesRouter);
app.use("/api/applications", ...withCsrf, applicationsRouter);
app.use("/api/payments", ...withCsrf, paymentsRouter);
app.use("/api/admin", ...withCsrf, adminRouter);
app.use("/api/support", supportRouter);

app.use("/uploads", express.static(process.env.UPLOAD_DIR || "./uploads"));

app.use(errorHandler);

const port = Number(process.env.API_PORT || 4000);
app.listen(port, () => {
  console.log(`[onegov-api] listening on :${port}`);
  console.log(`[mode] ${isDev ? "DEV (CSRF disabled for testing)" : "PROD (CSRF enabled)"}`);});

