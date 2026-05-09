import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm";
import { Venta } from "./Venta";
import type { TipoItemVenta } from "./TipoItemVenta";

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
}