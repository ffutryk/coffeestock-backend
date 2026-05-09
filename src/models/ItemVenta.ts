import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { Venta } from "./Venta.js";
import type { TipoItemVenta } from "./TipoItemVenta.js";

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

    @OneToMany(() => Venta, (venta) => venta.productos)
    venta!: Venta;
}