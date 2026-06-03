import { useState } from "react";
import { Link } from "react-router-dom";
import { registerUsuario } from "../services/auth";
import { parseApiError } from "../utils/parseApiError";
import logo from "../assets/logo-coffee-stock.png";

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
    <div className="auth-page">
      <div className="auth-card">
        <img src={logo} alt="Coffee Stock Logo" className="auth-logo" />
        <form className="auth-form" onSubmit={handleSubmit}>
          {message && <div className="auth-success">{message}</div>}
          {error && (
            <div className="auth-error">{typeof error === "string" ? error : JSON.stringify(error)}</div>
          )}
          
          <div className="input-container">
            <span className="input-icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
            </span>
            <input
              name="cuil"
              value={form.cuil}
              onChange={handleChange}
              placeholder="Cuil"
              required
            />
          </div>

          <div className="input-container">
            <span className="input-icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="4 17 10 11 4 5"></polyline>
                <line x1="12" y1="19" x2="20" y2="19"></line>
              </svg>
            </span>
            <input 
              name="nombre" 
              value={form.nombre} 
              onChange={handleChange} 
              placeholder="Nombre" 
              required
            />
          </div>

          <div className="input-container">
            <span className="input-icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 20h9"></path>
                <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
              </svg>
            </span>
            <input
              name="apellido"
              value={form.apellido}
              onChange={handleChange}
              placeholder="Apellido"
              required
            />
          </div>

          <div className="input-container">
            <span className="input-icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                <polyline points="22,6 12,13 2,6"></polyline>
              </svg>
            </span>
            <input 
              name="email" 
              type="email"
              value={form.email} 
              onChange={handleChange} 
              placeholder="Email" 
              required
            />
          </div>

          <div className="input-container">
            <span className="input-icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3L15.5 7.5z"></path>
              </svg>
            </span>
            <input
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Contraseña"
              required
            />
          </div>

          <button type="submit" className="auth-button" disabled={loading}>
            {loading ? "Registrando..." : "REGISTRAR"}
          </button>
          
          <div className="auth-footer">
            <Link to="/empleados" className="auth-link">
              ← Volver a la lista
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
