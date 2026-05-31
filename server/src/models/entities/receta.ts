import { Entity, Column, ManyToOne, JoinColumn, PrimaryColumn } from "typeorm";
import { Producto } from "./producto";
import { MateriaPrima } from "./materia-prima";
import { Auditable } from "../base/auditable";

@Entity({ name: "recetas" })
export class Receta extends Auditable {
  @PrimaryColumn()
  productoId!: number;

  @PrimaryColumn()
  materiaPrimaId!: number;

  @ManyToOne(() => Producto, (producto) => producto.recetas, {
    nullable: false,
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "productoId" })
  producto!: Producto;

  @ManyToOne(() => MateriaPrima, {
    nullable: false,
    eager: true,
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "materiaPrimaId" })
  materiaPrima!: MateriaPrima;

  @Column("decimal", { precision: 10, scale: 2 })
  cantidad!: number;

  static crear(producto: Producto, materiaPrima: MateriaPrima, cantidad: number): Receta {
    const receta = new Receta();

    receta.producto = producto;
    receta.materiaPrima = materiaPrima;
    receta.cantidad = cantidad;

    return receta;
  }
}
