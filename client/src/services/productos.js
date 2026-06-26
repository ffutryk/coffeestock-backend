import api from "./api";

export async function getProductos(params = { page: 1, limit: 10 }) {
    const res = await api.get("/productos", { params });
    return res.data;
}

export async function createProducto(data) {
    const res = await api.post("/productos", data);
    return res.data;
}

export async function updateProducto(id, data) {
    const res = await api.put(`/productos/${id}`, data);
    return res.data;
}

export async function deleteProducto(id) {
    const res = await api.delete(`/productos/${id}`);
    return res.data;
}
