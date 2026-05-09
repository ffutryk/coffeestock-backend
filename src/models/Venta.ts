import { Column, CreateDateColumn, DeleteDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity("ventas")
export class Venta {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ name: "medio_de_pago" })
    medioDePago!: string;

    @ManyToOne(() => ItemVenta, (item) => item.venta)
    productos!: ItemVenta[];

    @CreateDateColumn({ name: "created_at" })
    createdAt!: Date;

    @Column({ name: "created_by" })
    createdBy!: number;

    @UpdateDateColumn({ name: "updated_at" })
    updatedAt?: Date;

    @Column({ name: "updated_by" })
    updatedBy?: number;

    @DeleteDateColumn({ name: "deleted_at" })
    deletedAt?: Date;

    @Column({ name: "deleted_by" })
    deletedBy?: number;
}