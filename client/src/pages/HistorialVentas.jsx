import React, { useState, useEffect } from "react";
import api from "../services/api";
import "./HistorialVentas.css";
import "./Empleados.css"; // para compartir estilos de tabla y botones
import { useNavigate } from "react-router-dom";

const MEDIOS_PAGO = {
  EFECTIVO: "Efectivo",
  TARJETA_DEBITO: "Tarjeta de Débito",
  TARJETA_CREDITO: "Tarjeta de Crédito",
  TRANSFERENCIA: "Transferencia",
};

function formatearFecha(iso) {
  return new Date(iso).toLocaleString("es-AR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function HistorialVentas({ usuario }) {
  const [ventas, setVentas] = useState([]);
  const [pagina, setPagina] = useState(1);
  const [totalPaginas, setTotalPaginas] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [ventaExpandida, setVentaExpandida] = useState(null);
  const navigate = useNavigate();
  const [filtro, setFiltro] = useState("TODAS");

  const cargarVentas = async (page, filtroActual = filtro) => {
    setLoading(true);
    setError("");
    try {
      const params = {page, limit: 20};
      if (filtroActual === "24H") {
        params.rango = "24h";
      }
      const res = await api.get("/ventas", {params});
      setVentas(res.data.data);
      setTotalPaginas(res.data.metadata.paginasTotales);
    } catch (err) {
      setError("Error al cargar el historial de ventas");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarVentas(pagina, filtro);
  }, [pagina, filtro]);

  const toggleExpandir = (id) => {
    setVentaExpandida(ventaExpandida === id ? null : id);
  };

  const handleEliminarVenta = (venta) => {
    console.log(
      "Acá se supone que se eliminaría la venta, no se por qué quisieras hacer eso willis",
    );
  };

  return (
    <div className="historial-container">
      <div className="historial-header">
        <h2>Historial de Ventas</h2>
        <select
          value={filtro}
          onChange={(e) => {
          setPagina(1);
          setFiltro(e.target.value);
          {loading && <p>Cargando ventas...</p>} //esta bien?
          }}
        >
          <option value="TODAS">
            Todas
          </option>
          <option value="24H">
            Últimas 24 horas
          </option>
        </select>
      </div>

      {error && <div className="error">{error}</div>}

      {loading ? (
        <p>Cargando...</p>
      ) : ventas.length === 0 ? (
        <p>No hay ventas registradas.</p>
      ) : (
        <>
          <table className="historial-tabla">
            <thead>
              <tr>
                <th>ID</th>
                <th>Fecha</th>
                <th>Total</th>
                <th>Medio de Pago</th>
                <th>Items</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {ventas.map((venta) => (
                <React.Fragment key={venta.id}>
                  <tr className="historial-fila">
                    <td>#{venta.id}</td>
                    <td>{formatearFecha(venta.createdAt)}</td>
                    <td>${venta.total.toFixed(2)}</td>
                    <td>
                      {MEDIOS_PAGO[venta.medioDePago] || venta.medioDePago}
                    </td>
                    <td>
                      {venta.items.reduce((sum, i) => sum + i.cantidad, 0)}
                    </td>
                    <td className="historial-acciones">
                      <button
                        className="btn-accion edit"
                        title="Editar"
                        onClick={() => navigate(`/ventas/${venta.id}`)}
                      >
                        <svg
                          width="18"
                          height="18"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                        </svg>
                      </button>
                      <button
                        className="btn-accion delete"
                        title="Eliminar"
                        onClick={() => handleEliminarVenta(venta)}
                      >
                        <svg
                          width="18"
                          height="18"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <polyline points="3 6 5 6 21 6"></polyline>
                          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                          <line x1="10" y1="11" x2="10" y2="17"></line>
                          <line x1="14" y1="11" x2="14" y2="17"></line>
                        </svg>
                      </button>
                      <button
                        className="btn-accion expand"
                        title={
                          ventaExpandida === venta.id
                            ? "Cerrar detalle"
                            : "Ver detalle"
                        }
                        onClick={() => toggleExpandir(venta.id)}
                      >
                        <svg
                          width="18"
                          height="18"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          {ventaExpandida === venta.id ? (
                            <line x1="5" y1="12" x2="19" y2="12"></line>
                          ) : (
                            <>
                              <line x1="12" y1="5" x2="12" y2="19"></line>
                              <line x1="5" y1="12" x2="19" y2="12"></line>
                            </>
                          )}
                        </svg>
                      </button>
                    </td>
                  </tr>
                  {ventaExpandida === venta.id && (
                    <tr className="historial-detalle">
                      <td colSpan={5}>
                        <strong>Detalle de items:</strong>
                        <ul>
                          {venta.items.map((item) => (
                            <li key={item.id}>
                              {item.nombre} — {item.cantidad} x $
                              {item.precio.toFixed(2)} ={" "}
                              <strong>
                                ${(item.cantidad * item.precio).toFixed(2)}
                              </strong>
                            </li>
                          ))}
                        </ul>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
          <div className="historial-paginacion">
            <button
              onClick={() => setPagina((p) => Math.max(1, p - 1))}
              disabled={pagina === 1}
            >
              Anterior
            </button>
            <span>
              Página {pagina} de {totalPaginas}
            </span>
            <button
              onClick={() => setPagina((p) => p + 1)}
              disabled={pagina >= totalPaginas}
            >
              Siguiente
            </button>
          </div>
        </>
      )}
    </div>
  );
}
