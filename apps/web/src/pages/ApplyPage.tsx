import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getLang } from "../lib/i18n";

export function ApplyPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [svc, setSvc] = useState<any>(null);
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submittedId, setSubmittedId] = useState<string | null>(null);
  const [trackingNumber, setTrackingNumber] = useState<string | null>(null);
  
  const lang = getLang();

  useEffect(() => {
    fetch(`/api/services/${slug}`).then(r => r.json()).then(setSvc);
  }, [slug]);

  function handleChange(id: string, value: string) {
    setFormData(prev => ({ ...prev, [id]: value }));
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    
    const token = localStorage.getItem("onegov_token");
    if (!token) {
      setError("Please sign in first to submit an application.");
      return;
    }

    setLoading(true);
    try {
      const fd = new FormData();
      fd.append("serviceId", svc.id);
      fd.append("formData", JSON.stringify(formData));
      if (file) fd.append("documents", file);

      const res = await fetch("/api/applications", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: fd,
      });

      if (!res.ok) throw new Error("Submission failed");
      
      const data = await res.json();
      setSubmittedId(data.id);
      setTrackingNumber(data.trackingNumber);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  if (!svc) return <main className="container">Loading...</main>;

  if (submittedId) {
    return (
      <main className="container" style={{ maxWidth: 600, paddingTop: 60 }}>
        <div className="card" style={{ textAlign: "center", padding: 48 }}>
          <div style={{ fontSize: 64, marginBottom: 16 }}>🎉</div>
          <h2 style={{ color: "#1B8A3A", marginTop: 0 }}>Application Submitted!</h2>
          <p style={{ color: "#64748b" }}>Your tracking number is:</p>
          <p style={{ fontSize: 24, fontWeight: 800, color: "#0B3D91", letterSpacing: 2 }}>{trackingNumber}</p>
          <button className="btn btn-primary" onClick={() => navigate(`/pay/${submittedId}`)} style={{ width: "100%", fontSize: 16 }}>
            Pay Now
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="container" style={{ maxWidth: 600 }}>
      <h1 style={{ fontSize: 32, color: "#0B3D91" }}>Apply: {svc.name[lang] || svc.name.en}</h1>
      <p style={{ color: "#64748b", marginBottom: 24 }}>
        Fee: <strong>{svc.fee} ETB</strong> · Processing: <strong>{svc.processingDays} days</strong>
      </p>

      {error && <p style={{ color: "#b91c1c" }}>{error}</p>}

      <form onSubmit={submit} className="card" style={{ display: "flex", flexDirection: "column", gap: 20 }}>
        
        {svc.formSchema?.map((field: any) => {
          const fieldLabel = field.label[lang] || field.label.en;
          
          return (
            <div key={field.id}>
              <label style={{ display: "block", marginBottom: 8, fontWeight: 600, color: "#334155" }}>
                {fieldLabel} {field.required && <span style={{ color: "red" }}>*</span>}
              </label>
              
              {field.type === "text" || field.type === "number" ? (
                <input 
                  className="input" 
                  type={field.type} 
                  required={field.required}
                  value={formData[field.id] || ""} 
                  onChange={e => handleChange(field.id, e.target.value)} 
                />
              ) : field.type === "date" ? (
                <input 
                  className="input" 
                  type="date" 
                  required={field.required}
                  value={formData[field.id] || ""} 
                  onChange={e => handleChange(field.id, e.target.value)} 
                />
              ) : field.type === "textarea" ? (
                <textarea 
                  className="input" 
                  required={field.required}
                  value={formData[field.id] || ""} 
                  onChange={e => handleChange(field.id, e.target.value)} 
                  rows={3} 
                />
              ) : field.type === "select" ? (
                <select 
                  className="input" 
                  required={field.required}
                  value={formData[field.id] || ""} 
                  onChange={e => handleChange(field.id, e.target.value)}
                >
                  <option value="">Select...</option>
                  {field.options?.map((opt: string) => <option key={opt} value={opt}>{opt}</option>)}
                </select>
              ) : null}
            </div>
          );
        })}

        <div>
          <label style={{ display: "block", marginBottom: 8, fontWeight: 600, color: "#334155" }}>Upload Document (PDF/Image)</label>
          <input type="file" accept=".pdf,.jpg,.jpeg,.png" onChange={e => setFile(e.target.files?.[0] || null)} style={{ padding: 8, border: "1px solid #cbd5e1", borderRadius: 8, width: "100%" }} />
        </div>

        <button className="btn btn-primary" type="submit" disabled={loading} style={{ fontSize: 16, marginTop: 8 }}>
          {loading ? "Submitting..." : "Submit Application"}
        </button>
      </form>
    </main>
  );
}
