import { Link, Route, Routes } from "react-router-dom";
import { Login } from "./pages/Login";
import { Dashboard } from "./pages/Dashboard";
import { Applications } from "./pages/Applications";
import { AuditLogs } from "./pages/AuditLogs";
import { useAuth } from "./lib/auth";

export function App() {
  const { user, logout } = useAuth();

  return (
    <div>
      <header className="header">
        <Link to="/" style={{ display: "flex", alignItems: "center", gap: 12, textDecoration: "none" }}>
          <img src="/logo.svg" alt="OneGov Logo" style={{ width: 44, height: 44 }} />
          <div>
            <div style={{ fontWeight: 800, fontSize: 18, color: "#0B3D91", lineHeight: 1.1 }}>OneGov</div>
            <div style={{ fontWeight: 600, fontSize: 10, color: "#1B8A3A", letterSpacing: 2 }}>ADMIN</div>
          </div>
        </Link>
        <nav style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <Link to="/">Dashboard</Link>
          <Link to="/applications">Applications</Link>
          <Link to="/audit-logs">Audit Logs</Link>
          {user && (
            <button
              className="btn btn-outline"
              style={{ marginLeft: 16, minHeight: 36, padding: "6px 16px", fontSize: 13 }}
              onClick={logout}
            >
              Sign out
            </button>
          )}
        </nav>
      </header>
      <main className="container">
        <Routes>
          <Route path="/" element={user ? <Dashboard /> : <Login />} />
          <Route path="/applications" element={user ? <Applications /> : <Login />} />
          <Route path="/audit-logs" element={user ? <AuditLogs /> : <Login />} />
          <Route path="*" element={<div className="card">Page not found</div>} />
        </Routes>
      </main>
    </div>
  );
}
