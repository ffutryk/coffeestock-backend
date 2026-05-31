import { Entity, PrimaryGeneratedColumn, Column, OneToOne, OneToMany } from "typeorm";
import { UnidadDeMedida } from "../enums/unidad-de-medida";
import { Auditable } from "../base/auditable";
import { Inventario } from "./inventario";
import { MovimientoInventario } from "./movimiento-inventario";

@Entity()
export class MateriaPrima extends Auditable {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ nullable: false })
  nombre!: string;

  @Column({ nullable: false })
  marca!: string;

  @Column({ type: "enum", enum: UnidadDeMedida })
  unidad!: UnidadDeMedida;

  @Column("int")
  cantidad_unidad!: number;

  @Column("boolean", { default: false })
  esSinTacc!: boolean;

  @OneToOne(() => Inventario, (inventario) => inventario.materiaPrima, { eager: true })
  inventario!: Inventario;

  @OneToMany(() => MovimientoInventario, (mov) => mov.materiaPrima)
  movimientos!: MovimientoInventario[];
}
