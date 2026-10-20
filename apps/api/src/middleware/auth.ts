import type { Request, Response, NextFunction } from "express";
import { verifyAccess, type AccessPayload } from "../lib/jwt.js";
import type { Role } from "@onegov/types";

declare global {
  namespace Express {
    interface Request {
      user?: AccessPayload;
    }
  }
}

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  const header = req.headers.authorization || "";
  const bearer = header.startsWith("Bearer ") ? header.slice(7) : null;
  const cookie = (req as any).cookies?.access as string | undefined;
  const token = bearer || cookie;
  if (!token) return res.status(401).json({ error: "unauthenticated" });
  try {
    req.user = verifyAccess(token);
    next();
  } catch {
    return res.status(401).json({ error: "invalid_token" });
  }
}

export function requireRole(...roles: Role[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) return res.status(401).json({ error: "unauthenticated" });
    if (!roles.includes(req.user.role)) return res.status(403).json({ error: "forbidden" });
    next();
  };
}
