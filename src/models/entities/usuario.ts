import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  UpdateDateColumn,
  DeleteDateColumn,
} from "typeorm";

import { RolUsuario } from "../enums/rolUsuario";

@Entity({ name: "usuarios" })
export class Usuario {

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

  @Column({
    type: "enum",
    enum: RolUsuario,
    default: RolUsuario.EMPLEADO,
  })
  rol!: RolUsuario;

  @UpdateDateColumn()
  updatedAt?: Date;

  @DeleteDateColumn()
  deletedAt?: Date;
}