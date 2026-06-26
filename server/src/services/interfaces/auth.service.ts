import { IngresarUsuarioDTO } from "../../dtos/usuario/ingresar.dto";

export interface IAuthService {
  ingresarUsuario(usuarioAIngresar: IngresarUsuarioDTO): Promise<string>;
}
