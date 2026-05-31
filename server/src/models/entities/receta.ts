import {Entity, Column, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import { Producto } from "./producto";
import { MateriaPrima } from "./materiaPrima";
import { Auditable } from "../base/auditable";

@Entity({ name: "recetas" })
export class Receta extends Auditable {

  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => Producto, {
    nullable: false,
    onDelete: "CASCADE"})
  producto!: Producto;

  @ManyToOne(() => MateriaPrima, {
    nullable: false,
    eager: true,
    onDelete: "CASCADE"})
  materiaPrima!: MateriaPrima;

  @Column("decimal", {
    precision: 10,
    scale: 2})
  cantidad!: number;
}