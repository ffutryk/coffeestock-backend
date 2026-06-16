import React, { useState, useEffect } from "react";
import api from "../services/api";
import "./OrderSidebar.css"; // We will create this CSS file next

export default function OrderSidebar({
  orden,
  setOrden,
  agregarAlPedido,
  quitarDelPedido,
  fetchProductos, // Needed to refresh stock after a sale
  fetchCombos, // Needed to refresh stock for combos after a sale
}) {
  const [cliente, setCliente] = useState("");
  const [medioDePago, setMedioDePago] = useState("EFECTIVO");
  const [mensaje, setMensaje] = useState({ text: "", type: "" });
  const [discountType, setDiscountType] = useState("PORCENTAJE");
  const [discountValue, setDiscountValue] = useState(0);
  const [discountError, setDiscountError] = useState("");

  const showMensaje = (text, type) => {
    setMensaje({ text, type });
    setTimeout(() => setMensaje({ text: "", type: "" }), 3000);
  };

  const calcularSubtotal = () => {
    return orden.reduce(
      (total, item) => total + item.precio * item.cantidad,
      0,
    );
  };

  const calcularDescuentoAplicado = (subtotal) => {
    if (!discountValue || discountValue <= 0) return 0;
    if (discountType === "PORCENTAJE") {
      return subtotal * (discountValue / 100);
    }
    return Math.min(discountValue, subtotal);
  };

  const calcularTotalNeto = () => {
    const subtotal = calcularSubtotal();
    return subtotal - calcularDescuentoAplicado(subtotal);
  };

  useEffect(() => {
    const subtotal = calcularSubtotal();
    if (discountValue < 0) {
      setDiscountError("Descuento inválido");
    } else if (discountType === "PORCENTAJE" && discountValue > 100) {
      setDiscountError("Descuento inválido");
    } else if (discountType === "FIJO" && discountValue > subtotal) {
      setDiscountError("Descuento inválido");
    } else {
      setDiscountError("");
    }
  }, [discountValue, discountType, orden]);

  const handleConfirmarVenta = async () => {
    if (!cliente.trim()) {
      showMensaje("El nombre del cliente es obligatorio", "error");
      return;
    }

    if (orden.length === 0) {
      showMensaje("El pedido está vacío", "error");
      return;
    }

    if (discountError) {
      showMensaje("Corrige el descuento antes de confirmar", "error");
      return;
    }

    try {
      const itemsVenta = [];
      orden.forEach((item) => {
        const esCombo = item.items !== undefined;
        if (esCombo) {
          item.items.forEach((comboItem) => {
            itemsVenta.push({
              productoId: comboItem.producto.id,
              cantidad: comboItem.cantidad * item.cantidad,
            });
          });
        } else {
          itemsVenta.push({
            productoId: item.id,
            cantidad: item.cantidad,
          });
        }
      });
      const payload = {
        cliente, // Include cliente in payload
        medioDePago,
        items: itemsVenta,
        descuentoTipo: discountType,
        descuentoValor: Number(discountValue),
      };

      await api.post("/ventas", payload);
      showMensaje("Venta realizada con éxito", "success");
      setOrden([]);
      setCliente("");
      setDiscountValue(0);
      setDiscountError("");
      fetchProductos(); // Refrescar stock
      fetchCombos(); // Refrescar stock de combos
    } catch (error) {
      console.error("Error al realizar venta:", error.response.data);
      showMensaje("Error al procesar la venta", "error");
    }
  };

  return (
    <div className="order-sidebar">
      <div className="orden-card">
        <div className="orden-header">
          <div className="header-title">
            <h3>Nuevo Pedido</h3>
            <p>Detalles y confirmación</p>
          </div>
          <i className="fa-solid fa-receipt pedido-icon"></i>
        </div>

        <div className="orden-inputs">
          <div className="input-group">
            <label>
              Cliente <span style={{ color: "var(--error-color)" }}>*</span>
            </label>
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
            <select
              value={medioDePago}
              onChange={(e) => setMedioDePago(e.target.value)}
            >
              <option value="EFECTIVO">Efectivo</option>
              <option value="TRANSFERENCIA">Transferencia</option>
              <option value="TARJETA_DEBITO">Tarjeta de Débito</option>
              <option value="TARJETA_CREDITO">Tarjeta de Crédito</option>
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
                  <span className="item-price">
                    ${Number(item.precio).toLocaleString()} x {item.cantidad}
                  </span>
                </div>
                <div className="item-controls">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      quitarDelPedido(item.id);
                    }}
                  >
                    -
                  </button>
                  <span className="item-qty">{item.cantidad}</span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      agregarAlPedido(item);
                    }}
                  >
                    +
                  </button>
                </div>
                <div className="item-subtotal">
                  ${Number(item.precio * item.cantidad).toLocaleString()}
                </div>
              </div>
            ))
          )}
        </div>

        <div className="descuento-section">
          <div className="descuento-header">
            <span className="descuento-title">
              {discountType === "PORCENTAJE"
                ? "Descuentos (Porcentual)"
                : "Descuentos (Manual)"}
            </span>
          </div>
          <div className="descuento-input-row">
            <div className="descuento-type-selector">
              <button
                className={`descuento-type-btn ${discountType === "PORCENTAJE" ? "active" : ""}`}
                onClick={() => {
                  setDiscountType("PORCENTAJE");
                  setDiscountValue(0);
                }}
              >
                %
              </button>
              <button
                className={`descuento-type-btn ${discountType === "FIJO" ? "active" : ""}`}
                onClick={() => {
                  setDiscountType("FIJO");
                  setDiscountValue(0);
                }}
              >
                $
              </button>
            </div>
            <div
              className={`descuento-input-wrapper ${discountError ? "has-error" : ""}`}
            >
              <span className="descuento-prefix">
                {discountType === "PORCENTAJE" ? "%" : "$"}
              </span>
              <input
                type="number"
                className="descuento-input"
                min="0"
                placeholder="0"
                value={discountValue}
                onChange={(e) =>
                  setDiscountValue(
                    e.target.value === "" ? "" : Number(e.target.value),
                  )
                }
              />
            </div>
          </div>
          {discountError && (
            <div className="descuento-error">{discountError}</div>
          )}
        </div>

        <div className="orden-footer">
          <div className="total-row">
            <span>Subtotal</span>
            <span className="subtotal-amount">
              $
              {Number(calcularSubtotal()).toLocaleString("es-AR", {
                minimumFractionDigits: 2,
              })}
            </span>
          </div>
          {Number(calcularDescuentoAplicado(calcularSubtotal())) > 0 && (
            <div className="total-row descuento-row">
              <span>Descuento</span>
              <span className="descuento-amount">
                -$
                {Number(
                  calcularDescuentoAplicado(calcularSubtotal()),
                ).toLocaleString("es-AR", { minimumFractionDigits: 2 })}
              </span>
            </div>
          )}
          <div className="total-row total-final-row">
            <span>Total a Pagar</span>
            <span className="total-amount">
              $
              {Number(calcularTotalNeto()).toLocaleString("es-AR", {
                minimumFractionDigits: 2,
              })}
            </span>
          </div>
          {mensaje.text && (
            <div className={`mensaje-alerta ${mensaje.type}`}>
              {mensaje.text}
            </div>
          )}
          <div>
            <button
              className="confirmar-btn"
              disabled={orden.length === 0 || !!discountError}
              onClick={handleConfirmarVenta}
            >
              Confirmar Venta
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
