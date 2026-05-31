import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { Auditable } from "../base/auditable";
import { MateriaPrima } from "./materia-prima";
import { MotivoMovimiento } from "../enums/motivo-movimiento";

@Entity({ name: "movimientos_inventario" })
export class MovimientoInventario extends Auditable {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => MateriaPrima, { nullable: false, onDelete: "CASCADE" })
  materiaPrima!: MateriaPrima;

  @Column("decimal", { precision: 10, scale: 2 })
  cantidad!: number; // (+ para ingresos, - para egresos)

  @Column({ type: "enum", enum: MotivoMovimiento })
  motivo!: MotivoMovimiento;

  @Column("text", { nullable: true })
  nota!: string;

  static generarCompra(
    materiaPrima: MateriaPrima,
    cantidad: number,
    nota?: string,
  ): MovimientoInventario {
    return this.generar(MotivoMovimiento.COMPRA, materiaPrima, cantidad, nota);
  }

  static generarUso(
    materiaPrima: MateriaPrima,
    cantidad: number,
    nota?: string,
  ): MovimientoInventario {
    return this.generar(MotivoMovimiento.USO, materiaPrima, -cantidad, nota);
  }

  static generarVenta(
    materiaPrima: MateriaPrima,
    cantidad: number,
    nota?: string,
  ): MovimientoInventario {
    return this.generar(MotivoMovimiento.VENTA, materiaPrima, -cantidad, nota);
  }

  static generarCorreccion(
    materiaPrima: MateriaPrima,
    cantidad: number,
    nota?: string,
  ): MovimientoInventario {
    return this.generar(MotivoMovimiento.CORRECCION, materiaPrima, cantidad, nota);
  }

  static generarDescarte(
    materiaPrima: MateriaPrima,
    cantidad: number,
    nota?: string,
  ): MovimientoInventario {
    return this.generar(MotivoMovimiento.DESCARTE, materiaPrima, cantidad, nota);
  }

  private static generar(
    motivo: MotivoMovimiento,
    materiaPrima: MateriaPrima,
    cantidad: number,
    nota?: string,
  ): MovimientoInventario {
    const movimiento = new MovimientoInventario();

    movimiento.materiaPrima = materiaPrima;
    movimiento.cantidad = cantidad;
    movimiento.motivo = motivo;

    if (nota) movimiento.nota = nota;

    return movimiento;
  }
}
