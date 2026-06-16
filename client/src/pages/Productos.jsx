import { useState, useEffect } from "react";
import { useProductos } from "../hooks/useProductos";
import { parseApiError } from "../utils/parseApiError";
import { getMateriasPrimas } from "../services/materias-primas";
import ProductoModal from "../components/modals/ProductoModal";
import "./Productos.css";

export default function Productos() {
    const {
        productos,
        total,
        page,
        limit,
        setPage,
        loading,
        error,
        createProducto,
        updateProducto,
        deleteProducto,
    } = useProductos();

    const [modalOpen, setModalOpen] = useState(false);
    const [selectedProducto, setSelectedProducto] = useState(null);
    const [materiasPrimas, setMateriasPrimas] = useState([]);

    useEffect(() => {
        const fetchMateriasPrimas = async () => {
            try {
                const data = await getMateriasPrimas();
                setMateriasPrimas(data);
            } catch (error) {
                console.error("Error al cargar materias primas:", error);
            }
        };
        fetchMateriasPrimas();
    }, []);

    const openCreateModal = () => {
        setSelectedProducto(null);
        setModalOpen(true);
    };

    const openEditModal = (producto) => {
        setSelectedProducto(producto);
        setModalOpen(true);
    };

    const handleCloseModal = () => {
        setModalOpen(false);
        setSelectedProducto(null);
    };

    const handleSave = async (payload, id) => {
        if (id) {
            await updateProducto(id, payload);
        } else {
            await createProducto(payload);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("¿Eliminar producto?")) return;
        try {
            await deleteProducto(id);
        } catch (err) {
            const parsed = parseApiError(err);
            alert(parsed.message);
        }
    };

    const totalPages = Math.ceil(total / limit);

    if (loading) return <div className="loading">Cargando productos...</div>;

    return (
        <div className="productos-container">
            <div className="productos-header">
                <div className="header-info">
                    <h2>Gestión de Productos</h2>
                    <p>{total} productos registrados</p>
                </div>
                <button onClick={openCreateModal} className="btn-nuevo">
                    Nuevo Producto
                </button>
            </div>

            {error && <div className="error-message">{error?.message}</div>}

            <div className="productos-list-section">
                {productos.length === 0 ? (
                    <div className="empty-state">
                        <p>No hay productos registrados.</p>
                    </div>
                ) : (
                    <>
                        <table className="productos-tabla">
                            <thead>
                                <tr>
                                    <th>Nombre</th>
                                    <th>Descripción</th>
                                    <th>Tipo</th>
                                    <th>Precio</th>
                                    <th>Stock</th>
                                    <th>Sin TACC</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {productos.map((producto) => (
                                    <tr key={producto.id}>
                                        <td>
                                            <strong>{producto.nombre}</strong>
                                        </td>
                                        <td>{producto.descripcion}</td>
                                        <td>{producto.tipo}</td>
                                        <td>
                                            $
                                            {Number(producto.precio).toFixed(2)}
                                        </td>
                                        <td>{producto.stock ?? "-"}</td>
                                        <td>
                                            {producto.sinTacc ? "Sí" : "No"}
                                        </td>
                                        <td className="acciones-cell">
                                            <button
                                                className="btn-accion edit"
                                                onClick={() =>
                                                    openEditModal(producto)
                                                }
                                            >
                                                <svg
                                                    width="18"
                                                    height="18"
                                                    viewBox="0 0 24 24"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    strokeWidth="2"
                                                >
                                                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                                                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                                                </svg>
                                            </button>
                                            <button
                                                className="btn-accion delete"
                                                onClick={() =>
                                                    handleDelete(producto.id)
                                                }
                                            >
                                                <svg
                                                    width="18"
                                                    height="18"
                                                    viewBox="0 0 24 24"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    strokeWidth="2"
                                                >
                                                    <polyline points="3 6 5 6 21 6"></polyline>
                                                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                                                    <line
                                                        x1="10"
                                                        y1="11"
                                                        x2="10"
                                                        y2="17"
                                                    ></line>
                                                    <line
                                                        x1="14"
                                                        y1="11"
                                                        x2="14"
                                                        y2="17"
                                                    ></line>
                                                </svg>
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <div className="historial-paginacion">
                            <button
                                disabled={page === 1}
                                onClick={() => setPage(page - 1)}
                            >
                                ← Anterior
                            </button>
                            <span>
                                Página {page} de {totalPages}
                            </span>
                            <button
                                disabled={page >= totalPages}
                                onClick={() => setPage(page + 1)}
                            >
                                Siguiente →
                            </button>
                        </div>
                    </>
                )}
            </div>

            <ProductoModal
                isOpen={modalOpen}
                onClose={handleCloseModal}
                producto={selectedProducto}
                onSave={handleSave}
                materiasPrimas={materiasPrimas}
            />
        </div>
    );
}
