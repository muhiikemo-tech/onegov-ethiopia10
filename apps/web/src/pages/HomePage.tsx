import { Link } from "react-router-dom";
import { t } from "../lib/i18n";

export function HomePage() {
  return (
    <main>
      <section className="hero">
        <h1>{t("home.title")}</h1>
        <p>{t("home.subtitle")}</p>
        <div className="hero-actions">
          <Link to="/login" className="btn btn-primary" style={{ padding: "14px 32px", fontSize: 16 }}>
            {t("home.signin")}
          </Link>
          <Link to="/services" className="btn btn-outline" style={{ padding: "14px 32px", fontSize: 16 }}>
            {t("home.explore")}
          </Link>
        </div>
      </section>

      <section className="container" style={{ paddingTop: 80, paddingBottom: 80 }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 24 }}>
          
          {/* Secure Card */}
          <div className="card" style={{ textAlign: "center" }}>
            <div style={{ 
              width: 72, height: 72, borderRadius: "50%", background: "#F1F5F9", 
              display: "flex", alignItems: "center", justifyContent: "center", 
              margin: "0 auto 24px" 
            }}>
              <img src="/icons/secure.svg" alt="Secure" style={{ width: 36, height: 36 }} />
            </div>
            <h3 style={{ margin: "0 0 12px", fontSize: 20, color: "#0F172A" }}>Secure</h3>
            <p style={{ color: "#64748b", margin: 0, fontSize: 15, lineHeight: 1.6 }}>
              Bank-grade security with Fayda eKYC and encryption.
            </p>
          </div>

          {/* Fast Card */}
          <div className="card" style={{ textAlign: "center" }}>
            <div style={{ 
              width: 72, height: 72, borderRadius: "50%", background: "#FFFBEB", 
              display: "flex", alignItems: "center", justifyContent: "center", 
              margin: "0 auto 24px" 
            }}>
              <img src="/icons/fast.svg" alt="Fast" style={{ width: 36, height: 36 }} />
            </div>
            <h3 style={{ margin: "0 0 12px", fontSize: 20, color: "#0F172A" }}>Fast</h3>
            <p style={{ color: "#64748b", margin: 0, fontSize: 15, lineHeight: 1.6 }}>
              Apply for services in minutes, not days.
            </p>
          </div>

          {/* Multilingual Card */}
          <div className="card" style={{ textAlign: "center" }}>
            <div style={{ 
              width: 72, height: 72, borderRadius: "50%", background: "#F0FDF4", 
              display: "flex", alignItems: "center", justifyContent: "center", 
              margin: "0 auto 24px" 
            }}>
              <img src="/icons/multilingual.svg" alt="Multilingual" style={{ width: 36, height: 36 }} />
            </div>
            <h3 style={{ margin: "0 0 12px", fontSize: 20, color: "#0F172A" }}>Multilingual</h3>
            <p style={{ color: "#64748b", margin: 0, fontSize: 15, lineHeight: 1.6 }}>
              Available in English, Amharic, and Afaan Oromoo.
            </p>
          </div>

        </div>
      </section>
    </main>
  );
}
