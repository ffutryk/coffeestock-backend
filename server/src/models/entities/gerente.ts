import { ChildEntity } from "typeorm";
import { Usuario } from "./usuario";
import { RolUsuario } from "../enums/rol-usuario";

@ChildEntity(RolUsuario.GERENTE)
export class Gerente extends Usuario {
  constructor() {
    super();
    this.rol = RolUsuario.GERENTE;
  }
}
