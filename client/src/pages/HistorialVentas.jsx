import React, { useState, useEffect } from "react";
import api from "../services/api";
import "./HistorialVentas.css";
import * as venta from "zod/locales";

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
  const [ventas, setVentas] = useState([
    {
      id: "1",
      createdAt: "2026-05-29T18:30:00.000Z",
      total: 3500,
      medioDePago: "EFECTIVO",
      items: [
        { id: "i1", nombre: "Café Latte", cantidad: 2, precio: 1200 },
        { id: "i2", nombre: "Medialuna de grasa", cantidad: 2, precio: 550 },
      ],
    },
    {
      id: "2",
      createdAt: "2026-05-29T19:15:00.000Z",
      total: 2100,
      medioDePago: "TRANSFERENCIA",
      items: [
        { id: "i3", nombre: "Espresso Doble", cantidad: 1, precio: 1500 },
        { id: "i4", nombre: "Alfajor de Nutella", cantidad: 1, precio: 600 },
      ],
    },
  ]);
  const [pagina, setPagina] = useState(1);
  const [totalPaginas, setTotalPaginas] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [ventaExpandida, setVentaExpandida] = useState(null);

  const cargarVentas = async (page) => {
    setLoading(true);
    setError("");
    try {
      const res = await api.get("/ventas", { params: { page, limit: 20 } });
      setVentas(res.data.data); // sirve para guardar las ventas en el estado.
      setTotalPaginas(res.data.metadata.paginasTotales);
    } catch (err) {
      setError("Error al cargar el historial de ventas");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    //cargarVentas(pagina); Comento esto asi se carga los datos, no le estoy pegando a la base y se queda cargando sino.
    setLoading(false);
  }, []);

  const toggleExpandir = (id) => {
    setVentaExpandida(ventaExpandida === id ? null : id);
  };

  return (
    <div className="historial-container">
      <h2>Historial de Ventas</h2>

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
              </tr>
            </thead>
            <tbody>
              {ventas.map((venta) => (
                <React.Fragment key={venta.id}>
                  <tr className="historial-fila" onClick={() => toggleExpandir(venta.id)}>
                    <td>#{venta.id}</td>
                    <td>{formatearFecha(venta.createdAt)}</td>
                    <td>${venta.total.toFixed(2)}</td>
                    <td>{MEDIOS_PAGO[venta.medioDePago] || venta.medioDePago}</td>
                    <td>{venta.items.reduce((sum, i) => sum + i.cantidad, 0)}</td>
                  </tr>
                  {ventaExpandida === venta.id && (
                    <tr className="historial-detalle">
                      <td colSpan={5}>
                        <strong>Detalle de items:</strong>
                        <ul>
                          {venta.items.map((item) => (
                            <li key={item.id}>
                              {item.nombre} — {item.cantidad} x ${item.precio.toFixed(2)} ={" "}
                              <strong>${(item.cantidad * item.precio).toFixed(2)}</strong>
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