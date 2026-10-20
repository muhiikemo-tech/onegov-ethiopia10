import { useEffect, useState } from "react";
import { apiFetch } from "../lib/auth";

interface LogRow {
  id: string;
  actorId?: string;
  action: string;
  entity: string;
  entityId?: string;
  ip?: string;
  metadata?: any;
  createdAt: string;
}

export function AuditLogs() {
  const [rows, setRows] = useState<LogRow[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    apiFetch("/admin/audit-logs").then(setRows).catch((e) => setError(e.message));
  }, []);

  return (
    <div>
      <h1 style={{ margin: 0, fontSize: 32, color: "#0B3D91" }}>Audit Logs</h1>
      <p style={{ color: "#64748b", marginTop: 8, marginBottom: 24 }}>Track all sensitive actions.</p>
      {error && <p style={{ color: "#b91c1c" }}>{error}</p>}

      <div className="table-container">
        <table className="table">
          <thead>
            <tr>
              <th>Timestamp</th>
              <th>Actor</th>
              <th>Action</th>
              <th>Entity</th>
              <th>Metadata</th>
              <th>IP</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id}>
                <td style={{ color: "#64748b", fontSize: 13 }}>{new Date(r.createdAt).toLocaleString()}</td>
                <td><code style={{ fontSize: 12 }}>{r.actorId?.slice(0, 8) ?? "—"}</code></td>
                <td>
                  <strong style={{ 
                    color: r.action.includes("status_change") && r.metadata?.status === "approved" ? "#166534" 
                         : r.action.includes("status_change") && r.metadata?.status === "rejected" ? "#991B1B" 
                         : "#0B3D91" 
                  }}>
                    {r.action}
                  </strong>
                </td>
                <td>{r.entity} <span style={{ color: "#94a3b8", fontSize: 12 }}>{r.entityId?.slice(0, 8)}</span></td>
                <td style={{ fontSize: 12, color: "#64748b" }}>{r.metadata ? JSON.stringify(r.metadata) : "—"}</td>
                <td style={{ color: "#64748b", fontSize: 13 }}>{r.ip ?? "—"}</td>
              </tr>
            ))}
            {rows.length === 0 && (
              <tr><td colSpan={6} style={{ textAlign: "center", padding: 40, color: "#64748b" }}>No audit logs yet.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
