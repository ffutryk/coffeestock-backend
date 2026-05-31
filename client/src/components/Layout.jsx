import { Link, Outlet, useLocation } from "react-router-dom";
import "./Layout.css";

export default function Layout({ usuario, onLogout }) {
  const location = useLocation();

  const navItems = [
    { name: "Vender", path: "/vender", icon: "🛒" },
    { name: "Inventario", path: "/inventario", icon: "📦" },
    { name: "Reportes", path: "/reportes", icon: "📊" },
    { name: "Auditoria", path: "/auditoria", icon: "🔍" },
    { name: "Empleados", path: "/empleados", icon: "👥" },
  ];

  return (
    <div className="layout-container">
      <header className="main-header">
        <div className="header-left">
          <div className="logo">
            <span className="logo-icon">☕</span>
            <div className="logo-text">
              <h1>Coffee</h1>
              <span>Stock</span>
            </div>
          </div>
          <nav className="main-nav">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={`nav-item ${location.pathname === item.path ? "active" : ""}`}
              >
                <span className="nav-icon">{item.icon}</span>
                {item.name}
              </Link>
            ))}
          </nav>
        </div>
        
        <div className="header-right">
          <div className="user-info">
            <div className="user-details">
              <span className="user-label">Usuario Actual</span>
              <span className="user-name">{usuario?.nombre || "Usuario"}</span>
              <span className="user-role">{usuario?.role || "Empleado"}</span>
            </div>
            <div className="user-avatar">
              {usuario?.nombre?.substring(0, 2).toUpperCase() || "UA"}
            </div>
          </div>
          <button className="notification-btn" title="Notificaciones">
            🔔
          </button>
          <button className="logout-btn" onClick={onLogout} title="Cerrar Sesión">
            🚪
          </button>
        </div>
      </header>
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
}
