import { db } from "../db/pg.js";

export async function audit(params: {
  actorId?: string;
  action: string;
  entity: string;
  entityId?: string;
  ip?: string;
  metadata?: Record<string, unknown>;
}) {
  try {
    await db.query(
      `INSERT INTO "AuditLog" (id, "actorId", action, entity, "entityId", ip, metadata, "createdAt")
       VALUES (gen_random_uuid()::text, $1, $2, $3, $4, $5, $6, NOW())`,
      [params.actorId, params.action, params.entity, params.entityId, params.ip, params.metadata ? JSON.stringify(params.metadata) : null]
    );
  } catch (e) {
    console.error("[audit] failed", e);
  }
}
