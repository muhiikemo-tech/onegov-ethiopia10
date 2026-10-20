import jwt from "jsonwebtoken";
import { env } from "./env.js";
import type { Role } from "@onegov/types";

export interface AccessPayload {
  sub: string;
  role: Role;
  sid: string;
}

export function signAccess(payload: AccessPayload): string {
  return jwt.sign(payload, env.JWT_ACCESS_SECRET, { expiresIn: env.JWT_ACCESS_TTL });
}

export function signRefresh(payload: AccessPayload): string {
  return jwt.sign(payload, env.JWT_REFRESH_SECRET, { expiresIn: env.JWT_REFRESH_TTL });
}

export function verifyAccess(token: string): AccessPayload {
  return jwt.verify(token, env.JWT_ACCESS_SECRET) as AccessPayload;
}

export function verifyRefresh(token: string): AccessPayload {
  return jwt.verify(token, env.JWT_REFRESH_SECRET) as AccessPayload;
}
