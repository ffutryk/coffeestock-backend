import { Usuario } from "../models/entities/usuario";
import type { UsuarioRepository } from "../repositories/interfaces/usuario.interface";
import type { CrearUsuarioDTO } from "../dtos/usuario/crear.dto";
import { ConflictError } from "../errors";
import { RolUsuario } from "../models/enums/rolUsuario";

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
}