import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";
import { UnidadDeMedida } from "../enums/unidad-de-medida";

@Entity()
export class MateriaPrima {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ nullable: false })
  nombre!: string;

  @Column({ nullable: false })
  marca!: string;

  @Column("int", { default: 0 })
  stock!: number;

  @Column({ type: "enum", enum: UnidadDeMedida })
  unidad!: UnidadDeMedida;

  @Column("int")
  cantidad_unidad!: number;
}
