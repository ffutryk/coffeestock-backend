import { Usuario } from "../../models/entities/usuario";
import { CrearUsuarioDTO } from "../../dtos/usuario/crear.dto";
import { ActualizarUsuarioDTO } from "../../dtos/usuario/actualizar.dto";
import { ResultadoPaginado } from "../../models/types/resultado-paginado";
import { UsuarioSinPassword } from "../usuario.service";
import { PaginacionDTO } from "../../dtos/paginacion.dto";

export interface IUsuarioService {
  crearUsuario(userToCreate: CrearUsuarioDTO): Promise<Usuario>;
  recuperarPorEmail(email: string): Promise<Usuario>;
  actualizarUsuario(id: number, datos: ActualizarUsuarioDTO): Promise<Usuario>;
  listarUsuarios(paginacion: PaginacionDTO): Promise<ResultadoPaginado<UsuarioSinPassword>>;
  eliminarUsuario(id: number): Promise<void>;
  restaurarUsuario(id: number): Promise<void>;
}
