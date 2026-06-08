// components/ComboProductoRow.jsx
export default function ComboProductoRow({
  item,
  index,
  productosDisponibles,
  onChange,
  onRemove,
  disabled,
  error,
}) {
  const handleProductoChange = (e) => {
    const productoId = Number(e.target.value);
    const producto = productosDisponibles.find((p) => p.id === productoId);
    onChange(index, { productoId, nombre: producto?.nombre || "", cantidad: item.cantidad });
  };

  const handleCantidadChange = (delta) => {
    const nuevaCantidad = item.cantidad + delta;
    if (nuevaCantidad < 1) return;
    onChange(index, { ...item, cantidad: nuevaCantidad });
  };

  return (
    <div className={`combo-producto-row ${error ? "row-error" : ""}`}>
      <div className="row-producto">
        <label className="row-label">Producto</label>
        <select
          className="row-select"
          value={item.productoId || ""}
          onChange={handleProductoChange}
          disabled={disabled}
        >
          <option value="" disabled>
            Seleccionar producto...
          </option>
          {productosDisponibles.map((p) => (
            <option key={p.id} value={p.id}>
              {p.nombre} — ${Number(p.precio).toLocaleString("es-AR")}
            </option>
          ))}
        </select>
      </div>

      <div className="row-cantidad">
        <label className="row-label">Cantidad</label>
        <div className="cantidad-control">
          <button
            type="button"
            className="qty-btn"
            onClick={() => handleCantidadChange(-1)}
            disabled={disabled || item.cantidad <= 1}
          >
            −
          </button>
          <span className="qty-value">{item.cantidad}</span>
          <button
            type="button"
            className="qty-btn"
            onClick={() => handleCantidadChange(1)}
            disabled={disabled}
          >
            +
          </button>
        </div>
      </div>

      <button
        type="button"
        className="row-remove-btn"
        onClick={() => onRemove(index)}
        disabled={disabled}
        title="Eliminar producto"
      >
        🗑
      </button>

      {error && <p className="row-error-msg">{error}</p>}
    </div>
  );
}
