import { useMemo, useState } from "react";

import ComboProductosList from "./ComboProductosList";
import ComboStockPreview from "./ComboStockPreview";

export default function ComboForm({
  combo,
  productosDisponibles,
  onSave,
  onCancel,
  submitting,
  error,
}) {
  const [nombre, setNombre] = useState(combo.nombre);
  const [precio, setPrecio] = useState(combo.precio);

  const [items, setItems] = useState(
    combo.items.map((item) => ({
      productoId: item.producto.id,
      cantidad: item.cantidad,
    })),
  );

  const stockCalculado = useMemo(() => {
    if (items.length === 0) return 0;

    return Math.min(
      ...items.map((item) => {
        const producto = productosDisponibles.find(
          (p) => p.id === item.productoId,
        );

        if (!producto) return 0;

        return Math.floor(producto.stock / item.cantidad);
      }),
    );
  }, [items, productosDisponibles]);

  const puedeGuardar = nombre.trim() && precio > 0 && items.length >= 2;

  return (
    <>
      <div className="ec-form-group">
        <label>Nombre</label>

        <input value={nombre} onChange={(e) => setNombre(e.target.value)} />
      </div>

      <ComboProductosList
        items={items}
        setItems={setItems}
        productosDisponibles={productosDisponibles}
      />

      <div className="combo-stock-preview">
        <span>Combos disponibles:</span>
        <strong>{stockCalculado}</strong>
      </div>

      <div className="ec-form-group">
        <label>Precio</label>

        <input
          type="number"
          value={precio}
          onChange={(e) => setPrecio(Number(e.target.value))}
        />
      </div>

      {error && <p className="ec-error">{error}</p>}

      <div className="ec-actions">
        <button
          disabled={!puedeGuardar || submitting}
          onClick={() =>
            onSave({
              nombre,
              precio,
              items,
            })
          }
        >
          Guardar cambios
        </button>

        <button onClick={onCancel}>Cancelar</button>
      </div>
    </>
  );
}
