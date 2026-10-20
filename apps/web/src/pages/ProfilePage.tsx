import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export function ProfilePage() {
  const [user, setUser] = useState<any>(null);
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [faydaId, setFaydaId] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("onegov_token");
    if (!token) { navigate("/login"); return; }

    fetch("/api/auth/me", { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json())
      .then(u => {
        setUser(u);
        setFullName(u.fullName || "");
        setPhone(u.phone || "");
        setFaydaId(u.faydaId || "");
      });
  }, [navigate]);

  async function saveProfile() {
    setLoading(true); setSuccess(null);
    const token = localStorage.getItem("onegov_token");
    try {
      await fetch("/api/auth/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ fullName, phone, faydaId }),
      });

      if (file) {
        const fd = new FormData();
        fd.append("photo", file);
        await fetch("/api/auth/profile/photo", {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
          body: fd,
        });
      }

      const r = await fetch("/api/auth/me", { headers: { Authorization: `Bearer ${token}` } });
      setUser(await r.json());
      setSuccess("Profile updated successfully!");
    } catch (e: any) { setSuccess("Error: " + e.message); }
    finally { setLoading(false); }
  }

  if (!user) return <main className="container">Loading...</main>;

  return (
    <main className="container" style={{ maxWidth: 600 }}>
      <h1 style={{ fontSize: 32, fontWeight: 800, color: "#0B3D91", marginBottom: 24 }}>My Profile</h1>
      <div className="card" style={{ padding: 32, display: "flex", flexDirection: "column", gap: 20 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <img
            src={user.profilePhotoUrl ? `http://localhost:4000${user.profilePhotoUrl}` : "/logo.svg"}
            alt="Profile"
            style={{ width: 80, height: 80, borderRadius: "50%", objectFit: "cover", background: "#F1F5F9" }}
          />
          <div>
            <input type="file" accept="image/*" onChange={e => setFile(e.target.files?.[0] || null)} />
            <p style={{ color: "#64748b", fontSize: 12, marginTop: 6 }}>JPG or PNG, max 10MB</p>
          </div>
        </div>
        <div>
          <label style={{ display: "block", marginBottom: 8, fontWeight: 600 }}>Full Name</label>
          <input className="input" value={fullName} onChange={e => setFullName(e.target.value)} />
        </div>
        <div>
          <label style={{ display: "block", marginBottom: 8, fontWeight: 600 }}>Phone Number</label>
          <input className="input" value={phone} onChange={e => setPhone(e.target.value)} />
        </div>
        <div>
          <label style={{ display: "block", marginBottom: 8, fontWeight: 600 }}>Fayda ID (National ID)</label>
          <input className="input" value={faydaId} onChange={e => setFaydaId(e.target.value)} />
        </div>
        <button className="btn btn-primary" onClick={saveProfile} disabled={loading} style={{ marginTop: 12 }}>
          {loading ? "Saving..." : "Save Profile"}
        </button>
        {success && <p style={{ color: success.startsWith("Error") ? "#b91c1c" : "#166534" }}>{success}</p>}
      </div>
    </main>
  );
}
