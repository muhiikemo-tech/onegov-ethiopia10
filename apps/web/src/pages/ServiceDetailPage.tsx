import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getLang, t } from "../lib/i18n";

interface ServiceDetail {
  id: string;
  slug: string;
  name: Record<string, string>;
  description: Record<string, string>;
  fee: number;
  processingDays: number;
  requiredDocuments: string[];
}

export function ServiceDetailPage() {
  const { slug } = useParams();
  const [svc, setSvc] = useState<ServiceDetail | null>(null);
  const lang = getLang();

  useEffect(() => {
    fetch(`/api/services/${slug}`).then(r => r.json()).then(setSvc);
  }, [slug]);

  if (!svc) return <main className="container">Loading…</main>;

  const name = svc.name[lang] || svc.name.en;
  const description = svc.description[lang] || svc.description.en;

  return (
    <main className="container" style={{ maxWidth: 720 }}>
      <h1 style={{ fontSize: 32, color: "#0B3D91", fontWeight: 800 }}>{name}</h1>
      <p style={{ fontSize: 18, color: "#475569", marginBottom: 24 }}>{description}</p>

      <div className="card" style={{ marginBottom: 24 }}>
        <div style={{ display: "flex", gap: 32, fontSize: 16 }}>
          <div>
            <strong style={{ color: "#64748b", fontSize: 13, display: "block", textTransform: "uppercase", letterSpacing: 1 }}>
              {t("services.fee")}
            </strong>
            <span style={{ fontWeight: 700, color: "#0F172A" }}>{svc.fee} ETB</span>
          </div>
          <div>
            <strong style={{ color: "#64748b", fontSize: 13, display: "block", textTransform: "uppercase", letterSpacing: 1 }}>
              {t("services.days")}
            </strong>
            <span style={{ fontWeight: 700, color: "#0F172A" }}>{svc.processingDays}</span>
          </div>
        </div>
      </div>

      <h3 style={{ color: "#0F172A" }}>Required Documents</h3>
      <ul style={{ color: "#475569", marginBottom: 24 }}>
        {svc.requiredDocuments?.map((d) => <li key={d}>{d}</li>)}
      </ul>

      <Link to={`/apply/${svc.slug}`} className="btn btn-primary" style={{ padding: "14px 32px", fontSize: 16 }}>
        Start Application
      </Link>
    </main>
  );
}
