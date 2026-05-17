import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from "typeorm";

@Entity({ name: "materias_primas" })
export class MateriaPrima {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column("varchar", { length: 100 })
  nombre!: string;

  @Column("text", { nullable: true })
  descripcion?: string;

  @Column("boolean", { default: false })
  esSinTacc!: boolean;

  @CreateDateColumn()
  createdAt!: Date;

  @Column("varchar", { nullable: true })
  createdBy?: number;

  @UpdateDateColumn()
  updatedAt!: Date;

  @Column("varchar", { nullable: true })
  updatedBy?: string;

  @DeleteDateColumn()
  deletedAt?: Date;

  @Column("varchar", { nullable: true })
  deletedBy?: string;
}
