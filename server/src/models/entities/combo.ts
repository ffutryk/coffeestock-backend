import {Entity, PrimaryGeneratedColumn, Column, OneToMany} from "typeorm";
import { Auditable } from "../base/auditable";
import { ComboItem } from "./combo-item";

@Entity({ name: "combos" })
export class Combo extends Auditable {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    nombre!: string;

    @Column("decimal")
    precio!: number;

    @OneToMany(() => ComboItem, (item) => item.combo, {cascade: true, eager: true})
    items!: ComboItem[];

    static crear(nombre: string, precio: number): Combo {
        const combo = new Combo();
        combo.nombre = nombre;
        combo.precio = precio;
        combo.items = [];
        return combo;
    }

    calcularStock(): number {
        if (this.items.length === 0) {
            return 0;
        }

        return Math.min(
            ...this.items.map((item) =>
                Math.floor(item.producto.stock / item.cantidad)
            )
        );
    }
}