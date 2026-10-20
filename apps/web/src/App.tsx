import { useState } from "react";
import { Link, Route, Routes } from "react-router-dom";
import { HomePage } from "./pages/HomePage";
import { ServicesPage } from "./pages/ServicesPage";
import { ServiceDetailPage } from "./pages/ServiceDetailPage";
import { TrackPage } from "./pages/TrackPage";
import { SupportPage } from "./pages/SupportPage";
import { LoginPage } from "./pages/LoginPage";
import { ApplyPage } from "./pages/ApplyPage";
import { PaymentPage } from "./pages/PaymentPage";
import { ProfilePage } from "./pages/ProfilePage";
import { getLang, t } from "./lib/i18n";

export function App() {
  const [lang, setLang] = useState(getLang());

  const changeLang = (l: string) => {
    localStorage.setItem("lang", l);
    setLang(l as any);
    window.location.reload();
  };

  return (
    <div>
      <header className="header">
        <Link to="/" style={{ display: "flex", alignItems: "center", gap: 12, textDecoration: "none" }}>
          <img src="/logo.svg" alt="OneGov Logo" style={{ width: 40, height: 40 }} />
          <div>
            <div style={{ fontWeight: 800, fontSize: 20, color: "#0B3D91", lineHeight: 1.1 }}>OneGov</div>
            <div style={{ fontWeight: 600, fontSize: 11, color: "#1B8A3A", letterSpacing: 2 }}>ETHIOPIA</div>
          </div>
        </Link>
        
        <nav style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <Link to="/services">{t("nav.services")}</Link>
          <Link to="/track">{t("nav.track")}</Link>
          <Link to="/support">{t("nav.support")}</Link>
          
          {/* Profile Link */}
          <Link to="/profile">Profile</Link>
          
          <div style={{ width: 1, height: 24, background: "#E2E8F0", margin: "0 8px" }}></div>
          
          <select 
            value={lang} 
            onChange={(e) => changeLang(e.target.value)} 
            style={{ padding: "8px 12px", borderRadius: 6, border: "1px solid #CBD5E1", background: "white", color: "#334155", fontWeight: "600", fontSize: 13, cursor: "pointer" }}
          >
            <option value="en">English</option>
            <option value="am">አማርኛ</option>
            <option value="om">Afaan Oromoo</option>
          </select>
          <Link to="/login" className="btn btn-primary" style={{ minHeight: 40, padding: "8px 16px", fontSize: 14 }}>
            {t("nav.signin")}
          </Link>
        </nav>
      </header>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/services" element={<ServicesPage />} />
        <Route path="/services/:slug" element={<ServiceDetailPage />} />
        <Route path="/apply/:slug" element={<ApplyPage />} />
        <Route path="/pay/:id" element={<PaymentPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/track" element={<TrackPage />} />
        <Route path="/support" element={<SupportPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="*" element={<div className="container"><div className="card">Page not found</div></div>} />
      </Routes>
    </div>
  );
}
