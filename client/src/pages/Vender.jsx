import { useState, useEffect } from "react";
import api from "../services/api";
import ProductoCard from "../components/ProductoCard";
import "./Vender.css";

export default function Vender() {
  const [productos, setProductos] = useState([]);
  const [orden, setOrden] = useState([]);
  const [cliente, setCliente] = useState("");
  const [medioDePago, setMedioDePago] = useState("EFECTIVO");
  const [loading, setLoading] = useState(true);
  const [mensaje, setMensaje] = useState({ text: "", type: "" });

  useEffect(() => {
    fetchProductos();
  }, []);

  const fetchProductos = async () => {
    try {
      const response = await api.get("/productos");
      setProductos(response.data);
    } catch (error) {
      console.error("Error fetching productos:", error);
      showMensaje("Error al cargar productos", "error");
    } finally {
      setLoading(false);
    }
  };

  const showMensaje = (text, type) => {
    setMensaje({ text, type });
    setTimeout(() => setMensaje({ text: "", type: "" }), 3000);
  };

  const agregarAlPedido = (producto) => {
    if (producto.stock <= 0) return;

    setOrden((prev) => {
      const itemExistente = prev.find((item) => item.id === producto.id);
      if (itemExistente) {
        return prev.map((item) =>
          item.id === producto.id ? { ...item, cantidad: item.cantidad + 1 } : item
        );
      }
      return [...prev, { ...producto, cantidad: 1 }];
    });
  };

  const quitarDelPedido = (productoId) => {
    setOrden((prev) => {
      const itemExistente = prev.find((item) => item.id === productoId);
      if (itemExistente.cantidad === 1) {
        return prev.filter((item) => item.id !== productoId);
      }
      return prev.map((item) =>
        item.id === productoId ? { ...item, cantidad: item.cantidad - 1 } : item
      );
    });
  };

  const calcularTotal = () => {
    return orden.reduce((total, item) => total + item.precio * item.cantidad, 0);
  };

  const handleConfirmarVenta = async () => {
    if (!cliente.trim()) {
      showMensaje("El nombre del cliente es obligatorio", "error");
      return;
    }

    if (orden.length === 0) {
      showMensaje("El pedido está vacío", "error");
      return;
    }

    try {
      const payload = {
        medioDePago,
        items: orden.map((item) => ({
          productoId: item.id,
          cantidad: item.cantidad,
        })),
      };

      await api.post("/ventas", payload);
      showMensaje("Venta realizada con éxito", "success");
      setOrden([]);
      setCliente("");
      fetchProductos(); // Refrescar stock
    } catch (error) {
      console.error("Error al realizar venta:", error);
      showMensaje("Error al procesar la venta", "error");
    }
  };

  if (loading) return <div className="loading">Cargando productos...</div>;

  return (
    <div className="vender-container">
      <div className="catalogo-section">
        <div className="section-header">
          <h2>Catálogo de Productos</h2>
          <span className="productos-count">{productos.length} items disponibles</span>
        </div>
        
        <div className="productos-grid">
          {productos.map((prod) => (
            <ProductoCard
              key={prod.id}
              producto={prod}
              onAgregar={agregarAlPedido}
            />
          ))}
        </div>
      </div>

      <div className="orden-section">
        <div className="orden-card">
          <div className="orden-header">
            <div className="header-title">
              <h3>Pedido Actual</h3>
              <p>{new Date().toLocaleDateString()}</p>
            </div>
            <div className="pedido-icon">📋</div>
          </div>

          <div className="orden-inputs">
            <div className="input-group">
              <label>Cliente <span style={{ color: "var(--error-color)" }}>*</span></label>
              <input 
                type="text" 
                placeholder="Nombre del cliente..." 
                value={cliente}
                onChange={(e) => setCliente(e.target.value)}
                required
              />
            </div>
            <div className="input-group">
              <label>Medio de Pago</label>
              <select value={medioDePago} onChange={(e) => setMedioDePago(e.target.value)}>
                <option value="EFECTIVO">Efectivo</option>
                <option value="TARJETA_DEBITO">Tarjeta de Débito</option>
                <option value="TARJETA_CREDITO">Tarjeta de Crédito</option>
                <option value="TRANSFERENCIA">Transferencia</option>
              </select>
            </div>
          </div>

          <div className="orden-items">
            {orden.length === 0 ? (
              <div className="empty-order">
                <p>No hay productos en el pedido</p>
              </div>
            ) : (
              orden.map((item) => (
                <div key={item.id} className="item-row">
                  <div className="item-info">
                    <span className="item-name">{item.nombre}</span>
                    <span className="item-price">${Number(item.precio).toLocaleString()} x {item.cantidad}</span>
                  </div>
                  <div className="item-controls">
                    <button onClick={(e) => { e.stopPropagation(); quitarDelPedido(item.id); }}>-</button>
                    <span className="item-qty">{item.cantidad}</span>
                    <button onClick={(e) => { e.stopPropagation(); agregarAlPedido(item); }}>+</button>
                  </div>
                  <div className="item-subtotal">
                    ${Number(item.precio * item.cantidad).toLocaleString()}
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="orden-footer">
            <div className="total-row">
              <span>Total a Pagar</span>
              <span className="total-amount">${Number(calcularTotal()).toLocaleString('es-AR', { minimumFractionDigits: 2 })}</span>
            </div>
            {mensaje.text && (
              <div className={`mensaje-alerta ${mensaje.type}`}>
                {mensaje.text}
              </div>
            )}
            <button 
              className="confirmar-btn" 
              disabled={orden.length === 0}
              onClick={handleConfirmarVenta}
            >
              Confirmar Pedido
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
