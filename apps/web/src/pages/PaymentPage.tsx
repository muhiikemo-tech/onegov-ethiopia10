import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

export function PaymentPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [app, setApp] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("onegov_token");
    if (!token) { navigate("/login"); return; }

    fetch(`/api/applications/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(r => r.json())
      .then(setApp)
      .catch(e => setError(e.message));
  }, [id, navigate]);

  async function pay() {
    setLoading(true);
    setError(null);
    const token = localStorage.getItem("onegov_token");

    try {
      const startRes = await fetch("/api/payments/start", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ applicationId: id }),
      });
      if (!startRes.ok) throw new Error("Failed to start payment");
      const startData = await startRes.json();

      const confirmRes = await fetch("/api/payments/confirm", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ providerRef: startData.providerRef, status: "paid" }),
      });
      if (!confirmRes.ok) throw new Error("Failed to confirm payment");

      setSuccess(true);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <main className="container" style={{ maxWidth: 500, paddingTop: 60, textAlign: "center" }}>
        <div className="card" style={{ padding: 48 }}>
          <div style={{ fontSize: 64, marginBottom: 16 }}>✅</div>
          <h2 style={{ color: "#1B8A3A", marginTop: 0 }}>Payment Successful</h2>
          <p style={{ color: "#64748b" }}>Your application is now in review.</p>
          <button className="btn btn-primary" onClick={() => navigate("/track")} style={{ marginTop: 16 }}>
            Track Application
          </button>
        </div>
      </main>
    );
  }

  if (!app) return <main className="container">Loading...</main>;

  return (
    <main className="container" style={{ maxWidth: 500, paddingTop: 60 }}>
      <div className="card" style={{ padding: 40 }}>
        <h2 style={{ marginTop: 0, color: "#0B3D91" }}>Pay Government Fee</h2>
        <p style={{ color: "#64748b", marginBottom: 24 }}>
          Application: <strong>{app.trackingNumber}</strong>
        </p>
        
        {error && <p style={{ color: "#b91c1c" }}>{error}</p>}

        <div style={{ background: "#F8FAFC", padding: 16, borderRadius: 8, marginBottom: 24 }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
            <span style={{ color: "#64748b" }}>{app.serviceName?.en || "Service Fee"}</span>
            <strong>{app.fee} ETB</strong>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", paddingTop: 8, borderTop: "1px solid #E2E8F0" }}>
            <strong>Total</strong>
            <strong style={{ color: "#0B3D91", fontSize: 20 }}>{app.fee} ETB</strong>
          </div>
        </div>

        <button className="btn btn-primary" onClick={pay} disabled={loading} style={{ width: "100%", fontSize: 16 }}>
          {loading ? "Processing..." : "Pay Now"}
        </button>
      </div>
    </main>
  );
}
