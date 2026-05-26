import React, { useState } from "react";
import { registerUsuario } from "../services/auth";

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
      setError(err.response?.data?.message || "Error al registrar empleado");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-container">
      <form onSubmit={handleSubmit}>
        <h2>Registrar empleado</h2>
        {message && <div className="success">{message}</div>}
        {error && <div className="error">{error}</div>}
        <input name="cuil" value={form.cuil} onChange={handleChange} placeholder="CUIL (ej. 20-12345678-3)" />
        <input name="nombre" value={form.nombre} onChange={handleChange} placeholder="Nombre" />
        <input name="apellido" value={form.apellido} onChange={handleChange} placeholder="Apellido" />
        <input name="email" value={form.email} onChange={handleChange} placeholder="Email" />
        <input name="password" type="password" value={form.password} onChange={handleChange} placeholder="Contraseña" />
        <button type="submit" disabled={loading}>{loading ? "Registrando..." : "Registrar"}</button>
      </form>
    </div>
  );
}
