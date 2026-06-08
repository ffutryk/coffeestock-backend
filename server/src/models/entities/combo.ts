import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { Auditable } from "../base/auditable";
import { ComboItem } from "./combo-item";
import { Producto } from "./producto";

@Entity({ name: "combos" })
export class Combo extends Auditable {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  nombre!: string;

  @Column("decimal")
  precio!: number;

  @OneToMany(() => ComboItem, (item) => item.combo, { cascade: true, eager: true })
  items!: ComboItem[];

  static crear(nombre: string, precio: number): Combo {
    const combo = new Combo();
    combo.nombre = nombre;
    combo.precio = precio;
    combo.items = [];
    return combo;
  }

  calcularStock(): number {
    if (this.items.length === 0) {
      return 0;
    }

    return Math.min(...this.items.map((item) => Math.floor(item.producto.stock / item.cantidad)));
  }

  actualizarCantidadesSegun(
    productosActualizados: Producto[],
    itemsActualizados: {
      productoId: number;
      cantidad: number;
    }[],
  ) {
    itemsActualizados.forEach((itemActualizado) => {
      const itemExistente = this.items.find(
        (item) => item.productoId === itemActualizado.productoId,
      );

      if (itemExistente) {
        itemExistente.cantidad = itemActualizado.cantidad;
      } else {
        const producto = productosActualizados.find((p) => p.id === itemActualizado.productoId);

        if (producto) {
          this.items.push(ComboItem.crear(this, producto, itemActualizado.cantidad));
        }
      }
    });
    this.items = this.items.filter((item) =>
      itemsActualizados.some((i) => i.productoId === item.productoId),
    );
  }
}
