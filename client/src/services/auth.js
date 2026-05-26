import api from "./api";

export async function login(credentials) {
  const res = await api.post("/usuarios/ingresar", credentials);
  return res.data;
}

export async function registerUsuario(data) {
  const res = await api.post("/usuarios/crear", data);
  return res.data;
}
