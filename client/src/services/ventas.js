import api from "./api";

export const getVentaPorId = async (id) => {
  const response = await api.get(`/ventas/${id}`);
  return response.data;
};

export const actualizarVenta = async (id, data) => {
  const response = await api.put(`/ventas/${id}`, data);
  return response.data;
};

export const eliminarVenta = async (id) => {
  const response = await api.delete(`/ventas/${id}`);
  return response.data;
};
