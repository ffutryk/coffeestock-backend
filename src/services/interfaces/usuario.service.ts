import { Usuario } from "../../models/entities/usuario";
import { CrearUsuarioDTO } from "../../dtos/usuario/crear.dto";

export interface IUsuarioService {
  crearUsuario(userToCreate: CrearUsuarioDTO): Promise<Usuario>;
  recuperarPorEmail(email: string): Promise<Usuario>;
}
