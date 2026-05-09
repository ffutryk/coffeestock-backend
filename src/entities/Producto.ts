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

  @Column("varchar") // Especificamos que es un texto
  nombre!: string;

  @Column("text", { nullable: true }) // 'text' para descripciones largas
  descripcion?: string;

  @Column("int", { nullable: true })
  stock!: number | null;

  @Column("decimal")
  precio!: number;

  @Column("boolean", { default: false }) // Especificamos que es booleano
  sinTacc!: boolean;

  @Column("varchar", { nullable: true })
  updatedBy?: string;

  @Column("varchar", { nullable: true })
  deletedBy?: string;

  @DeleteDateColumn()
  deleted_at?: Date;

  @UpdateDateColumn()
  updated_at?: Date;
}
