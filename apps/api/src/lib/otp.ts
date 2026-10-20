import crypto from "node:crypto";
import { env } from "./env.js";

const store = new Map<string, { code: string; exp: number }>();

export function generateOtp(phone: string): string {
  const digits = "0123456789";
  let code = "";
  for (let i = 0; i < env.OTP_LENGTH; i++) code += digits[crypto.randomInt(0, 10)];
  store.set(phone, { code, exp: Date.now() + env.OTP_TTL * 1000 });
  return code;
}

export function verifyOtp(phone: string, code: string): boolean {
  const rec = store.get(phone);
  if (!rec) return false;
  if (Date.now() > rec.exp) {
    store.delete(phone);
    return false;
  }
  if (rec.code !== code) return false;
  store.delete(phone);
  return true;
}
