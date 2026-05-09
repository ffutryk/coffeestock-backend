import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm";
import { Venta } from "./Venta";
import type { TipoItemVenta } from "./TipoItemVenta";
import { Producto } from "./Producto";

@Entity("item_venta")
export class ItemVenta {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    nombre!: string;

    @Column()
    cantidad!: number;

    @Column("decimal", { precision: 10, scale: 2 })
    precio!: number;

    @Column()
    tipo!: TipoItemVenta;

    @ManyToOne(() => Venta, (venta) => venta.items)
    @JoinColumn({ name: "venta_id" })
    venta!: Venta;

    @ManyToOne(() => Producto, { nullable: true, onDelete: 'SET NULL' })
    @JoinColumn({ name: "producto_id" })
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