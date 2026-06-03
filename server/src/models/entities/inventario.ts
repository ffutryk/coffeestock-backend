import { Entity, Column, OneToOne, JoinColumn, PrimaryColumn } from "typeorm";
import { Auditable } from "../base/auditable";
import { MateriaPrima } from "./materia-prima";

@Entity({ name: "inventario" })
export class Inventario extends Auditable {
  @PrimaryColumn()
  id!: number;

  @Column("decimal", { precision: 10, scale: 2, default: 0 }) // el decimal cubre el caso de 0.5 kg de cafe por ejemplo
  stockActual!: number;

  @Column("decimal", { precision: 10, scale: 2, default: 0 })
  stockMinimo!: number;

  @OneToOne(() => MateriaPrima, (mp) => mp.inventario)
  @JoinColumn({ name: "id" })
  materiaPrima!: MateriaPrima;

  consumir(cantidad: number): void {
    this.stockActual -= cantidad;
  }

  devolverStock(cantidad: number): void {
    this.stockActual += cantidad;
  }
}
