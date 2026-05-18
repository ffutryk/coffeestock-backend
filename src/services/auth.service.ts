import { string } from "zod";
import { IngresarUsuarioDTO } from "../dtos/usuario/ingresar.dto";
import { InvalidCredentialsError, NotFoundError } from "../errors";
import { Usuario } from "../models/entities/usuario";
import { UsuarioRepository } from "../repositories/interfaces/usuario.interface";
import { IAuthService } from "./interfaces/auth.service";
import { ITokenService } from "./interfaces/token.service";
import { hashSHA256 } from "./utils/utils";

class AuthService implements IAuthService {
  constructor(
    private readonly tokenService: ITokenService,
    private readonly userRepository: UsuarioRepository,
  ) {}
  async ingresarUsuario(usuarioAIngresar: IngresarUsuarioDTO): Promise<string> {
    const usuarioRecuperado = await this.userRepository.findByEmail(usuarioAIngresar.email);
    this.validarUsuarioYContraseña(usuarioRecuperado, usuarioAIngresar.password);
    const token = this.tokenService.generarToken({ userId: usuarioRecuperado!.id });
    return token;
  }

  private validarUsuarioYContraseña(usuarioAValidar: Usuario | null, passwordAValidar: string) {
    const passwordHasheada = hashSHA256(passwordAValidar);
    if (usuarioAValidar == null || usuarioAValidar.password != passwordHasheada)
      throw new InvalidCredentialsError("Usuario o contraseña incorrectos");
  }
}

export default AuthService;
