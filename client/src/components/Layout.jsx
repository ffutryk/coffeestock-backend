import { Link, Outlet, useLocation } from "react-router-dom";
import "./Layout.css";
import logoCoffeeStock from "../assets/logo-coffee-stock.png";

export default function Layout({ usuario, onLogout }) {
  const location = useLocation();

  const navItems = [
    { 
      name: "Vender", 
      path: "/vender", 
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect>
          <line x1="1" y1="10" x2="23" y2="10"></line>
        </svg>
      ) 
    },
    { 
      name: "Inventario", 
      path: "/inventario", 
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="21 8 21 21 3 21 3 8"></polyline>
          <rect x="1" y="3" width="22" height="5"></rect>
          <line x1="10" y1="12" x2="14" y2="12"></line>
        </svg>
      ) 
    },
    { 
      name: "Reportes", 
      path: "/reportes", 
      allowedRoles: ["GERENTE"],
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="18" y1="20" x2="18" y2="10"></line>
          <line x1="12" y1="20" x2="12" y2="4"></line>
          <line x1="6" y1="20" x2="6" y2="14"></line>
        </svg>
      ) 
    },
    { 
      name: "Estadísticas", 
      path: "/estadisticas/empleados", 
      allowedRoles: ["GERENTE"],
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 12V7H5a2 2 0 0 1 0-4h14v4"></path>
          <path d="M3 5v14a2 2 0 0 0 2 2h16v-5"></path>
          <path d="M18 12a2 2 0 0 0 0 4h4v-4Z"></path>
        </svg>
      ) 
    },
    { 
      name: "Auditoria", 
      path: "/historial-ventas", 
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="8"></circle>
          <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
        </svg>
      ) 
    },
    { 
      name: "Empleados", 
      path: "/empleados", 
      allowedRoles: ["GERENTE"],
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
          <circle cx="9" cy="7" r="4"></circle>
          <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
          <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
        </svg>
      ) 
    },
  ];

  const filteredNavItems = navItems.filter(item => 
    !item.allowedRoles || item.allowedRoles.includes(usuario?.role)
  );

  return (
    <div className="layout-container">
      <header className="main-header">
        <div className="header-left">
          <div className="logo">
            <img src={logoCoffeeStock} alt="CoffeeStock Logo" className="logo-image" />
          </div>
          <nav className="main-nav">
            {filteredNavItems.map((item) => (
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
              <span className="user-name">{usuario?.nombre || "Usuario"}</span>
              <span className="user-role">{usuario?.role || "Empleado"}</span>
            </div>
            <div className="user-avatar">
              {usuario?.nombre?.substring(0, 2).toUpperCase()}
            </div>
          </div>
          <button className="notification-btn" title="Notificaciones">
            <svg width="25" height="25" viewBox="0 0 54 54" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M22.5 47.25H31.5C31.5 49.725 29.475 51.75 27 51.75C24.525 51.75 22.5 49.725 22.5 47.25ZM47.25 42.75V45H6.75V42.75L11.25 38.25V24.75C11.25 17.775 15.75 11.7 22.5 9.675V9C22.5 6.525 24.525 4.5 27 4.5C29.475 4.5 31.5 6.525 31.5 9V9.675C38.25 11.7 42.75 17.775 42.75 24.75V38.25L47.25 42.75ZM38.25 24.75C38.25 18.45 33.3 13.5 27 13.5C20.7 13.5 15.75 18.45 15.75 24.75V40.5H38.25V24.75Z" fill="#4B3832"/>
            </svg>
          </button>
          <button className="logout-btn" onClick={onLogout} title="Cerrar Sesión">
            <svg width="25" height="25" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect width="38" height="40" rx="8" fill="#BE6262"/>
              <path d="M16 32H10.6667C9.95942 32 9.28115 31.719 8.78105 31.219C8.28095 30.7189 8 30.0406 8 29.3333V10.6667C8 9.95942 8.28095 9.28115 8.78105 8.78105C9.28115 8.28095 9.95942 8 10.6667 8H16M25.3333 13.3333L32 20L25.3333 26.6667M32 20H16" stroke="white" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </button>
        </div>
      </header>
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
}
