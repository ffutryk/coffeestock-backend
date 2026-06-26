import { useState } from "react";

export default function ProductosList({
  venta,
  editForm,
  productosDisponibles,
  validarItem,
  onUpdateForm,
  disabled,
}) {
  const [showAgregar, setShowAgregar] = useState(false);
  const [selectedId, setSelectedId] = useState("");

  const handleIncrementar = (productoId) => {
    const updated = editForm.items.map((item) => {
      if (item.productoId !== productoId) return item;
      const { maxAllowed } = validarItem(item);
      if (item.cantidad < maxAllowed)
        return { ...item, cantidad: item.cantidad + 1 };
      return item;
    });
    onUpdateForm({ items: updated });
  };

  const handleDecrementar = (productoId) => {
    const updated = editForm.items.map((item) =>
      item.productoId === productoId && item.cantidad > 1
        ? { ...item, cantidad: item.cantidad - 1 }
        : item,
    );
    onUpdateForm({ items: updated });
  };

  const handleRemover = (productoId) => {
    onUpdateForm({
      items: editForm.items.filter((i) => i.productoId !== productoId),
    });
  };

  const handleAgregar = () => {
    if (!selectedId) return;
    const id = Number(selectedId);
    const producto = productosDisponibles.find((p) => p.id === id);
    if (!producto) return;

    const existente = editForm.items.find((i) => i.productoId === id);
    let updated;
    if (existente) {
      updated = editForm.items.map((i) =>
        i.productoId === id ? { ...i, cantidad: i.cantidad + 1 } : i,
      );
    } else {
      updated = [
        ...editForm.items,
        {
          productoId: producto.id,
          nombre: producto.nombre,
          precio: Number(producto.precio),
          cantidad: 1,
        },
      ];
    }
    onUpdateForm({ items: updated });
    setShowAgregar(false);
    setSelectedId("");
  };

  return (
    <div className="ev-section">
      <div className="ev-productos-header">
        <label className="ev-label">
          <span className="ev-label-icon">🛒</span> Productos de la venta
        </label>
        <button
          className="ev-btn-agregar"
          onClick={() => setShowAgregar((v) => !v)}
          disabled={disabled}
        >
          ⊕ Agregar producto
        </button>
      </div>

      {showAgregar && (
        <div className="ev-agregar-row">
          <select
            className="ev-select"
            value={selectedId}
            onChange={(e) => setSelectedId(e.target.value)}
          >
            <option value="">Seleccionar producto...</option>
            {productosDisponibles.map((p) => (
              <option key={p.id} value={p.id}>
                {p.nombre} — ${Number(p.precio).toFixed(2)}
              </option>
            ))}
          </select>
          <button className="ev-btn-confirm-add" onClick={handleAgregar}>
            Agregar
          </button>
          <button
            className="ev-btn-cancel-add"
            onClick={() => setShowAgregar(false)}
          >
            Cancelar
          </button>
        </div>
      )}

      <div className="ev-items-list">
        {editForm.items.map((item) => {
          const { exceedsStock, message } = validarItem(item);
          const subtotal = Number(item.precio) * item.cantidad;
          return (
            <div
              key={item.productoId}
              className={`ev-item-card ${exceedsStock ? "ev-item-error" : ""}`}
            >
              <div className="ev-item-info">
                <span className="ev-item-nombre">{item.nombre}</span>
                <span className="ev-item-precio">
                  ${Number(item.precio).toFixed(2)} c/u
                </span>
                {exceedsStock && (
                  <span className="ev-stock-warn">{message}</span>
                )}
              </div>
              <div className="ev-qty-controls">
                <button
                  className="ev-btn-qty"
                  onClick={() => handleDecrementar(item.productoId)}
                  disabled={item.cantidad <= 1 || disabled}
                >
                  −
                </button>
                <span className="ev-qty-num">{item.cantidad}</span>
                <button
                  className="ev-btn-qty"
                  onClick={() => handleIncrementar(item.productoId)}
                  disabled={disabled}
                >
                  +
                </button>
              </div>
              <span className="ev-item-subtotal">${subtotal.toFixed(2)}</span>
              <button
                className="ev-btn-remove"
                onClick={() => handleRemover(item.productoId)}
                disabled={disabled}
              >
                🗑
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
