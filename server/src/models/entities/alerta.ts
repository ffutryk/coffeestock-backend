import {
  PrimaryGeneratedColumn,
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";
import { GravedadAlerta } from "../enums/gravedad-alerta";

@Entity("alertas")
export class Alerta {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  mensaje!: string;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn({ name: "updated_at", nullable: true })
  updatedAt?: Date | null;

  @Column({ type: "boolean", default: false })
  seen!: boolean;

  @Column({ type: "enum", enum: GravedadAlerta })
  gravedad!: GravedadAlerta;

  @Column({
    type: "jsonb",
    nullable: true,
  })
  metadata?: Record<string, unknown>;

  static crear(mensaje: string, gravedad: GravedadAlerta): Alerta {
    const alerta = new Alerta();

    alerta.mensaje = mensaje;
    alerta.gravedad = gravedad;

    return alerta;
  }
}
