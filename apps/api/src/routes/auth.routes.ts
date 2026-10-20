import crypto from "node:crypto";
import { Router } from "express";
import { z } from "zod";
import { db } from "../db/pg.js";
import { signAccess, signRefresh, verifyRefresh } from "../lib/jwt.js";
import { generateOtp, verifyOtp } from "../lib/otp.js";
import { sendSms } from "../lib/sms.js";
import { authLimiter } from "../middleware/rateLimit.js";
import { audit } from "../lib/audit.js";
import { requireAuth } from "../middleware/auth.js";
import { upload } from "../middleware/upload.js";

export const authRouter = Router();

authRouter.post("/fayda/start", authLimiter, async (_req, res) => {
  const url = new URL(`${process.env.FAYDA_BASE_URL || "https://api.fayda.et"}/oauth/authorize`);
  url.searchParams.set("client_id", process.env.FAYDA_CLIENT_ID || "");
  url.searchParams.set("response_type", "code");
  url.searchParams.set("scope", "openid ekyc");
  url.searchParams.set("redirect_uri", process.env.FAYDA_REDIRECT_URI || "");
  res.json({ redirectUrl: url.toString() });
});

const callbackSchema = z.object({ code: z.string().min(8) });

authRouter.post("/fayda/callback", authLimiter, async (req, res) => {
  const { code } = callbackSchema.parse(req.body);
  
  // ─── MUUXANNOO: Yeroo API dhugaa qabaattu, kun bakka buufama ───
  const profile = {
    faydaId: "FAYDA-" + code.slice(0, 12), 
    fullName: "Test Citizen",
    phone: "+251911000000",
  };

  const existing = await db.query(`SELECT id, "fullName", phone FROM "User" WHERE "faydaId" = $1`, [profile.faydaId]);
  let userId: string;

  if (existing.rows.length > 0) {
    userId = existing.rows[0].id;
    await db.query(
      `UPDATE "User" SET "fullName" = $1, phone = $2, verified = true, "updatedAt" = NOW() WHERE id = $3`,
      [profile.fullName, profile.phone, userId]
    );
  } else {
    const inserted = await db.query(
      `INSERT INTO "User" (id, "faydaId", "fullName", phone, role, verified, "updatedAt")
       VALUES (gen_random_uuid()::text, $1, $2, $3, 'citizen', true, NOW()) RETURNING id`,
      [profile.faydaId, profile.fullName, profile.phone]
    );
    userId = inserted.rows[0].id;
  }

  // ─── MUUXANNOO: OTP uumuu fi erguu ───
  const otp = generateOtp(profile.phone!);
  await sendSms(profile.phone!, `Your OneGov verification code is: ${otp}`);

  await audit({ actorId: userId, action: "auth.fayda_callback", entity: "User", entityId: userId, ip: req.ip });

  return res.json({ userId, phone: profile.phone, otpRequired: true });
});

const otpSchema = z.object({ userId: z.string(), code: z.string() });

authRouter.post("/otp/verify", authLimiter, async (req, res) => {
  const { userId, code } = otpSchema.parse(req.body);
  const result = await db.query(`SELECT id, phone, role, "fullName", locale, "profilePhotoUrl" FROM "User" WHERE id = $1`, [userId]);
  if (result.rows.length === 0) return res.status(400).json({ error: "invalid_user" });
  const user = result.rows[0];
  if (!user.phone) return res.status(400).json({ error: "invalid_user" });
  if (!verifyOtp(user.phone, code)) return res.status(400).json({ error: "invalid_otp" });

  const sid = crypto.randomUUID();
  const access = signAccess({ sub: user.id, role: user.role, sid });
  const refresh = signRefresh({ sub: user.id, role: user.role, sid });

  res.cookie("access", access, { httpOnly: true, sameSite: "lax", maxAge: 900 * 1000 });
  res.cookie("refresh", refresh, { httpOnly: true, sameSite: "lax", maxAge: 2592000 * 1000 });

  await audit({ actorId: user.id, action: "auth.otp_success", entity: "User", entityId: user.id, ip: req.ip });

  return res.json({
    accessToken: access,
    user: { id: user.id, fullName: user.fullName, role: user.role, locale: user.locale, profilePhotoUrl: user.profilePhotoUrl },
  });
});

authRouter.post("/refresh", async (req, res) => {
  const token = req.cookies?.refresh;
  if (!token) return res.status(401).json({ error: "no_refresh" });
  try {
    const payload = verifyRefresh(token);
    const access = signAccess(payload);
    res.json({ accessToken: access });
  } catch {
    res.status(401).json({ error: "invalid_refresh" });
  }
});

authRouter.post("/logout", requireAuth, async (req, res) => {
  res.clearCookie("access");
  res.clearCookie("refresh");
  await audit({ actorId: req.user!.sub, action: "auth.logout", entity: "User", entityId: req.user!.sub, ip: req.ip });
  res.json({ ok: true });
});

authRouter.get("/me", requireAuth, async (req, res) => {
  const result = await db.query(
    `SELECT id, "fullName", email, phone, role, locale, verified, "profilePhotoUrl" FROM "User" WHERE id = $1`,
    [req.user!.sub]
  );
  res.json(result.rows[0]);
});

const updateProfileSchema = z.object({
  fullName: z.string().min(2),
  phone: z.string().min(9),
  faydaId: z.string().min(5),
});

authRouter.patch("/profile", requireAuth, async (req, res) => {
  const { fullName, phone, faydaId } = updateProfileSchema.parse(req.body);
  await db.query(
    `UPDATE "User" SET "fullName" = $1, phone = $2, "faydaId" = $3, "updatedAt" = NOW() WHERE id = $4`,
    [fullName, phone, faydaId, req.user!.sub]
  );
  await audit({ actorId: req.user!.sub, action: "auth.profile_update", entity: "User", entityId: req.user!.sub, ip: req.ip });
  res.json({ ok: true });
});

authRouter.post("/profile/photo", requireAuth, upload.single("photo"), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: "no_file" });
  const url = `/uploads/${req.file.filename}`;
  await db.query(
    `UPDATE "User" SET "profilePhotoUrl" = $1, "updatedAt" = NOW() WHERE id = $2`,
    [url, req.user!.sub]
  );
  await audit({ actorId: req.user!.sub, action: "auth.profile_photo_upload", entity: "User", entityId: req.user!.sub, ip: req.ip });
  res.json({ profilePhotoUrl: url });
});
