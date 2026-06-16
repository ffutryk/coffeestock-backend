import { useState, useEffect } from "react";
import {
    getProductos,
    createProducto as createProductoApi,
    updateProducto as updateProductoApi,
    deleteProducto as deleteProductoApi,
} from "../services/productos";

export function useProductos() {
    const [productos, setProductos] = useState([]);
    const [total, setTotal] = useState(0);

    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    async function fetchProductos() {
        try {
            setLoading(true);
            setError(null);

            const response = await getProductos({
                page,
                limit,
            });

            setProductos(response.data);
            setTotal(response.total);
        } catch (err) {
            setError(err);
        } finally {
            setLoading(false);
        }
    }

    async function createProducto(producto) {
        const nuevo = await createProductoApi(producto);

        setProductos((prev) => [...prev, nuevo]);
        setTotal((prev) => prev + 1);

        return nuevo;
    }

    async function updateProducto(id, producto) {
        const actualizado = await updateProductoApi(id, producto);

        setProductos((prev) =>
            prev.map((p) => (p.id === id ? actualizado : p)),
        );

        return actualizado;
    }

    async function deleteProducto(id) {
        await deleteProductoApi(id);

        setProductos((prev) => prev.filter((p) => p.id !== id));

        setTotal((prev) => prev - 1);
    }

    useEffect(() => {
        fetchProductos();
    }, [page, limit]);

    return {
        productos,
        total,

        page,
        limit,
        setPage,
        setLimit,

        loading,
        error,

        fetchProductos,
        createProducto,
        updateProducto,
        deleteProducto,
    };
}
