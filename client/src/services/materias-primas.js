import api from "./api";

export async function crearMateriaPrima(data) {
    const res = await api.post(`/materias-primas`, data);
    return res.data;
}
