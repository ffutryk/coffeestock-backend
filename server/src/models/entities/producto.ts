import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";
import { TipoItemVenta } from "../enums/tipo-item-venta";
import { Auditable } from "../base/auditable";
import { Receta } from "./receta";
import { MovimientoInventario } from "./movimiento-inventario";
import { Inventario } from "./inventario";
import { ResultadoVenta } from "../types/resultado-venta";
import { StockInsuficienteError } from "../../errors";

@Entity({ name: "productos" })
export class Producto extends Auditable {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  nombre!: string;

  @Column({ nullable: true })
  descripcion?: string;

  @Column("int", { default: 0 })
  stock!: number;

  @Column("decimal")
  precio!: number;

  @Column({ type: "enum", enum: TipoItemVenta })
  tipo!: TipoItemVenta;

  @Column({ default: false })
  sinTacc!: boolean;

  @OneToMany(() => Receta, (receta) => receta.producto)
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

  insumosPara(cantidad: number): { id: number; cantidad: number }[] {
    return this.recetas.map((receta) => ({
      id: receta.materiaPrima.id,
      cantidad: receta.cantidad * cantidad,
    }));
  }

  serVendido(cantidad: number): ResultadoVenta {
    if (this.tieneReceta()) {
      return this.procesarConReceta(cantidad);
    }

    this.decrementarStock(cantidad);
    return { inventariosModificados: [], movimientosGenerados: [] };
  }

  private procesarConReceta(cantidad: number): ResultadoVenta {
    const materiasPrimas = new Map(this.recetas.map((r) => [r.materiaPrima.id, r.materiaPrima]));
    const inventarios: Inventario[] = [];
    const movimientos: MovimientoInventario[] = [];

    for (const insumo of this.insumosPara(cantidad)) {
      const materiaPrima = materiasPrimas.get(insumo.id)!;
      const inventario = materiaPrima.inventario;

      movimientos.push(inventario.consumir(insumo.cantidad, materiaPrima));
      inventarios.push(inventario);
    }

    return { inventariosModificados: inventarios, movimientosGenerados: movimientos };
  }
}
