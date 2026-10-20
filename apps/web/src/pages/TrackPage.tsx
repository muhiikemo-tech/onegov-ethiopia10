import { useState } from "react";

export function TrackPage() {
  const [num, setNum] = useState("");
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function track() {
    setError(null);
    setResult(null);
    setLoading(true);
    try {
      const res = await fetch(`/api/applications/track/${num}`);
      if (!res.ok) throw new Error("Application not found. Please check the tracking number.");
      setResult(await res.json());
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="container" style={{ maxWidth: 720 }}>
      <div style={{ textAlign: "center", marginBottom: 40 }}>
        <h1 style={{ fontSize: 36, fontWeight: 800, color: "#0B3D91", margin: 0 }}>Track Application</h1>
        <p style={{ color: "#64748b", fontSize: 16, marginTop: 8 }}>
          Enter your tracking number to see the latest status.
        </p>
      </div>

      <div className="card" style={{ padding: 32, marginBottom: 24 }}>
        <div style={{ display: "flex", gap: 8 }}>
          <input
            className="input"
            placeholder="OG-2026-XXXXXXXX"
            value={num}
            onChange={(e) => setNum(e.target.value)}
            style={{ flex: 1 }}
          />
          <button className="btn btn-primary" onClick={track} disabled={loading || !num}>
            {loading ? "Searching..." : "Track"}
          </button>
        </div>
        {error && <p style={{ color: "#b91c1c", marginTop: 12 }}>{error}</p>}
      </div>

      {result && (
        <div className="card" style={{ padding: 32 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", marginBottom: 24 }}>
            <div>
              <div style={{ color: "#64748b", fontSize: 12, fontWeight: 600, textTransform: "uppercase", letterSpacing: 1 }}>Tracking Number</div>
              <div style={{ fontSize: 22, fontWeight: 800, color: "#0B3D91", letterSpacing: 1 }}>{result.trackingNumber}</div>
            </div>
            <span className="badge badge-info" style={{ fontSize: 14, padding: "6px 16px" }}>{result.status}</span>
          </div>
          
          <div style={{ borderTop: "1px solid #E2E8F0", paddingTop: 24, display: "grid", gap: 16 }}>
            <div>
              <div style={{ color: "#64748b", fontSize: 12, fontWeight: 600, textTransform: "uppercase" }}>Service</div>
              <div style={{ fontSize: 16, fontWeight: 600 }}>{result.serviceName?.en}</div>
            </div>
            <div>
              <div style={{ color: "#64748b", fontSize: 12, fontWeight: 600, textTransform: "uppercase" }}>Submitted On</div>
              <div style={{ fontSize: 16 }}>{new Date(result.createdAt).toLocaleString()}</div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
