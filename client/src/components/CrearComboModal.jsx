import { useState } from "react";
import api from "../services/api";
import "./CrearComboModal.css";

export default function CrearComboModal({
  productos,
  onClose,
  onSuccess,
}) {
  const [nombre, setNombre] = useState("");
  const [precio, setPrecio] = useState("");
  const [items, setItems] = useState([
    {
      productoId: "",
      cantidad: 1,
    },
  ]);

  const agregarFila = () => {
    setItems([
      ...items,
      {
        productoId: "",
        cantidad: 1,
      },
    ]);
  };

  const eliminarFila = (index) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const cambiarProducto = (index, productoId) => {
    const nuevosItems = [...items];

    nuevosItems[index].productoId = Number(productoId);

    setItems(nuevosItems);
  };

  const cambiarCantidad = (index, delta) => {
    const nuevosItems = [...items];

    nuevosItems[index].cantidad = Math.max(
      1,
      nuevosItems[index].cantidad + delta
    );

    setItems(nuevosItems);
  };

  const crearCombo = async () => {
    try {
      await api.post("/combos", {
        nombre,
        precio: Number(precio),
        items,
      });

      onSuccess();
      onClose();
    } catch (error) {
      console.error(error);
      alert(
        error?.response?.data?.message ??
          "Error al crear el combo"
      );
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-combo">
        <div className="modal-header">
          <h2>Crear Combo</h2>

          <button
            className="close-btn"
            onClick={onClose}
          >
            ✕
          </button>
        </div>

        <div className="modal-body">
          <label>Nombre del combo</label>

          <input
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            placeholder="Ej: Desayuno Completo"
          />

          <div className="productos-header">
            <label>Productos del combo</label>

            <button
              className="agregar-producto-btn"
              onClick={agregarFila}
            >
              + Agregar producto
            </button>
          </div>

          {items.map((item, index) => (
            <div
              key={index}
              className="combo-item-row"
            >
              <select
                value={item.productoId}
                onChange={(e) =>
                  cambiarProducto(
                    index,
                    e.target.value
                  )
                }
              >
                <option value="">
                  Seleccionar...
                </option>

                {productos.map((producto) => (
                  <option
                    key={producto.id}
                    value={producto.id}
                  >
                    {producto.nombre} (${Number(producto.precio).toLocaleString("es-AR")})
                  </option>
                ))}
              </select>

              <div className="cantidad-control">
                <button
                  onClick={() =>
                    cambiarCantidad(index, -1)
                  }
                >
                  -
                </button>

                <span>{item.cantidad}</span>

                <button
                  onClick={() =>
                    cambiarCantidad(index, 1)
                  }
                >
                  +
                </button>
              </div>

              <button
                className="delete-btn"
                onClick={() =>
                  eliminarFila(index)
                }
              >
                🗑
              </button>
            </div>
          ))}

          <label>Precio del combo</label>

          <input
            type="number"
            value={precio}
            onChange={(e) =>
              setPrecio(e.target.value)
            }
            placeholder="$ 0.00"
          />
        </div>

        <div className="modal-footer">
          <button
            className="crear-btn"
            onClick={crearCombo}
          >
            Crear Combo
          </button>

          <button
            className="cancelar-btn"
            onClick={onClose}
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
}