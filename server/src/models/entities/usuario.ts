import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";
import { RolUsuario } from "../enums/rol-usuario";
import { Auditable } from "../base/auditable";

@Entity({ name: "usuarios" })
export class Usuario extends Auditable {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ unique: true })
  cuil!: string;

  @Column()
  nombre!: string;

  @Column()
  apellido!: string;

  @Column({ unique: true })
  email!: string;

  @Column()
  password!: string;

  @Column({ type: "enum", enum: RolUsuario, default: RolUsuario.EMPLEADO })
  rol!: RolUsuario;

  static crear(
    cuil: string,
    nombre: string,
    apellido: string,
    email: string,
    password: string,
    rol: RolUsuario,
  ): Usuario {
    const usuario = new Usuario();

    usuario.cuil = cuil;
    usuario.nombre = nombre;
    usuario.apellido = apellido;
    usuario.email = email;
    usuario.password = password;
    usuario.rol = rol;

    return usuario;
  }
}
