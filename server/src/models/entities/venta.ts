import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { ItemVenta } from "./item-venta";
import { MedioDePago } from "../enums/medio-de-pago";
import { DescuentoTipo } from "../enums/descuento-tipo";
import { Auditable } from "../base/auditable";
import { Producto } from "./producto";

@Entity("ventas")
export class Venta extends Auditable {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: "enum", enum: MedioDePago, name: "medio_de_pago" })
  medioDePago!: MedioDePago;

  @Column({ type: "enum", enum: DescuentoTipo, name: "descuento_tipo", default: DescuentoTipo.PORCENTAJE })
  descuentoTipo!: DescuentoTipo;

  @Column({ type: "float", name: "descuento_valor", default: 0 })
  descuentoValor!: number;

  @OneToMany(() => ItemVenta, (item) => item.venta, { cascade: true })
  items!: ItemVenta[];

  getPrecioTotal(): number {
    const subtotal = this.items.reduce((total, item) => total + item.precio * item.cantidad, 0);
    if (!this.descuentoValor || this.descuentoValor <= 0) return subtotal;
    if (this.descuentoTipo === DescuentoTipo.PORCENTAJE) {
      const descuento = subtotal * (this.descuentoValor / 100);
      return subtotal - descuento;
    }
    const descuento = Math.min(this.descuentoValor, subtotal);
    return subtotal - descuento;
  }

  static crear(medioDePago: MedioDePago, descuentoTipo?: DescuentoTipo, descuentoValor?: number): Venta {
    const venta = new Venta();

    venta.medioDePago = medioDePago;
    venta.descuentoTipo = descuentoTipo ?? DescuentoTipo.PORCENTAJE;
    venta.descuentoValor = descuentoValor ?? 0;
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
