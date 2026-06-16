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
import HistorialVentas from "./pages/HistorialVentas";
import Empleados from "./pages/Empleados";
import HistorialInventario from "./pages/HistorialInventario";
import EstadisticasEmpleados from "./pages/EstadisticasEmpleados";
import EstadisticasProductos from "./pages/EstadisticasProductos";
import EditarVenta from "./pages/EditarVenta";
import EditarCombo from "./pages/EditarCombo";
import Productos from "./pages/Productos"

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
      <Route path="/" element={<Login onLogin={handleLogin} />} />
      <Route path="/login" element={<Login onLogin={handleLogin} />} />

      {/* Rutas Protegidas dentro del Layout */}
      <Route
        element={
          <ProtectedRoute usuario={usuario}>
            <Layout usuario={usuario} onLogout={handleLogout} />
          </ProtectedRoute>
        }
      >
        <Route
          path="/dashboard"
          element={<Dashboard usuario={usuario} onLogout={handleLogout} />}
        />
        <Route path="/vender" element={<Vender />} />
        {/* Placeholder para otras rutas */}
        <Route path="/productos" element={<Productos />} />
        <Route path="/inventario" element={<Inventario />} />
        <Route
          path="/auditoria"
          element={
            <div className="placeholder-page">
              <h2>Auditoría (Próximamente)</h2>
            </div>
          }
        />
        <Route
          path="/reportes"
          element={
            <ProtectedRoute usuario={usuario} allowedRoles={["GERENTE"]}>
              <div className="placeholder-page">
                <h2>Reportes (Próximamente)</h2>
              </div>
            </ProtectedRoute>
          }
        />
        <Route
          path="/historial-ventas"
          element={<HistorialVentas usuario={usuario} />}
        />
        <Route
          path="/empleados"
          element={
            <ProtectedRoute usuario={usuario} allowedRoles={["GERENTE"]}>
              <Empleados />
            </ProtectedRoute>
          }
        />
        <Route
          path="/estadisticas/empleados"
          element={
            <ProtectedRoute usuario={usuario} allowedRoles={["GERENTE"]}>
              <EstadisticasEmpleados />
            </ProtectedRoute>
          }
        />
        <Route
          path="/estadisticas/productos"
          element={
            <ProtectedRoute usuario={usuario} allowedRoles={["GERENTE"]}>
              <EstadisticasProductos />
            </ProtectedRoute>
          }
        />
        <Route path="/ventas/:id" element={<EditarVenta />} />
        <Route path="/combos/editar/:comboId" element={<EditarCombo />} />
      </Route>

      <Route
        path="/register"
        element={
          <ProtectedRoute usuario={usuario} allowedRoles={["GERENTE"]}>
            <Register />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard"
        element={<Dashboard usuario={usuario} onLogout={handleLogout} />}
      />
      <Route
        path="/historial-ventas"
        element={<HistorialVentas usuario={usuario} />}
      />
      <Route
        path="/historial-inventario"
        element={<HistorialInventario usuario={usuario} />}
      />
      <Route path="*" element={<Login onLogin={handleLogin} />} />
    </Routes>
  );
}

export default App;
