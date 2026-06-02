import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { TipoItemVenta } from "../enums/tipo-item-venta";
import { Auditable } from "../base/auditable";
import { Receta } from "./receta";
import {
  IngredientesDuplicadosError,
  RecetaFaltanteError,
  StockInsuficienteError,
} from "../../errors";
import { MateriaPrima } from "./materia-prima";

@Entity({ name: "productos" })
export class Producto extends Auditable {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  nombre!: string;

  @Column({ nullable: true })
  descripcion?: string;

  @Column("int", { nullable: true })
  stock!: number;

  @Column("decimal")
  precio!: number;

  @Column({ type: "enum", enum: TipoItemVenta })
  tipo!: TipoItemVenta;

  @Column({ default: false })
  sinTacc!: boolean;

  @OneToMany(() => Receta, (receta) => receta.producto, { cascade: true })
  recetas!: Receta[];

  decrementarStock(cantidad: number): void {
    if (!this.tieneReceta() && this.stock < cantidad) {
      throw new StockInsuficienteError(this.nombre);
    }

    this.stock -= cantidad;
  }

  tieneReceta(): boolean {
    return this.recetas?.length > 0;
  }

  serVendido(cantidad: number): void {
    if (!this.tieneReceta() && !this.stock) throw new RecetaFaltanteError(this.nombre);

    if (this.tieneReceta()) {
      for (const receta of this.recetas) {
        receta.materiaPrima.consumir(receta.cantidad * cantidad);
      }
    } else {
      this.decrementarStock(cantidad);
    }
  }

  revertirVenta(cantidad: number, nota?: string): void {
    if (this.tieneReceta()) {
      for (const receta of this.recetas) {
        receta.materiaPrima.devolver(receta.cantidad * cantidad, nota);
      }
    } else {
      this.stock += cantidad;
    }
  }

  construirReceta(ingredientes: { materiaPrima: MateriaPrima; cantidad: number }[]): Receta[] {
    const ids = ingredientes.map((i) => i.materiaPrima.id);

    if (new Set(ids).size !== ids.length) throw new IngredientesDuplicadosError();

    return ingredientes.map(({ materiaPrima, cantidad }) =>
      Receta.crear(this, materiaPrima, cantidad),
    );
  }
}
