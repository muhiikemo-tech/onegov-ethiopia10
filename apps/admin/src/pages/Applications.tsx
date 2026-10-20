import { useEffect, useState } from "react";
import { apiFetch } from "../lib/auth";

interface AppRow {
  id: string;
  trackingNumber: string;
  status: string;
  userName: string;
  userPhone: string;
  serviceName: Record<string, string>;
  feePaid: boolean;
  documents: any[];
  payments: any[];
  createdAt: string;
}

const statusTone = (s: string) =>
  s === "approved" || s === "completed" ? "badge-success"
  : s === "rejected" ? "badge-danger"
  : s === "needs_info" ? "badge-warn"
  : "badge-info";

const API_URL = "http://localhost:4000";

export function Applications() {
  const [rows, setRows] = useState<AppRow[]>([]);
  const [error, setError] = useState<string | null>(null);
  
  // State for Modal Image Preview
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    apiFetch("/admin/applications").then(setRows).catch((e) => setError(e.message));
  }, []);

  async function updateStatus(id: string, status: string) {
    try {
      await apiFetch(`/admin/applications/${id}/status`, {
        method: "PATCH",
        body: JSON.stringify({ status }),
      });
      setRows((r) => r.map((a) => (a.id === id ? { ...a, status } : a)));
    } catch (e: any) {
      alert(e.message);
    }
  }

  return (
    <div>
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ margin: 0, fontSize: 32, color: "#0B3D91" }}>Applications</h1>
        <p style={{ color: "#64748b", marginTop: 8 }}>Manage citizen applications, payments, and statuses.</p>
      </div>

      {error && <p style={{ color: "#b91c1c" }}>{error}</p>}

      <div className="table-container">
        <table className="table">
          <thead>
            <tr>
              <th>Tracking</th>
              <th>Citizen</th>
              <th>Service</th>
              <th>Payment</th>
              <th>Documents</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((a) => {
              // Payment state
              const paidPayment = a.payments?.find(p => p.status === "paid");
              const pendingPayment = a.payments?.find(p => p.status === "pending");
              let paymentBadge = <span style={{ color: "#94a3b8", fontSize: 12 }}>None</span>;
              if (paidPayment) paymentBadge = <span className="badge badge-success">PAID</span>;
              else if (pendingPayment) paymentBadge = <span className="badge badge-warn">PENDING</span>;

              return (
                <tr key={a.id}>
                  <td><code style={{ color: "#0B3D91", fontWeight: 600 }}>{a.trackingNumber}</code></td>
                  <td>
                    <div style={{ fontWeight: 600 }}>{a.userName}</div>
                    <div style={{ color: "#64748b", fontSize: 12 }}>{a.userPhone}</div>
                  </td>
                  <td>{a.serviceName?.en ?? "—"}</td>
                  <td>{paymentBadge}</td>
                  
                  {/* DOCUMENTS COLUMN WITH BUTTON PREVIEW */}
                  <td>
                    {a.documents?.length ? (
                      a.documents.map((doc: any, idx: number) => (
                        <button
                          key={idx}
                          onClick={() => setPreviewUrl(`${API_URL}${doc.url}`)}
                          style={{ marginRight: 8, color: "#0B3D91", background: "none", border: "none", cursor: "pointer", textDecoration: "underline", fontWeight: 500, fontSize: 13 }}
                        >
                          View
                        </button>
                      ))
                    ) : (
                      <span style={{ color: "#94a3b8", fontSize: 12 }}>None</span>
                    )}
                  </td>

                  <td><span className={`badge ${statusTone(a.status)}`}>{a.status.replace("_", " ")}</span></td>
                  <td>
                    <select
                      className="input"
                      style={{ minHeight: 36, padding: "6px 12px", width: 140, fontSize: 13 }}
                      value={a.status}
                      onChange={(e) => updateStatus(a.id, e.target.value)}
                    >
                      {["submitted", "in_review", "needs_info", "approved", "rejected", "completed"].map((s) => (
                        <option key={s} value={s}>{s.replace("_", " ")}</option>
                      ))}
                    </select>
                  </td>
                </tr>
              );
            })}
            {rows.length === 0 && (
              <tr><td colSpan={7} style={{ textAlign: "center", padding: 40, color: "#64748b" }}>No applications yet.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* MODAL FOR IMAGE PREVIEW */}
      {previewUrl && (
        <div 
          style={{ 
            position: "fixed", top: 0, left: 0, width: "100%", height: "100%", 
            background: "rgba(0,0,0,0.8)", display: "flex", alignItems: "center", 
            justifyContent: "center", zIndex: 1000, padding: 24 
          }} 
          onClick={() => setPreviewUrl(null)}
        >
          <div style={{ position: "relative", maxWidth: "90%", maxHeight: "90%" }}>
            <button 
              onClick={() => setPreviewUrl(null)}
              style={{ position: "absolute", top: -16, right: -16, background: "white", border: "none", borderRadius: "50%", width: 32, height: 32, cursor: "pointer", fontWeight: "bold" }}
            >
              ✕
            </button>
            <img 
              src={previewUrl} 
              style={{ maxWidth: "100%", maxHeight: "80vh", objectFit: "contain", background: "white", borderRadius: 8, padding: 8 }} 
              alt="Document Preview" 
            />
          </div>
        </div>
      )}
    </div>
  );
}
