import { Entity, Column, PrimaryGeneratedColumn, OneToOne, JoinColumn } from "typeorm";
import { Auditable } from "../base/auditable";
import { MateriaPrima } from "./materia-prima";

@Entity({ name: "inventario" })
export class Inventario extends Auditable {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column("decimal", { precision: 10, scale: 2, default: 0 }) // el decimal cubre el caso de 0.5 kg de cafe por ejemplo
  stockActual!: number;

  @Column("decimal", { precision: 10, scale: 2, default: 0 })
  stockMinimo!: number;

  @OneToOne(() => MateriaPrima)
  @JoinColumn()
  materiaPrima!: MateriaPrima;
}
