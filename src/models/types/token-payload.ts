import { RolUsuario } from "../enums/rol-usuario";

export interface TokenPayload {
  userId: number;
  role: RolUsuario;
  nombre: string;
}
