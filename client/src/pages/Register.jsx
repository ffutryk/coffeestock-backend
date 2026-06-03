import { useState } from "react";
import { Link } from "react-router-dom";
import { registerUsuario } from "../services/auth";
import { parseApiError } from "../utils/parseApiError";
import logo from "../assets/logo.png";

export default function Register() {
  const [form, setForm] = useState({ cuil: "", nombre: "", apellido: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const cuilRegex = /^\d{2}-\d{8}-\d{1}$/;

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    if (!cuilRegex.test(form.cuil)) return setError("CUIL inválido");
    if (!form.nombre || !form.apellido) return setError("Nombre y apellido son obligatorios");
    if (!/\S+@\S+\.\S+/.test(form.email)) return setError("Email inválido");
    if (form.password.length < 8) return setError("La contraseña debe tener al menos 8 caracteres");
    setLoading(true);
    try {
      const res = await registerUsuario(form);
      setMessage(res.message || "Empleado registrado exitosamente");
      setForm({ cuil: "", nombre: "", apellido: "", email: "", password: "" });
    } catch (err) {
      const parsed = parseApiError(err);
      setError(parsed.message || parsed.fieldErrors || "Error al registrar empleado");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="centered-page">
      <img src={logo} alt="logo" id="logo" />
      <div className="form-container">
        <form onSubmit={handleSubmit}>
          <h2>Registrar empleado</h2>
          {message && <div className="success">{message}</div>}
          {error && (
            <div className="error">{typeof error === "string" ? error : JSON.stringify(error)}</div>
          )}
          <div className="form-row">
            <label>CUIL</label>
            <input
              name="cuil"
              value={form.cuil}
              onChange={handleChange}
              placeholder="20-12345678-3"
            />
          </div>
          <div className="form-row">
            <label>Nombre</label>
            <input name="nombre" value={form.nombre} onChange={handleChange} placeholder="Nombre" />
          </div>
          <div className="form-row">
            <label>Apellido</label>
            <input
              name="apellido"
              value={form.apellido}
              onChange={handleChange}
              placeholder="Apellido"
            />
          </div>
          <div className="form-row">
            <label>Email</label>
            <input name="email" value={form.email} onChange={handleChange} placeholder="Email" />
          </div>
          <div className="form-row">
            <label>Contraseña</label>
            <input
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Contraseña"
            />
          </div>
          <button type="submit" disabled={loading}>
            {loading ? "Registrando..." : "Registrar"}
          </button>
          <div style={{ marginTop: "1rem", textAlign: "center" }}>
            <Link to="/empleados" style={{ color: "var(--coffee-medium)", fontSize: "0.9rem" }}>
              ← Volver a la lista
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
