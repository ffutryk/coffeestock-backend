import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";
import { TipoItemVenta } from "../enums/tipo-item-venta";
import { Auditable } from "../base/auditable";

@Entity({ name: "productos" })
export class Producto extends Auditable {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  nombre!: string;

  @Column({ nullable: true })
  descripcion?: string;

  @Column("int", { default: 0 })
  stock!: number;

  @Column("decimal")
  precio!: number;

  @Column({ type: "enum", enum: TipoItemVenta })
  tipo!: TipoItemVenta;

  @Column({ default: false })
  sinTacc!: boolean;
}
