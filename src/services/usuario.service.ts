import type { IUsuarioRepository } from "../repositories/interfaces/usuario.interface";
import type { Usuario } from "../models/entities/usuario";
import type { PaginacionDTO } from "../dtos/paginacion.dto";
import type { ResultadoPaginado } from "../models/types/resultado-paginado";

export type UsuarioSinPassword = Omit<Usuario, "password">;

export class UsuarioService {
  constructor(private readonly usuarioRepo: IUsuarioRepository) {}

  async listarUsuarios(paginacion: PaginacionDTO): Promise<ResultadoPaginado<UsuarioSinPassword>> {
    const resultado = await this.usuarioRepo.findAllPaginated(paginacion);
    
    const dataSinPassword = resultado.data.map((usuario) => {
      const { password, ...usuarioSinPassword } = usuario;
      return usuarioSinPassword as UsuarioSinPassword;
    });

    return {
      data: dataSinPassword,
      total: resultado.total,
    };
  }
}
