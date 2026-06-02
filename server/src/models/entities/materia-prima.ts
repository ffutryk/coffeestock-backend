import { Entity, PrimaryGeneratedColumn, Column, OneToOne, OneToMany } from "typeorm";
import { UnidadDeMedida } from "../enums/unidad-de-medida";
import { Auditable } from "../base/auditable";
import { Inventario } from "./inventario";
import { MovimientoInventario } from "./movimiento-inventario";
import { StockInsuficienteError } from "../../errors";

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

  private _movimientosPendientes: MovimientoInventario[] = [];
  movimientosPendientes() {
    const movimientos = this._movimientosPendientes;
    this._movimientosPendientes = [];
    return movimientos;
  }

  consumir(cantidad: number): void {
    if (this.inventario.stockActual < cantidad) {
      throw new StockInsuficienteError(`${this.nombre} marca ${this.marca}`);
    }

    this.inventario.consumir(cantidad);

    this._movimientosPendientes.push(MovimientoInventario.generarUso(this, cantidad));
  }

  devolver(cantidad: number, nota?: string): void {
    this.inventario.devolverStock(cantidad);

    this._movimientosPendientes.push(MovimientoInventario.generarCorreccion(this, cantidad, nota));
  }
}
