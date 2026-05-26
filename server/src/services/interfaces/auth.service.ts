import { IngresarUsuarioDTO } from "../../dtos/usuario/ingresar.dto";
import { UsuarioRepository } from "../../repositories/interfaces/usuario.interface";

export interface IAuthService {
  ingresarUsuario(usuarioAIngresar: IngresarUsuarioDTO): Promise<string>;
}
