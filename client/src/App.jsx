import "./App.css";
import { useEffect, useState } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import HistorialVentas from "./pages/HistorialVentas";

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

  // El efecto solo sincroniza con localStorage
  useEffect(() => {
    if (token) {
      localStorage.setItem("token", token);
    } else {
      localStorage.removeItem("token");
    }
  }, [token]);

  const handleLogin = (t) => {
    setToken(t);
    navigate("/dashboard");
  };

  const handleLogout = () => {
    setToken(null);
    navigate("/login");
  };

  return (
    <Routes>
      <Route path="/login" element={<Login onLogin={handleLogin} />} />
      <Route
        path="/register"
        element={
          <ProtectedRoute usuario={usuario} allowedRoles={["GERENTE"]}>
            <Register />
          </ProtectedRoute>
        }
      />
      <Route path="/dashboard" element={<Dashboard usuario={usuario} onLogout={handleLogout} />} />
      <Route path="/historial-ventas" element={<HistorialVentas usuario={usuario} />} />
      <Route path="*" element={<Login onLogin={handleLogin} />} />
    </Routes>
  );
}

export default App;
