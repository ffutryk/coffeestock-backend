import { Entity, Column, OneToOne, JoinColumn, PrimaryColumn } from "typeorm";
import { Auditable } from "../base/auditable";
import { MateriaPrima } from "./materia-prima";

@Entity({ name: "inventario" })
export class Inventario extends Auditable {
  @PrimaryColumn()
  id!: number;

  @Column("decimal", { precision: 10, scale: 2, default: 0 }) // el decimal cubre el caso de 0.5 kg de cafe por ejemplo
  stockActual!: number;

  @Column("decimal", { precision: 10, scale: 2, default: 0 })
  stockMinimo!: number;

  @OneToOne(() => MateriaPrima, (mp) => mp.inventario)
  @JoinColumn({ name: "id" })
  materiaPrima!: MateriaPrima;

<<<<<<< HEAD
  consumir(cantidad: number, materiaPrima: MateriaPrima): MovimientoInventario {
    if (Number(this.stockActual) < cantidad) {
      throw new StockInsuficienteError(`${materiaPrima.nombre} marca ${materiaPrima.marca}`);
    }

    this.stockActual = Number(this.stockActual) - cantidad;

    return MovimientoInventario.generarVenta(materiaPrima, cantidad);
  }

  devolverStock(cantidad: number, materiaPrima: MateriaPrima, nota?: string): MovimientoInventario {
    this.stockActual = Number(this.stockActual) + cantidad;
    return MovimientoInventario.generarCorreccion(materiaPrima, cantidad, nota);
=======
  consumir(cantidad: number): void {
    this.stockActual -= cantidad;
  }

  devolverStock(cantidad: number): void {
    this.stockActual += cantidad;
>>>>>>> 2d6b14b1eb78c51adfb63e739fdfbeeebbf4548c
  }
}
