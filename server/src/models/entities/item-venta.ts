import { Entity, Column, ManyToOne, JoinColumn, PrimaryColumn } from "typeorm";
import { Venta } from "./venta";
import type { TipoItemVenta } from "../enums/tipo-item-venta";
import { Producto } from "./producto";

@Entity("item_venta")
export class ItemVenta {
  @PrimaryColumn()
  productoId!: number;

  @PrimaryColumn()
  ventaId!: number;

  @Column()
  nombre!: string;

  @Column()
  cantidad!: number;

  @Column("decimal", { precision: 10, scale: 2 })
  precio!: number;

  @Column()
  tipo!: TipoItemVenta;

  @ManyToOne(() => Venta, (venta) => venta.items)
  @JoinColumn({ name: "ventaId" })
  venta!: Venta;

  @ManyToOne(() => Producto, { nullable: true, cascade: true })
  @JoinColumn({ name: "productoId" })
  producto!: Producto;

  static create(producto: Producto, cantidad: number, venta: Venta): ItemVenta {
    const item = new ItemVenta();
    item.nombre = producto.nombre;
    item.precio = producto.precio;
    item.tipo = producto.tipo;
    item.cantidad = cantidad;
    item.producto = producto;
    item.venta = venta;
    return item;
  }
}
