import { Column, PrimaryGeneratedColumn, Entity, TableInheritance } from "typeorm";
import { RolUsuario } from "../enums/rol-usuario";

@Entity("usuarios")
@TableInheritance({ column: { type: "varchar", name: "rol" } })
export abstract class Usuario {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  cuil!: number;
  
  @Column()
  nombre!: string;

  @Column()
  apellido!: string;

  @Column()
  email!: string;

  @Column()
  password!: string;

  @Column({
    type: "enum",
    enum: RolUsuario,
  })
  rol!: RolUsuario; 
}