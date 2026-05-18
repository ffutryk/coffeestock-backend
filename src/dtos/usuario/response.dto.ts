import { Usuario } from "../../models/entities/usuario";

export class UsuarioResponseDTO {
  id: number;
  cuil: string;
  nombre: string;
  apellido: string;
  email: string;
  rol: string;

  constructor(usuario: Usuario) {
    this.id = usuario.id;
    this.cuil = usuario.cuil;
    this.nombre = usuario.nombre;
    this.apellido = usuario.apellido;
    this.email = usuario.email;
    this.rol = usuario.rol;
  }
}