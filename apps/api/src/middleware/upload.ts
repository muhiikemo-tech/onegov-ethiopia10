import multer from "multer";
import path from "node:path";
import crypto from "node:crypto";
import { env } from "../lib/env.js";

const allowed = (process.env.UPLOAD_ALLOWED_MIME || "application/pdf,image/jpeg,image/png").split(",");

const storage = multer.diskStorage({
  destination: env.UPLOAD_DIR,
  filename: (_req, file, cb) => {
    const safeExt = path.extname(file.originalname).toLowerCase();
    const name = crypto.randomBytes(16).toString("hex") + safeExt;
    cb(null, name);
  },
});

export const upload = multer({
  storage,
  limits: { fileSize: env.UPLOAD_MAX_BYTES },
  fileFilter: (_req, file, cb) => {
    if (!allowed.includes(file.mimetype)) return cb(new Error("invalid_mime"));
    cb(null, true);
  },
});
