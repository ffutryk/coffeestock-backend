import React, { useState, useEffect } from "react";
import api from "../services/api";
import "./HistorialInventario.css";

const MOTIVOS = {
  COMPRA: "Updated Stock",
  VENTA: "AutoStock Update",
  USO: "AutoStock Update",
  DESCARTE: "Stock Disposal",
  CORRECCION: "Stock Correction",
};

function formatearFecha(iso) {
  return new Date(iso).toLocaleString("es-AR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

function formatearHora(iso) {
  return new Date(iso).toLocaleString("es-AR", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function HistorialInventario({ usuario }) {
  const [movimientos, setMovimientos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [pagina, setPagina] = useState(1);
  const itemsPorPagina = 5;

  const cargarHistorial = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await api.get("/inventario/movimientos");
      setMovimientos(res.data);
    } catch (err) {
      setError("Error al cargar el historial de movimientos");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarHistorial();
  }, []);

  const totalPaginas = Math.ceil(movimientos.length / itemsPorPagina);
  const movimientosPagina = movimientos.slice(
    (pagina - 1) * itemsPorPagina,
    pagina * itemsPorPagina
  );

  return (
    <div className="historial-container">
      <h2>Historial de Inventario</h2>

      {error && <div className="error-message">{error}</div>}

      {loading ? (
        <p>Cargando...</p>
      ) : movimientos.length === 0 ? (
        <p>No hay movimientos registrados.</p>
      ) : (
        <>
          <div className="movimientos-lista">
            {movimientosPagina.map((mov) => (
              <div
                key={mov.id}
                className={`movimiento-card movimiento-${mov.motivo?.toLowerCase()}`}
              >
                <div className="movimiento-time">
                  <span className="movimiento-hora">{formatearHora(mov.createdAt)}</span>
                  <span className="movimiento-fecha">{formatearFecha(mov.createdAt)}</span>
                </div>

                <div className="movimiento-body">
                  <h3 className="movimiento-titulo">{MOTIVOS[mov.motivo] || mov.motivo}</h3>

                  <p className="movimiento-detalle">
                    {mov.cantidad > 0 ? "+" : ""}
                    {mov.cantidad} {mov.materiaPrima?.unidad || ""} de{" "}
                    <strong>{mov.materiaPrima?.nombre || "Materia Prima"}</strong>
                  </p>

                  {mov.ventaId && (
                    <p className="movimiento-venta">
                      Orden de venta #{mov.ventaId}
                    </p>
                  )}

                  {mov.nota && (
                    <p className="movimiento-nota">
                      Nota: {mov.nota}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="historial-paginacion">
            <button onClick={() => setPagina((p) => Math.max(1, p - 1))} disabled={pagina === 1}>
              Anterior
            </button>
            <span>
              Página {pagina} de {totalPaginas}
            </span>
            <button onClick={() => setPagina((p) => p + 1)} disabled={pagina >= totalPaginas}>
              Siguiente
            </button>
          </div>
        </>
      )}
    </div>
  );
}