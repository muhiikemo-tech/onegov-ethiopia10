import { useState } from "react";
import { saveAuth } from "../lib/auth";

const API_URL = "https://onegov-api.onrender.com";

export function Login() {
  const [step, setStep] = useState<"start" | "otp">("start");
  const [userId, setUserId] = useState("");
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function startFayda() {
    setLoading(true); setError(null);
    try {
      const res = await fetch(`${API_URL}/api/auth/fayda/callback`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: "TESTCODE12345" }),
      });
      if (!res.ok) throw new Error("Fayda auth failed");
      const data = await res.json();
      setUserId(data.userId);
      setStep("otp");
    } catch (e: any) { setError(e.message); }
    finally { setLoading(false); }
  }

  async function verify() {
    setLoading(true); setError(null);
    try {
      const res = await fetch(`${API_URL}/api/auth/otp/verify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, code }),
      });
      if (!res.ok) throw new Error("Invalid OTP");
      const data = await res.json();
      if (data.user.role === "citizen") {
        throw new Error("Access denied: admin privileges required");
      }
      saveAuth(data.accessToken, data.user);
      window.location.reload();
    } catch (e: any) { setError(e.message); }
    finally { setLoading(false); }
  }

  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "80vh" }}>
      <div className="card" style={{ maxWidth: 420, width: "100%", padding: 40 }}>
        <div style={{ textAlign: "center", marginBottom: 24 }}>
          <img src="/logo.svg" alt="OneGov" style={{ width: 64, height: 64, marginBottom: 16 }} />
          <h2 style={{ margin: 0, color: "#0B3D91" }}>Admin Sign In</h2>
          <p style={{ color: "#64748b", fontSize: 14 }}>Authorized personnel only</p>
        </div>

        {step === "start" && (
          <button className="btn btn-primary" onClick={startFayda} disabled={loading} style={{ width: "100%" }}>
            {loading ? "Connecting..." : "Continue with Fayda"}
          </button>
        )}
        {step === "otp" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <p style={{ color: "#64748b", fontSize: 14, textAlign: "center" }}>Enter OTP from your phone</p>
            <input className="input" placeholder="6-digit OTP" value={code} onChange={e => setCode(e.target.value)} />
            <button className="btn btn-primary" onClick={verify} disabled={loading || !code}>
              {loading ? "Verifying..." : "Verify & Sign in"}
            </button>
          </div>
        )}
        {error && <p style={{ color: "#b91c1c", marginTop: 12, textAlign: "center" }}>{error}</p>}
      </div>
    </div>
  );
}
