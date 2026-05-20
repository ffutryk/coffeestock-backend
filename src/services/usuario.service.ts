import { Usuario } from "../models/entities/usuario";
import type { UsuarioRepository } from "../repositories/interfaces/usuario.interface";
import type { CrearUsuarioDTO } from "../dtos/usuario/crear.dto";
import { ConflictError, NotFoundError, BadRequestError } from "../errors";
import { RolUsuario } from "../models/enums/rol-usuario";
import { IngresarUsuarioDTO } from "../dtos/usuario/ingresar.dto";
import { hashSHA256 } from "./utils/utils";
import type { ActualizarUsuarioDTO } from "../dtos/usuario/actualizar.dto";
import type { PaginacionDTO } from "../dtos/paginacion.dto";
import type { ResultadoPaginado } from "../models/types/resultado-paginado";
import type { IUsuarioService } from "./interfaces/usuario.service";

export type UsuarioSinPassword = Omit<Usuario, "password">;

export class UsuarioService implements IUsuarioService {
  constructor(private readonly usuarioRepository: UsuarioRepository) {}
  async crearUsuario(datos: CrearUsuarioDTO, createdBy?: number): Promise<Usuario> {
    const usuarioExistente = await this.usuarioRepository.findByCuil(datos.cuil);
    if (usuarioExistente) {
      throw new ConflictError("El empleado ya está registrado");
    }
    const emailExistente = await this.usuarioRepository.findByEmail(datos.email);
    if (emailExistente) {
      throw new ConflictError("El email ya está en uso");
    }
    const usuario = new Usuario();
    datos.password = hashSHA256(datos.password); // Para guardar la contraseña hasheada...
    Object.assign(usuario, datos);
    usuario.rol = RolUsuario.EMPLEADO;
    
    if (createdBy) {
      usuario.createdBy = createdBy;
    }
    
    return await this.usuarioRepository.save(usuario);
  }

  async recuperarPorEmail(email: string): Promise<Usuario> {
    const recuperado = await this.usuarioRepository.findByEmail(email);
    if (recuperado == null) throw new NotFoundError("No se pudo encontrar al usuario");
    return recuperado;
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

  async actualizarUsuario(id: number, datos: ActualizarUsuarioDTO): Promise<Usuario> {
    const usuario = await this.usuarioRepository.findById(id);
    if (!usuario) {
      throw new NotFoundError("No se pudo encontrar el usuario");
    }
    if (datos.email) {
      const existente = await this.usuarioRepository.findByEmail(datos.email);
      if (existente && existente.id !== id) {
        throw new ConflictError("El email ya está en uso");
      }
    }
    if (datos.cuil) {
      const existente = await this.usuarioRepository.findByCuil(datos.cuil);
      if (existente && existente.id !== id) {
        throw new ConflictError("El empleado ya está registrado");
      }
    }
    Object.assign(usuario, datos);
    return await this.usuarioRepository.save(usuario);
  }

  async eliminarUsuario(id: number, deletedBy: number): Promise<void> {
    const usuario = await this.usuarioRepository.findById(id);
    
    if (!usuario) {
      throw new NotFoundError("Usuario no encontrado");
    }

    usuario.deletedBy = deletedBy;
    await this.usuarioRepository.save(usuario);

    const deleted = await this.usuarioRepository.delete(id);
    if (!deleted) {
      throw new BadRequestError("Error al eliminar el usuario");
    }
  }

  async restaurarUsuario(id: number): Promise<void> {
    const usuario = await this.usuarioRepository.findByIdWithDeleted(id);
    
    if (!usuario) {
      throw new NotFoundError("Usuario no encontrado");
    }

    if (!usuario.deletedAt) {
      throw new BadRequestError("El usuario no está eliminado");
    }

    const restored = await this.usuarioRepository.restore(id);
    if (!restored) {
      throw new BadRequestError("Error al restaurar el usuario");
    }

    const usuarioRestaurado = await this.usuarioRepository.findById(id);
    if (usuarioRestaurado) {
      usuarioRestaurado.deletedBy = null;
      await this.usuarioRepository.save(usuarioRestaurado);
    }
  }
}
