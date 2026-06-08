// components/ComboStockPreview.jsx

/**
 * Calcula cuántos combos se pueden armar dado el stock disponible
 * de cada producto y la cantidad requerida por el combo.
 */
function calcularCombosDisponibles(items, productosDisponibles) {
  if (!items.length) return 0;

  const cantidades = items.map(({ productoId, cantidad }) => {
    const producto = productosDisponibles.find((p) => p.id === productoId);
    if (!producto || !cantidad || cantidad <= 0) return 0;
    const stock = producto.stock ?? 0;
    return Math.floor(stock / cantidad);
  });

  return Math.min(...cantidades);
}

export default function ComboStockPreview({ items, productosDisponibles }) {
  const itemsValidos = items.filter((i) => i.productoId && i.cantidad > 0);

  if (itemsValidos.length === 0) {
    return null;
  }

  const combosDisponibles = calcularCombosDisponibles(itemsValidos, productosDisponibles);

  const nivel =
    combosDisponibles === 0
      ? "critico"
      : combosDisponibles <= 3
        ? "bajo"
        : "ok";

  const nivelLabel = {
    critico: "Sin stock suficiente",
    bajo: "Stock bajo",
    ok: "Stock disponible",
  }[nivel];

  return (
    <div className={`stock-preview stock-preview--${nivel}`}>
      <div className="stock-preview__icon">
        {nivel === "critico" ? "⚠️" : nivel === "bajo" ? "🟡" : "✅"}
      </div>
      <div className="stock-preview__info">
        <span className="stock-preview__label">Combos armables con stock actual</span>
        <span className="stock-preview__valor">
          {combosDisponibles} combo{combosDisponibles !== 1 ? "s" : ""}
        </span>
      </div>
      <span className={`stock-preview__badge stock-preview__badge--${nivel}`}>
        {nivelLabel}
      </span>
    </div>
  );
}
