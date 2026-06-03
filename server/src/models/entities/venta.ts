import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { ItemVenta } from "./item-venta";
import { MedioDePago } from "../enums/medio-de-pago";
import { Auditable } from "../base/auditable";
import { Producto } from "./producto";

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

  static crear(medioDePago: MedioDePago): Venta {
    const venta = new Venta();

    venta.medioDePago = medioDePago;
    venta.items = [];

    return venta;
  }

  agregarItem(producto: Producto, cantidad: number): void {
    producto.serVendido(cantidad);
    this.items.push(ItemVenta.create(producto, cantidad, this));
  }

  revertirItem(item: ItemVenta): void {
    const nota = `Reversión de venta #${this.id} - Item: ${item.nombre}`;
    item.producto.revertirVenta(item.cantidad, nota);
    this.items = this.items.filter((i) => i !== item);
  }
}
