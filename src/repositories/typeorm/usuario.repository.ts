import { Usuario } from "../../models/entities/usuario";
import { UsuarioRepository } from "../interfaces/usuario.interface";
import { TypeOrmBaseRepository } from "./base.repository";

export class TypeOrmUsuarioRepository extends TypeOrmBaseRepository<Usuario> implements UsuarioRepository {
    constructor() { super(Usuario);}
    async findByCuil(cuil: string): Promise<Usuario | null> {
        return await this.repository.findOneBy({ cuil });
    }
    async findByEmail(email: string): Promise<Usuario | null> {
        return await this.repository.findOneBy({ email });
    }
    async findById(id: number): Promise<Usuario | null> {
        return await this.repository.findOneBy({ id });
    }
}