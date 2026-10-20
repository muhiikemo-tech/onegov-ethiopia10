import { useEffect, useState } from "react";
import { apiFetch } from "../lib/auth";

export function Dashboard() {
  const [stats, setStats] = useState<{ users: number; applications: number; paidPayments: number } | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    apiFetch("/admin/stats").then(setStats).catch((e) => setError(e.message));
  }, []);

  return (
    <div className="animate-fade-in">
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ margin: 0, fontSize: 36, fontWeight: 800, color: "#0B3D91", letterSpacing: "-1px" }}>Dashboard</h1>
        <p style={{ color: "#64748b", marginTop: 8, fontSize: 15 }}>Overview of the OneGov Ethiopia platform</p>
      </div>
      
      {error && <p style={{ color: "#b91c1c", padding: 16, background: "#FEE2E2", borderRadius: 8 }}>{error}</p>}
      
      <div className="stats-grid">
        <div className="stat-card">
          <div className="label">Total Users</div>
          <div className="value">{stats?.users ?? "…"}</div>
        </div>
        <div className="stat-card green">
          <div className="label">Applications</div>
          <div className="value">{stats?.applications ?? "…"}</div>
        </div>
        <div className="stat-card gold">
          <div className="label">Paid Payments</div>
          <div className="value">{stats?.paidPayments ?? "…"}</div>
        </div>
      </div>

      <div className="card" style={{ marginTop: 32, padding: 40 }}>
        <h3 style={{ marginTop: 0, color: "#0B3D91", fontSize: 22 }}>Quick Actions</h3>
        <p style={{ color: "#64748b", fontSize: 15, marginBottom: 24 }}>
          Manage your platform from the navigation above.
        </p>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          <a href="/applications" className="btn btn-primary">Review Applications</a>
          <a href="/audit-logs" className="btn btn-outline">View Audit Logs</a>
        </div>
      </div>
    </div>
  );
}
