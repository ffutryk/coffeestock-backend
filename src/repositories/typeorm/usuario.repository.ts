import { TypeOrmBaseRepository } from "./base.repository";
import { Usuario } from "../../models/entities/usuario";
import { IUsuarioRepository } from "../interfaces/usuario.interface";

export class TypeOrmUsuarioRepository extends TypeOrmBaseRepository<Usuario> implements IUsuarioRepository{
  constructor() {
    super(Usuario);
  }
}
