import { Router } from "express";
import { z } from "zod";
import { db } from "../db/pg.js";
import { requireAuth, requireRole } from "../middleware/auth.js";
import { audit } from "../lib/audit.js";

export const adminRouter = Router();

adminRouter.use(requireAuth, requireRole("officer", "reviewer", "admin"));

adminRouter.get("/stats", async (_req, res) => {
  const [u, a, p] = await Promise.all([
    db.query(`SELECT COUNT(*)::int FROM "User"`),
    db.query(`SELECT COUNT(*)::int FROM "Application"`),
    db.query(`SELECT COUNT(*)::int FROM "Payment" WHERE status = 'paid'`),
  ]);
  res.json({
    users: u.rows[0].count,
    applications: a.rows[0].count,
    paidPayments: p.rows[0].count,
  });
});

adminRouter.get("/applications", async (req, res) => {
  const status = String(req.query.status || "").trim();
  
  // Query: applications + documents + payments + user + service
  let sql = `
    SELECT a.*, 
           s."nameJson" as "serviceName", 
           u."fullName" as "userName", u.phone as "userPhone",
           (SELECT json_agg(d.*) FROM "Document" d WHERE d."applicationId" = a.id) as documents,
           (SELECT json_agg(p.*) FROM "Payment" p WHERE p."applicationId" = a.id) as payments
    FROM "Application" a
    JOIN "Service" s ON a."serviceId" = s.id
    JOIN "User" u ON a."userId" = u.id
  `;
  const params: any[] = [];
  if (status) {
    params.push(status);
    sql += ` WHERE a.status = $1`;
  }
  sql += ` ORDER BY a."createdAt" DESC LIMIT 100`;
  
  const result = await db.query(sql, params);
  res.json(result.rows);
});

const statusSchema = z.object({
  status: z.enum(["submitted", "in_review", "needs_info", "approved", "rejected", "completed"]),
});

adminRouter.patch("/applications/:id/status", async (req, res) => {
  const { status } = statusSchema.parse(req.body);
  const result = await db.query(
    `UPDATE "Application" SET status = $1, "updatedAt" = NOW() WHERE id = $2 RETURNING *`,
    [status, req.params.id]
  );
  if (result.rows.length === 0) return res.status(404).json({ error: "not_found" });

  await audit({
    actorId: req.user!.sub,
    action: "admin.application.status_change",
    entity: "Application",
    entityId: req.params.id,
    ip: req.ip,
    metadata: { status },
  });
  res.json(result.rows[0]);
});

adminRouter.get("/audit-logs", requireRole("admin"), async (_req, res) => {
  const result = await db.query(
    `SELECT * FROM "AuditLog" ORDER BY "createdAt" DESC LIMIT 200`
  );
  res.json(result.rows);
});
