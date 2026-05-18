import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from "typeorm";

@Entity({ name: "movimientos_inventario" })
export class MovimientoInventario {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column("int")
  idMateriaPrima!: number;

  @Column("decimal", { precision: 10, scale: 2 })
  cantidad!: number; // (+ para ingresos, - para egresos)

  @Column("varchar", { length: 100 })
  motivo!: string; // ejemplo: 'Compra'

  @Column("text", { nullable: true })
  nota?: string;
  
  @CreateDateColumn()
  createdAt!: Date;

  @Column("varchar", { nullable: true })
  createdBy?: string;

  @UpdateDateColumn()
  updatedAt!: Date;

  @Column("varchar", { nullable: true })
  updatedBy?: string;

  @DeleteDateColumn()
  deletedAt?: Date;

  @Column("varchar", { nullable: true })
  deletedBy?: string;
}
