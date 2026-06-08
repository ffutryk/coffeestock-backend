import api from "./api";

export const getVentaPorId = async (id) => {
  const response = await api.get(`/ventas/${id}`);
  return response.data;
};
