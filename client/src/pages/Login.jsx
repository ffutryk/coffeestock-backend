import React, { useState } from "react";
import { login } from "../services/auth";
import { parseApiError } from "../utils/parseApiError";

export default function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!email || password.length < 8) {
      setError("Email inválido o contraseña menor a 8 caracteres");
      return;
    }
    setLoading(true);
    try {
      const token = await login({ email, password });
      onLogin(token);
    } catch (err) {
      const parsed = parseApiError(err);
      setError(parsed.fieldErrors?.email || parsed.message || "Error al iniciar sesión");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-container">
      <form onSubmit={handleSubmit}>
        <h2>Iniciar sesión</h2>
        {error && <div className="error">{error}</div>}
        <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" autoComplete="username" />
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Contraseña" autoComplete="current-password" />
        <button type="submit" disabled={loading}>{loading ? "Entrando..." : "Entrar"}</button>
      </form>
    </div>
  );
}
