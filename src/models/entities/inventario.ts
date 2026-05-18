import {
  Entity,
  PrimaryColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from "typeorm";

@Entity({ name: "inventario" })
export class Inventario {
  // Clave primaria que referencia a la materia prima
  @PrimaryColumn("int")
  idMateriaPrima!: number;

  @Column("decimal", { precision: 10, scale: 2, default: 0 }) // el decimal cubre el caso de 0.5 kg de cafe por ejemplo
  stockActual!: number;

  @Column("decimal", { precision: 10, scale: 2, default: 0 })
  stockMinimo!: number;

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
