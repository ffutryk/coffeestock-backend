import { Entity, PrimaryGeneratedColumn, Column, OneToOne, OneToMany } from "typeorm";
import { UnidadDeMedida } from "../enums/unidad-de-medida";
import { Inventario } from "./inventario";
import { MovimientoInventario } from "./movimiento-inventario";
import { StockInsuficienteError } from "../../errors";
import { MovimientoInventarioEvent, StockBajoAlertaEvent } from "../events";
import { Auditable } from "../base/auditable";
import { eventBus } from "../events/event-bus";

@Entity()
export class MateriaPrima extends Auditable {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ nullable: false })
  nombre!: string;

  @Column({ nullable: false })
  marca!: string;

  @Column({ type: "enum", enum: UnidadDeMedida })
  unidad!: UnidadDeMedida;

  @Column("int")
  cantidad_unidad!: number;

  @Column("boolean", { default: false })
  esSinTacc!: boolean;

  @OneToOne(() => Inventario, (inventario) => inventario.materiaPrima, {
    eager: true,
    cascade: true,
  })
  inventario!: Inventario;

  @OneToMany(() => MovimientoInventario, (mov) => mov.materiaPrima)
  movimientos!: MovimientoInventario[];

  consumir(cantidad: number): void {
    if (this.inventario.stockActual < cantidad) {
      throw new StockInsuficienteError(`${this.nombre} marca ${this.marca}`);
    }

    this.inventario.consumir(cantidad);

    eventBus.publish(
      new MovimientoInventarioEvent({
        movimiento: MovimientoInventario.generarUso(this, cantidad),
      }),
    );

    if (this.inventario.stockActual < this.inventario.stockMinimo) {
      const event = new StockBajoAlertaEvent({ materiaPrima: this });

      eventBus.publish(event);
    }
  }

  devolver(cantidad: number, nota?: string): void {
    this.inventario.devolverStock(cantidad);

    eventBus.publish(
      new MovimientoInventarioEvent({
        movimiento: MovimientoInventario.generarCorreccion(this, cantidad, nota),
      }),
    );
  }

  static crear(
    nombre: string,
    marca: string,
    unidad: UnidadDeMedida,
    cantidadUnidad: number,
    esSinTacc?: boolean,
  ): MateriaPrima {
    const materiaPrima = new MateriaPrima();

    materiaPrima.nombre = nombre;
    materiaPrima.marca = marca;
    materiaPrima.unidad = unidad;
    materiaPrima.cantidad_unidad = cantidadUnidad;
    materiaPrima.esSinTacc = esSinTacc ?? false;

    materiaPrima.inventario = new Inventario();
    materiaPrima.inventario.materiaPrima = materiaPrima;

    return materiaPrima;
  }
}
