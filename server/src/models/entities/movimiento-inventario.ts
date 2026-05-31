import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { Auditable } from "../base/auditable";
import { MateriaPrima } from "./materia-prima";

@Entity({ name: "movimientos_inventario" })
export class MovimientoInventario extends Auditable {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => MateriaPrima, { nullable: false, onDelete: "CASCADE" })
  materiaPrima!: MateriaPrima;

  @Column("decimal", { precision: 10, scale: 2 })
  cantidad!: number; // (+ para ingresos, - para egresos)

  @Column("varchar", { length: 100 })
  motivo!: string; // ejemplo: 'Compra'

  @Column("text", { nullable: true })
  nota?: string;
}
