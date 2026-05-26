import React from "react";

export default function Dashboard({ usuario, onLogout }) {
  return (
    <div className="dashboard">
      <h2>Bienvenido, {usuario?.nombre || "Usuario"}</h2>
      <p>Rol: {usuario?.role}</p>
      <button onClick={onLogout}>Cerrar sesión</button>
    </div>
  );
}
