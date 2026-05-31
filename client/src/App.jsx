import "./App.css";
import { useEffect, useState } from "react";
import { Routes, Route, useNavigate, Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Vender from "./pages/Vender";
import Inventario from "./pages/Inventario";
import ProtectedRoute from "./components/ProtectedRoute";
import Layout from "./components/Layout";

function decodeToken(token) {
  try {
    return jwtDecode(token);
  } catch {
    return null;
  }
}

function App() {
  const [token, setToken] = useState(() => localStorage.getItem("token"));

  const usuario = token ? decodeToken(token) : null;

  const navigate = useNavigate();

  useEffect(() => {
    if (token) {
      localStorage.setItem("token", token);
    } else {
      localStorage.removeItem("token");
    }
  }, [token]);

  const handleLogin = (t) => {
    setToken(t);
    navigate("/vender");
  };

  const handleLogout = () => {
    setToken(null);
    navigate("/login");
  };

  return (
    <Routes>
      <Route path="/login" element={<Login onLogin={handleLogin} />} />
      
      {/* Rutas Protegidas dentro del Layout */}
      <Route element={<ProtectedRoute usuario={usuario}><Layout usuario={usuario} onLogout={handleLogout} /></ProtectedRoute>}>
        <Route path="/dashboard" element={<Dashboard usuario={usuario} onLogout={handleLogout} />} />
        <Route path="/vender" element={<Vender />} />
        {/* Placeholder para otras rutas */}
        <Route path="/inventario" element={<Inventario/>} />
        <Route path="/reportes" element={<div className="placeholder-page"><h2>Reportes (Próximamente)</h2></div>} />
        <Route path="/auditoria" element={<div className="placeholder-page"><h2>Auditoría (Próximamente)</h2></div>} />
        <Route path="/empleados" element={<div className="placeholder-page"><h2>Empleados (Próximamente)</h2></div>} />
      </Route>

      <Route
        path="/register"
        element={
          <ProtectedRoute usuario={usuario} allowedRoles={["GERENTE"]}>
            <Register />
          </ProtectedRoute>
        }
      />
      
      <Route path="/" element={<Navigate to={token ? "/vender" : "/login"} replace />} />
      <Route path="*" element={<Navigate to={token ? "/vender" : "/login"} replace />} />
    </Routes>
  );
}

export default App;
