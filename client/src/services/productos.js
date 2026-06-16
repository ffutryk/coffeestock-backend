import api from "./api";

export const getTodosLosProductos = async () => {
  const response = await api.get("/productos");
  return response.data;
};
