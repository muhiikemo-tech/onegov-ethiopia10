import { Router } from "express";
import { z } from "zod";
import { nanoid } from "nanoid";
import { db } from "../db/pg.js";
import { requireAuth } from "../middleware/auth.js";
import { upload } from "../middleware/upload.js";
import { audit } from "../lib/audit.js";

export const applicationsRouter = Router();

const createSchema = z.object({
  serviceId: z.string(),
  formData: z.record(z.any()),
});

// Iyyata uumuu (sanada waliin)
applicationsRouter.post("/", requireAuth, upload.array("documents", 10), async (req, res) => {
  try {
    const { serviceId, formData } = createSchema.parse({
      serviceId: req.body.serviceId,
      formData: JSON.parse(req.body.formData || "{}"),
    });

    const svc = await db.query(`SELECT id FROM "Service" WHERE id = $1 AND active = true`, [serviceId]);
    if (svc.rows.length === 0) return res.status(404).json({ error: "service_not_found" });

    const trackingNumber = "OG-" + new Date().getFullYear() + "-" + nanoid(8).toUpperCase();
    const appId = "app_" + nanoid(16);

    await db.query(
      `INSERT INTO "Application" (id, "trackingNumber", "userId", "serviceId", status, "formDataJson", "updatedAt")
       VALUES ($1, $2, $3, $4, 'submitted', $5, NOW())`,
      [appId, trackingNumber, req.user!.sub, serviceId, JSON.stringify(formData)]
    );

    // Sanada galchuu
    const files = (req.files as Express.Multer.File[]) || [];
    for (const f of files) {
      await db.query(
        `INSERT INTO "Document" (id, "applicationId", filename, "mimeType", size, url)
         VALUES ($1, $2, $3, $4, $5, $6)`,
        ["doc_" + nanoid(16), appId, f.originalname, f.mimetype, f.size, `/uploads/${f.filename}`]
      );
    }

    await audit({
      actorId: req.user!.sub,
      action: "application.create",
      entity: "Application",
      entityId: appId,
      ip: req.ip,
      metadata: { serviceId, trackingNumber },
    });

    res.status(201).json({ id: appId, trackingNumber });
  } catch (err: any) {
    if (err instanceof z.ZodError) return res.status(400).json({ error: "validation", details: err.errors });
    throw err;
  }
});

// Iyyata koo hunda
applicationsRouter.get("/mine", requireAuth, async (req, res) => {
  const result = await db.query(
    `SELECT a.id, a."trackingNumber", a.status, a."feePaid", a."createdAt", s."nameJson" as "serviceName", s.fee
     FROM "Application" a
     JOIN "Service" s ON a."serviceId" = s.id
     WHERE a."userId" = $1
     ORDER BY a."createdAt" DESC`,
    [req.user!.sub]
  );
  res.json(result.rows.map(a => ({
    id: a.id,
    trackingNumber: a.trackingNumber,
    status: a.status,
    serviceName: a.serviceName,
    feePaid: a.feePaid,
    fee: Number(a.fee),
    createdAt: a.createdAt,
  })));
});

// Iyyata tracking number'n hordofuu (auth malee)
applicationsRouter.get("/track/:trackingNumber", async (req, res) => {
  const result = await db.query(
    `SELECT a."trackingNumber", a.status, a."createdAt", a."updatedAt", s."nameJson" as "serviceName"
     FROM "Application" a
     JOIN "Service" s ON a."serviceId" = s.id
     WHERE a."trackingNumber" = $1`,
    [req.params.trackingNumber]
  );
  if (result.rows.length === 0) return res.status(404).json({ error: "not_found" });
  res.json(result.rows[0]);
});

// Iyyata tokko (auth waliin)
applicationsRouter.get("/:id", requireAuth, async (req, res) => {
  const result = await db.query(
    `SELECT a.*, s."nameJson" as "serviceName", s.fee,
       (SELECT json_agg(d.*) FROM "Document" d WHERE d."applicationId" = a.id) as documents
     FROM "Application" a
     JOIN "Service" s ON a."serviceId" = s.id
     WHERE a.id = $1`,
    [req.params.id]
  );
  if (result.rows.length === 0) return res.status(404).json({ error: "not_found" });
  const a = result.rows[0];

  // Hojjettoonni ykn admin qofa arguu danda'u
  if (a.userId !== req.user!.sub && req.user!.role === "citizen") {
    return res.status(403).json({ error: "forbidden" });
  }
  res.json(a);
});
