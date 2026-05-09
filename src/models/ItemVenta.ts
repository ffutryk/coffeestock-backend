import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm";
import type { Venta } from "./Venta.js";
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

    @ManyToOne("Venta", (venta: any) => venta.items)
    @JoinColumn({ name: "venta_id" })
    venta!: Venta;
}