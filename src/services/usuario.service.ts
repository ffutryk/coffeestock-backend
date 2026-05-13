import type { IUsuarioRepository } from "../repositories/interfaces/usuario.interface";
import type { Usuario } from "../models/entities/usuario";

export type UsuarioSinPassword = Omit<Usuario, "password">;

export class UsuarioService {
  constructor(private readonly usuarioRepo: IUsuarioRepository) {}

  async listarUsuarios(): Promise<UsuarioSinPassword[]> {
    const usuarios = await this.usuarioRepo.findAll();
    
    return usuarios.map((usuario) => {
      const { password, ...usuarioSinPassword } = usuario;
      return usuarioSinPassword as UsuarioSinPassword;
    });
  }
}
