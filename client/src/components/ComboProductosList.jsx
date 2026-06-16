import ComboProductoItem from "./ComboProductoItem";

export default function ComboProductosList({
  items,
  setItems,
  productosDisponibles,
}) {
  const agregarProducto = () => {
    setItems([
      ...items,
      {
        productoId: productosDisponibles[0].id,
        cantidad: 1,
      },
    ]);
  };

  const actualizarItem = (index, cambios) => {
    setItems(
      items.map((item, i) => (i === index ? { ...item, ...cambios } : item)),
    );
  };

  const eliminarItem = (index) => {
    setItems(items.filter((_, i) => i !== index));
  };

  return (
    <>
      <div className="ec-list-header">
        <h3>Productos</h3>

        <button onClick={agregarProducto}>+ Agregar</button>
      </div>

      {items.map((item, index) => (
        <ComboProductoItem
          key={index}
          item={item}
          productosDisponibles={productosDisponibles}
          onChange={(changes) => actualizarItem(index, changes)}
          onDelete={() => eliminarItem(index)}
        />
      ))}
    </>
  );
}
