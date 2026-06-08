export default function ComboProductoItem({
  item,
  productosDisponibles,
  onChange,
  onDelete,
}) {
  return (
    <div className="combo-item-row">
      <select
        value={item.productoId}
        onChange={(e) =>
          onChange({
            productoId: Number(e.target.value),
          })
        }
      >
        {productosDisponibles.map((p) => (
          <option key={p.id} value={p.id}>
            {p.nombre}
          </option>
        ))}
      </select>

      <input
        type="number"
        min="1"
        value={item.cantidad}
        onChange={(e) =>
          onChange({
            cantidad: Number(e.target.value),
          })
        }
      />

      <button onClick={onDelete}>🗑</button>
    </div>
  );
}
