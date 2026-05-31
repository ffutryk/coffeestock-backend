import React, { useState, useEffect } from "react";
import api from "../services/api";
import "./HistorialInventario.css";

const MOTIVOS = {
  compra: "Updated Stock",
  uso: "AutoStock Update",
  descarte: "Stock Disposal",
  correccion: "Stock Correction",
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
  const [pagina, setPagina] = useState(1);
  const itemsPorPagina = 5;
  const movimientosMock = [
    {
      id: 1,
      motivo: "compra",
      cantidad: 500,
      materiaPrima: { id: 1, nombre: "Café en grano", unidad: "KG" },
      ventaId: null,
      createdAt: "2026-05-30T14:30:00.000Z",
    },
    {
      id: 2,
      motivo: "uso",
      cantidad: -200,
      materiaPrima: { id: 1, nombre: "Café en grano", unidad: "MG" },
      ventaId: 42,
      createdAt: "2026-05-30T15:10:00.000Z",
    },
    {
      id: 3,
      motivo: "compra",
      cantidad: 2,
      materiaPrima: { id: 3, nombre: "Leche entera", unidad: "L" },
      ventaId: null,
      createdAt: "2026-05-29T09:00:00.000Z",
    },
    {
      id: 4,
      motivo: "uso",
      cantidad: -500,
      materiaPrima: { id: 3, nombre: "Leche entera", unidad: "ML" },
      ventaId: 41,
      createdAt: "2026-05-29T10:45:00.000Z",
    },
    {
      id: 5,
      motivo: "descarte",
      cantidad: -100,
      materiaPrima: { id: 2, nombre: "Azúcar", unidad: "KG" },
      ventaId: null,
      createdAt: "2026-05-28T17:20:00.000Z",
    },
    {
      id: 6,
      motivo: "correccion",
      cantidad: 50,
      materiaPrima: { id: 2, nombre: "Azúcar", unidad: "KG" },
      nota: "Error de conteo en inventario anterior",
      ventaId: null,
      createdAt: "2026-05-28T12:00:00.000Z",
    },
  ];

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setMovimientos(movimientosMock);
      setLoading(false);
    }, 500);
  }, []);

  const totalPaginas = Math.ceil(movimientos.length / itemsPorPagina);
  const movimientosPagina = movimientos.slice(
    (pagina - 1) * itemsPorPagina,
    pagina * itemsPorPagina
  );

  return (
    <div className="historial-container">
      <h2>Historial de Inventario</h2>

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
                className={`movimiento-card movimiento-${mov.motivo}`}
              >
                <div className="movimiento-time">
                  <span className="movimiento-hora">{formatearHora(mov.createdAt)}</span>
                  <span className="movimiento-fecha">{formatearFecha(mov.createdAt)}</span>
                </div>

                <div className="movimiento-body">
                  <h3 className="movimiento-titulo">{MOTIVOS[mov.motivo]}</h3>

                  <p className="movimiento-detalle">
                    {mov.cantidad > 0 ? "+" : "-"}
                    {Math.abs(mov.cantidad)} {mov.materiaPrima.unidad} de{" "}
                    <strong>{mov.materiaPrima.nombre}</strong>
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