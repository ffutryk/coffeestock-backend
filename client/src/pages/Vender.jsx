import { useState, useEffect } from "react";
import api from "../services/api";
import { eliminarCombo } from "../services/combos";
import ProductoCard from "../components/ProductoCard";
import "./Vender.css";
import CrearComboModal from "../components/CrearComboModal";
import ModalEliminarItem from "../components/modals/ModalEliminarItem";
import { useNavigate } from "react-router-dom";

export default function Vender() {
  const [productos, setProductos] = useState([]);
  const [orden, setOrden] = useState([]);
  const [cliente, setCliente] = useState("");
  const [medioDePago, setMedioDePago] = useState("EFECTIVO");
  const [loading, setLoading] = useState(true);
  const [mensaje, setMensaje] = useState({ text: "", type: "" });
  const [discountType, setDiscountType] = useState("PORCENTAJE");
  const [discountValue, setDiscountValue] = useState(0);
  const [discountError, setDiscountError] = useState("");
  const [combos, setCombos] = useState([]);
  const [filtro, setFiltro] = useState("TODOS");
  const [mostrarModalCombo, setMostrarModalCombo] = useState(false);
  const [itemAEliminar, setItemAEliminar] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchProductos();
    fetchCombos();
  }, []);

  const handleEliminarItem = async () => {
    if (!itemAEliminar) return;
    try {
      if (itemAEliminar.tipo === "COMBO") {
        await eliminarCombo(itemAEliminar.id);
        fetchCombos();
      } else {
        await api.delete(`/productos/${itemAEliminar.id}`);
        fetchProductos();
      }
      showMensaje("Eliminado con éxito", "success"); // ✅ solo si no hubo error
    } catch (error) {
      console.error(error);
      showMensaje("Error al eliminar", "error"); // ✅ captura el fallo
    } finally {
      setItemAEliminar(null);
    }
  };

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

  const fetchCombos = async () => {
    try {
      const response = await api.get("/combos");
      setCombos(
        response.data.data.map((combo) => ({
          ...combo,
          tipo: "COMBO",
        })),
      );
    } catch (error) {
      console.error("Error fetching combos:", error);
      showMensaje("Error al cargar combos", "error");
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
          item.id === producto.id
            ? { ...item, cantidad: item.cantidad + 1 }
            : item,
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
        item.id === productoId
          ? { ...item, cantidad: item.cantidad - 1 }
          : item,
      );
    });
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
      const payload = {
        medioDePago,
        items: orden.map((item) => ({
          productoId: item.id,
          cantidad: item.cantidad,
        })),
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
    } catch (error) {
      console.error("Error al realizar venta:", error);
      showMensaje("Error al procesar la venta", "error");
    }
  };

  if (loading) return <div className="loading">Cargando productos...</div>;

  const itemsMostrados =
    filtro === "PRODUCTOS"
      ? productos
      : filtro === "COMBOS"
        ? combos
        : [...productos, ...combos];

  return (
    <>
      <div className="vender-container">
        <div className="catalogo-section">
          <div className="section-header">
            <h2>Catálogo de Productos</h2>
            <span className="productos-count">
              {itemsMostrados.length} items disponibles
            </span>
            <div className="filtros">
              <button
                className={
                  filtro === "TODOS" ? "filtro-btn activo" : "filtro-btn"
                }
                onClick={() => setFiltro("TODOS")}
              >
                Todos
              </button>
              <button
                className={
                  filtro === "PRODUCTOS" ? "filtro-btn activo" : "filtro-btn"
                }
                onClick={() => setFiltro("PRODUCTOS")}
              >
                Productos
              </button>
              <button
                className={
                  filtro === "COMBOS" ? "filtro-btn activo" : "filtro-btn"
                }
                onClick={() => setFiltro("COMBOS")}
              >
                Combos
              </button>
            </div>
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
                + Crear Combo
              </button>
              <button
                className="crear-combo-btn"
                onClick={() => setMostrarModalCombo(true)}
              ></button>
            </div>
          </div>

          <div className="productos-grid">
            {itemsMostrados.map((item) => (
              <ProductoCard
                key={item.id}
                producto={item}
                onAgregar={agregarAlPedido}
                onEditar={
                  item.tipo === "COMBO"
                    ? () => {
                        navigate(`/combos/editar/${item.id}`);
                      }
                    : () => navigate(`/productos/editar/${item.id}`)
                }
                onEliminar={() => setItemAEliminar(item)}
              />
            ))}
          </div>
        </div>
        {itemAEliminar && (
          <ModalEliminarItem
            title="Eliminar Producto"
            message="¿Estás seguro de que quieres eliminar este producto?"
            onConfirm={handleEliminarItem}
            onCancel={() => setItemAEliminar(null)}
          />
        )}
        {mostrarModalCombo && (
          <CrearComboModal
            productos={productos}
            onClose={() => setMostrarModalCombo(false)}
            onSuccess={() => {
              fetchCombos();
              setMostrarModalCombo(false);
            }}
          />
        )}
      </div>
    </>
  );
}
