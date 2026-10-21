import { useState } from "react";
import { useNavigate } from "react-router-dom";

const API_URL = "https://onegov-api.onrender.com";

export function LoginPage() {
  const [step, setStep] = useState<"start" | "otp">("start");
  const [userId, setUserId] = useState("");
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

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
      localStorage.setItem("onegov_token", data.accessToken);
      navigate("/services");
      window.location.reload();
    } catch (e: any) { setError(e.message); }
    finally { setLoading(false); }
  }

  return (
    <main className="container" style={{ maxWidth: 420, paddingTop: 60 }}>
      <div className="card">
        <h2 style={{ marginTop: 0, color: "#0B3D91" }}>Sign in with Fayda</h2>
        {step === "start" && (
          <>
            <p style={{ color: "#64748b" }}>Use your Fayda digital ID to access government services.</p>
            <button className="btn btn-primary" onClick={startFayda} disabled={loading} style={{ width: "100%" }}>
              {loading ? "Connecting..." : "Continue with Fayda"}
            </button>
          </>
        )}
        {step === "otp" && (
          <>
            <p style={{ color: "#64748b" }}>Enter the OTP sent to your phone.</p>
            <input className="input" placeholder="6-digit OTP" value={code} onChange={e => setCode(e.target.value)} style={{ marginBottom: 12 }} />
            <button className="btn btn-primary" onClick={verify} disabled={loading || !code} style={{ width: "100%" }}>
              {loading ? "Verifying..." : "Verify & Sign in"}
            </button>
          </>
        )}
        {error && <p style={{ color: "#b91c1c", marginTop: 12 }}>{error}</p>}
      </div>
    </main>
  );
}
