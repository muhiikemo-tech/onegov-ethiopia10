import { Router } from "express";
import { db } from "../db/pg.js";

export const servicesRouter = Router();

// Ramaddiiwwan hunda
servicesRouter.get("/categories", async (_req, res) => {
  const result = await db.query(`SELECT id, slug, "nameJson", icon FROM "ServiceCategory" ORDER BY slug`);
  res.json(result.rows.map(c => ({ id: c.id, slug: c.slug, name: c.nameJson, icon: c.icon })));
});

// Tajaajila hunda (barbaacha fi filter waliin)
servicesRouter.get("/", async (req, res) => {
  const q = String(req.query.q || "").trim();
  const category = String(req.query.category || "").trim();

  let sql = `SELECT s.id, s.slug, s."nameJson", s."descriptionJson", s.fee, s.currency, s."processingDays", c.slug as "categorySlug", c."nameJson" as "categoryName"
             FROM "Service" s
             JOIN "ServiceCategory" c ON s."categoryId" = c.id
             WHERE s.active = true`;
  const params: any[] = [];

  if (category) {
    params.push(category);
    sql += ` AND c.slug = $${params.length}`;
  }
  if (q) {
    params.push(`%${q}%`);
    sql += ` AND s."nameJson"::text ILIKE $${params.length}`;
  }

  sql += ` ORDER BY s.slug ASC`;
  const result = await db.query(sql, params);

  res.json(result.rows.map(s => ({
    id: s.id,
    slug: s.slug,
    name: s.nameJson,
    description: s.descriptionJson,
    fee: Number(s.fee),
    currency: s.currency,
    processingDays: s.processingDays,
    categorySlug: s.categorySlug,
    categoryName: s.categoryName,
  })));
});

// Tajaajila tokko (slug'n)
servicesRouter.get("/:slug", async (req, res) => {
  const result = await db.query(
    `SELECT s.id, s.slug, s."nameJson", s."descriptionJson", s.fee, s.currency, s."processingDays", s."requiredDocuments", s."formSchemaJson", c.slug as "categorySlug", c."nameJson" as "categoryName"
     FROM "Service" s
     JOIN "ServiceCategory" c ON s."categoryId" = c.id
     WHERE s.slug = $1 AND s.active = true`,
    [req.params.slug]
  );
  if (result.rows.length === 0) return res.status(404).json({ error: "not_found" });
  const s = result.rows[0];
  res.json({
    id: s.id,
    slug: s.slug,
    name: s.nameJson,
    description: s.descriptionJson,
    fee: Number(s.fee),
    currency: s.currency,
    processingDays: s.processingDays,
    requiredDocuments: s.requiredDocuments,
    formSchema: s.formSchemaJson,
    categorySlug: s.categorySlug,
    categoryName: s.categoryName,
  });
});
