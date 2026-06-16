import api from "./api";

export const getComboPorId = async (id) => {
  const response = await api.get(`/combos/${id}`);
  return response.data;
};
export const actualizarCombo = async (id, data) => {
  const response = await api.put(`/combos/${id}`, data);
  return response.data;
};
