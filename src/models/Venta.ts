import { Column, CreateDateColumn, DeleteDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { ItemVenta } from "./ItemVenta";

@Entity("ventas")
export class Venta {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ name: "medio_de_pago" })
    medioDePago!: string;

    @OneToMany(() => ItemVenta, (item) => item.venta, { cascade: true })
    items!: ItemVenta[];

    @CreateDateColumn({ name: "created_at" })
    createdAt!: Date;

    @Column({ name: "created_by" })
    createdBy!: number;

    @UpdateDateColumn({ name: "updated_at", nullable: true })
    updatedAt?: Date;

    @Column({ name: "updated_by", nullable: true })
    updatedBy?: number;

    @DeleteDateColumn({ name: "deleted_at", nullable: true })
    deletedAt?: Date;

    @Column({ name: "deleted_by", nullable: true })
    deletedBy?: number;

    getPrecioTotal(): number {
        return this.items.reduce((total, item) => total + (item.precio * item.cantidad), 0);
    }
}