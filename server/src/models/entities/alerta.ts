import { PrimaryGeneratedColumn, Entity, Column, CreateDateColumn } from "typeorm";
import { GravedadAlerta } from "../enums/gravedad-alerta";

@Entity("alertas")
export class Alerta {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  mensaje!: string;

  @CreateDateColumn()
  createdAt!: Date;

  @Column({ type: "boolean", default: false })
  seen!: boolean;

  @Column({ type: "enum", enum: GravedadAlerta })
  gravedad!: GravedadAlerta;

  static crear(mensaje: string, gravedad: GravedadAlerta): Alerta {
    const alerta = new Alerta();

    alerta.mensaje = mensaje;
    alerta.gravedad = gravedad;

    return alerta;
  }
}
