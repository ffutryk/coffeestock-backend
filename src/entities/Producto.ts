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

  @Column("int", { nullable: true })
  stock!: number | null;

  @Column("decimal")
  precio!: number;

  @Column({ default: false })
  sinTacc!: boolean;

  @Column({ nullable: true })
  updatedBy?: string;

  @Column({ nullable: true })
  deletedBy?: string;

  @DeleteDateColumn()
  deleted_at?: Date;

  @UpdateDateColumn()
  updated_at?: Date;
}
