import { useState, useEffect } from "react";
import api from "../services/api";
import { eliminarCombo } from "../services/combos";
import ProductoCard from "../components/ProductoCard";
import "./Vender.css";
import CrearComboModal from "../components/CrearComboModal";
import ModalEliminarItem from "../components/modals/ModalEliminarItem";
import OrderSidebar from "../components/OrderSidebar"; // New import
import { useNavigate } from "react-router-dom";

export default function Vender() {
  const [productos, setProductos] = useState([]);
  const [orden, setOrden] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mensaje, setMensaje] = useState({ text: "", type: "" });
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
      showMensaje("Eliminado con éxito", "success");
    } catch (error) {
      console.error(error);
      showMensaje("Error al eliminar", "error");
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
        <OrderSidebar
          orden={orden}
          setOrden={setOrden}
          agregarAlPedido={agregarAlPedido}
          quitarDelPedido={quitarDelPedido}
          fetchProductos={fetchProductos}
          fetchCombos={fetchCombos}
        />

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
