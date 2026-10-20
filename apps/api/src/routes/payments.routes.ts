import { Router } from "express";
import { z } from "zod";
import { nanoid } from "nanoid";
import { db } from "../db/pg.js";
import { requireAuth } from "../middleware/auth.js";
import { audit } from "../lib/audit.js";

export const paymentsRouter = Router();

const startSchema = z.object({ applicationId: z.string() });

paymentsRouter.post("/start", requireAuth, async (req, res) => {
  const { applicationId } = startSchema.parse(req.body);

  const result = await db.query(
    `SELECT a.id, a."userId", a."feePaid", s.fee FROM "Application" a JOIN "Service" s ON a."serviceId" = s.id WHERE a.id = $1`,
    [applicationId]
  );
  if (result.rows.length === 0) return res.status(404).json({ error: "not_found" });
  const app = result.rows[0];

  if (app.userId !== req.user!.sub) return res.status(403).json({ error: "forbidden" });
  if (app.feePaid) return res.status(400).json({ error: "already_paid" });

  // Stub payment provider (booda EthioPay/IPS waliin walqabsiifna)
  const providerRef = "STUB-" + nanoid(12);
  await db.query(
    `INSERT INTO "Payment" (id, "applicationId", amount, currency, status, provider, "providerRef")
     VALUES ($1, $2, $3, 'ETB', 'pending', 'stub', $4)`,
    ["pay_" + nanoid(16), applicationId, app.fee, providerRef]
  );

  await audit({
    actorId: req.user!.sub,
    action: "payment.start",
    entity: "Application",
    entityId: applicationId,
    ip: req.ip,
    metadata: { providerRef },
  });

  res.json({
    providerRef,
    provider: "stub",
    amount: Number(app.fee),
    currency: "ETB",
    redirectUrl: `/pay/stub?ref=${providerRef}`,
  });
});

const confirmSchema = z.object({
  providerRef: z.string(),
  status: z.enum(["paid", "failed"]),
});

paymentsRouter.post("/confirm", requireAuth, async (req, res) => {
  const { providerRef, status } = confirmSchema.parse(req.body);

  const payRes = await db.query(
    `SELECT p.id, p."applicationId", p."userId" FROM "Payment" p
     JOIN "Application" a ON p."applicationId" = a.id
     WHERE p."providerRef" = $1`,
    [providerRef]
  );
  if (payRes.rows.length === 0) return res.status(404).json({ error: "not_found" });
  const payment = payRes.rows[0];

  await db.query(`UPDATE "Payment" SET status = $1 WHERE id = $2`, [status, payment.id]);

  if (status === "paid") {
    await db.query(
      `UPDATE "Application" SET "feePaid" = true, status = 'in_review', "updatedAt" = NOW() WHERE id = $1`,
      [payment.applicationId]
    );
  }

  await audit({
    actorId: req.user!.sub,
    action: "payment.confirm",
    entity: "Payment",
    entityId: payment.id,
    ip: req.ip,
    metadata: { status },
  });

  res.json({ ok: true });
});
