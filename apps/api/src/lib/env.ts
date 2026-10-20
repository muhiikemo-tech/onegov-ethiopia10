import { z } from "zod";

const schema = z.object({
  NODE_ENV: z.string().default("development"),
  API_PORT: z.coerce.number().default(4000),
  DATABASE_URL: z.string(),
  JWT_ACCESS_SECRET: z.string().min(32),
  JWT_REFRESH_SECRET: z.string().min(32),
  JWT_ACCESS_TTL: z.coerce.number().default(900),
  JWT_REFRESH_TTL: z.coerce.number().default(2592000),
  OTP_TTL: z.coerce.number().default(300),
  OTP_LENGTH: z.coerce.number().default(6),
  FAYDA_CLIENT_ID: z.string().optional(),
  FAYDA_CLIENT_SECRET: z.string().optional(),
  FAYDA_BASE_URL: z.string().default("https://api.fayda.et"),
  FAYDA_REDIRECT_URI: z.string().optional(),
  EKYC_ENCRYPTION_KEY: z.string().min(32),
  PAYMENT_PROVIDER: z.enum(["stub", "ethiopay", "ips"]).default("stub"),
  UPLOAD_DIR: z.string().default("./uploads"),
  UPLOAD_MAX_BYTES: z.coerce.number().default(10485760),
  UPLOAD_ALLOWED_MIME: z.string().default("application/pdf,image/jpeg,image/png"),
  CSRF_SECRET: z.string().min(16),
  CORS_ORIGINS: z.string(),
  COOKIE_DOMAIN: z.string().optional(),
  COOKIE_SECURE: z.string().default("false"),
  SMS_PROVIDER: z.string().default("stub"),
});

export const env = schema.parse(process.env);
