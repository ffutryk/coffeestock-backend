import { Usuario } from "../models/entities/usuario";
import type { UsuarioRepository } from "../repositories/interfaces/usuario.interface";
import type { CrearUsuarioDTO } from "../dtos/usuario/crear.dto";
import { ConflictError } from "../errors";
import { RolUsuario } from "../models/enums/rolUsuario";
import type { PaginacionDTO } from "../dtos/paginacion.dto";
import type { ResultadoPaginado } from "../models/types/resultado-paginado";

export type UsuarioSinPassword = Omit<Usuario, "password">;

export class UsuarioService {
    constructor(private readonly usuarioRepository:UsuarioRepository) {}
    
    async crearUsuario(datos: CrearUsuarioDTO): Promise<Usuario> {
        const usuarioExistente = await this.usuarioRepository.findByCuil(datos.cuil);
        if (usuarioExistente) {
            throw new ConflictError("El empleado ya está registrado");
        }
        const emailExistente = await this.usuarioRepository.findByEmail(datos.email);
        if (emailExistente) {
            throw new ConflictError("El email ya está en uso");
        }
        const usuario = new Usuario();
        Object.assign(usuario, datos);
        usuario.rol = RolUsuario.EMPLEADO;
        return await this.usuarioRepository.save(usuario);
    }

    async listarUsuarios(paginacion: PaginacionDTO): Promise<ResultadoPaginado<UsuarioSinPassword>> {
      const resultado = await this.usuarioRepository.findAllPaginated(paginacion);
      
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