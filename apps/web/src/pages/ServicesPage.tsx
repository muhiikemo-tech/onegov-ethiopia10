import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { t, getLang } from "../lib/i18n";

interface Service {
  id: string;
  slug: string;
  name: Record<string, string>;
  description: Record<string, string>;
  fee: number;
  processingDays: number;
  categorySlug: string;
}

const getIcon = (category: string) => {
  switch (category) {
    case "identity": return "🛂";
    case "business": return "🏢";
    case "tax": return "💰";
    case "transport": return "🚗";
    case "health": return "🏥";
    case "education": return "🎓";
    case "land": return "🏘️";
    case "justice": return "⚖️";
    case "utility": return "⚡";
    case "fayda": return "🆔";
    default: return "🏛️";
  }
};

export function ServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [q, setQ] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true); // Loading state
  const lang = getLang();

  useEffect(() => {
    fetch("/api/services")
      .then((r) => r.json())
      .then(setServices)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false)); // Set loading to false
  }, []);

  const filtered = services.filter((s) => {
    const name = s.name[lang] || s.name.en;
    return name.toLowerCase().includes(q.toLowerCase());
  });

  return (
    <main className="container animate-fade-in">
      <h1 style={{ fontSize: 32, fontWeight: 800, color: "#0B3D91", marginBottom: 8 }}>
        {t("services.title")}
      </h1>
      <p style={{ color: "#64748b", fontSize: 16, marginBottom: 32 }}>
        {t("services.subtitle")}
      </p>

      <input
        className="input"
        placeholder={t("services.search")}
        value={q}
        onChange={(e) => setQ(e.target.value)}
        style={{ marginBottom: 32, maxWidth: 500 }}
      />

      {error && <p style={{ color: "red" }}>{error}</p>}

      {loading ? (
        // SPINNER LOADING
        <div style={{ display: "flex", justifyContent: "center", padding: 60 }}>
          <div className="spinner"></div>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 20 }}>
          {filtered.map((s) => {
            const name = s.name[lang] || s.name.en;
            const description = s.description[lang] || s.description.en;
            
            return (
              <Link key={s.id} to={`/services/${s.slug}`} className="card card-link" style={{ padding: 24 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 16 }}>
                  <div style={{ fontSize: 32 }}>{getIcon(s.categorySlug)}</div>
                  <h3 style={{ margin: 0, color: "#0B3D91", fontSize: 18 }}>{name}</h3>
                </div>
                <p style={{ color: "#64748b", margin: "0 0 16px", flex: 1, fontSize: 14 }}>
                  {description}
                </p>
                <div style={{ display: "flex", gap: 16, fontSize: 13, color: "#475569", background: "#F8FAFC", padding: "12px 16px", borderRadius: 8 }}>
                  <span><strong>{t("services.fee")}:</strong> {s.fee} ETB</span>
                  <span><strong>{t("services.days")}:</strong> {s.processingDays}</span>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </main>
  );
}
