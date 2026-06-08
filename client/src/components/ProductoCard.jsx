import "./ProductoCard.css";

export default function ProductoCard({
  producto,
  onAgregar,
  onEditar,
  onEliminar,
}) {
  const isCombo = producto.items !== undefined;
  const isSinStock = producto.stock <= 0;

  return (
    <div
      className={`producto-card ${isSinStock ? "sin-stock" : ""}`}
      onClick={() => !isSinStock && onAgregar(producto)}
    >
      <div className="producto-actions">
        <button
          className="producto-action-btn editar"
          onClick={(e) => {
            e.stopPropagation();
            onEditar(producto);
          }}
        >
          ✏️
        </button>

        <button
          className="producto-action-btn eliminar"
          onClick={(e) => {
            e.stopPropagation();
            onEliminar(producto);
          }}
        >
          🗑️
        </button>
      </div>
      <div className="producto-icon">
        {producto.tipo === "COMBO" ? "🎁" : "☕"}
      </div>
      {isSinStock && <div className="badge-sin-stock">Sin Stock</div>}
      <div className="producto-info">
        <h3>{producto.nombre}</h3>
        <p className="producto-precio">
          $
          {Number(producto.precio).toLocaleString("es-AR", {
            minimumFractionDigits: 2,
          })}
        </p>
        <div className="producto-footer">
          <span className="stock-tag">Stock: {producto.stock}</span>
          {producto.sinTacc && <span className="sintacc-tag">Sin TACC</span>}
        </div>
      </div>
      <div className="card-overlay">
        <span>+ Agregar</span>
      </div>
    </div>
  );
}
