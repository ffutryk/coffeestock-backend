import { Usuario } from "../../models/entities/usuario";
import { BaseRepository } from "./base.interface";

export interface UsuarioRepository extends BaseRepository<Usuario> {
    findByCuil(cuil: string): Promise<Usuario | null>;
    findByEmail(email: string): Promise<Usuario | null>;
    findById(id: number): Promise<Usuario | null>;
}