import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  UpdateDateColumn,
  DeleteDateColumn,
} from "typeorm";
import { TipoItemVenta } from "./TipoItemVenta";

@Entity({ name: "productos" })
export class Producto {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  nombre!: string;

  @Column({ nullable: true })
  descripcion?: string;

  @Column("int", {default: 0 })
  stock!: number;

  @Column()
  precio!: number;

  @Column({type: "enum", enum: TipoItemVenta})
    tipo!: TipoItemVenta;

  @Column({ default: false })
  sinTacc!: boolean;

  @Column({ nullable: true })
  updatedBy?: number;

  @Column({ nullable: true })
  deletedBy?: number;

  @DeleteDateColumn()
  deleted_at?: Date;

  @UpdateDateColumn()
  updated_at?: Date;
}
