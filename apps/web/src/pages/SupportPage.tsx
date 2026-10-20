import { useEffect, useState } from "react";

export function SupportPage() {
  const [faqs, setFaqs] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/support/faq").then(r => r.json()).then(setFaqs);
  }, []);

  return (
    <main className="container" style={{ maxWidth: 720 }}>
      <div style={{ textAlign: "center", marginBottom: 40 }}>
        <h1 style={{ fontSize: 36, fontWeight: 800, color: "#0B3D91", margin: 0 }}>Support & FAQ</h1>
        <p style={{ color: "#64748b", fontSize: 16, marginTop: 8 }}>
          Find answers to common questions about OneGov services.
        </p>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {faqs.map((f) => (
          <details key={f.id} className="card" style={{ padding: 24, cursor: "pointer" }}>
            <summary style={{ fontWeight: 700, fontSize: 16, color: "#0F172A", listStyle: "none", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              {f.q.en}
              <span style={{ color: "#0B3D91", fontSize: 20 }}>+</span>
            </summary>
            <p style={{ color: "#475569", marginTop: 16, marginBottom: 0, lineHeight: 1.7 }}>{f.a.en}</p>
          </details>
        ))}
      </div>

      <div className="card" style={{ marginTop: 32, padding: 32, textAlign: "center", background: "#F8FAFC" }}>
        <h3 style={{ marginTop: 0, color: "#0B3D91" }}>Still need help?</h3>
        <p style={{ color: "#64748b" }}>Contact our support team</p>
        <a href="mailto:support@onegov.et" className="btn btn-primary" style={{ marginTop: 12 }}>
          Email Support
        </a>
      </div>
    </main>
  );
}
