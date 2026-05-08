import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  UpdateDateColumn,
  DeleteDateColumn,
} from "typeorm";

@Entity({ name: "productos" })
export class Producto {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  nombre!: string;

  @Column({ nullable: true })
  descripcion?: string;

  @Column("int", { default: 0 })
  stock!: number;

  @Column("decimal")
  precio!: number;

  // Soft delete
  @DeleteDateColumn()
  deleted_at?: Date;

  @UpdateDateColumn()
  updated_at?: Date;
}
