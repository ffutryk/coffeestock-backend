import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { ItemVenta } from "./item-venta";
import { MedioDePago } from "../enums/medio-de-pago";
import { Auditable } from "../base/auditable";

@Entity("ventas")
export class Venta extends Auditable {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: "enum", enum: MedioDePago, name: "medio_de_pago" })
  medioDePago!: MedioDePago;

  @OneToMany(() => ItemVenta, (item) => item.venta, { cascade: true })
  items!: ItemVenta[];

  getPrecioTotal(): number {
    return this.items.reduce((total, item) => total + item.precio * item.cantidad, 0);
  }
}
