import { ChildEntity } from "typeorm";
import { Usuario } from "./usuario";
import { RolUsuario } from "../enums/rol-usuario";

@ChildEntity(RolUsuario.EMPLEADO)
export class Empleado extends Usuario {
  constructor() {
    super();
    this.rol = RolUsuario.EMPLEADO;
  }
}
