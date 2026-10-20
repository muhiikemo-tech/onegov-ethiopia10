import type { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";

export function errorHandler(err: any, _req: Request, res: Response, _next: NextFunction) {
  if (err instanceof ZodError) {
    return res.status(400).json({ error: "validation", details: err.errors });
  }
  if (err?.code === "EBADCSRFTOKEN") {
    return res.status(403).json({ error: "csrf_invalid" });
  }
  const status = err.status || 500;
  return res.status(status).json({
    error: err.code || "server_error",
    message: err.publicMessage || "Something went wrong",
  });
}
