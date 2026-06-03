import api from "./api";

export async function getUsuarios(params = { page: 1, limit: 10 }) {
  const res = await api.get("/usuarios", { params });
  return res.data;
}

export async function updateUsuario(id, data) {
  const res = await api.put(`/usuarios/${id}`, data);
  return res.data;
}

export async function deleteUsuario(id) {
  const res = await api.delete(`/usuarios/${id}`);
  return res.data;
}

export async function restaurarUsuario(id) {
  const res = await api.post(`/usuarios/${id}/restaurar`);
  return res.data;
}
