import { Entity, ManyToOne, JoinColumn, PrimaryColumn, Column } from "typeorm";
import { Combo } from "./combo";
import { Producto } from "./producto";

@Entity({ name: "combo_items" })
export class ComboItem {
  aumentarCantidad(cantidad: number) {
    throw new Error("Method not implemented.");
  }
  @PrimaryColumn()
  comboId!: number;

  @PrimaryColumn()
  productoId!: number;

  @ManyToOne(() => Combo, (combo) => combo.items)
  @JoinColumn({ name: "comboId" })
  combo!: Combo;

  @ManyToOne(() => Producto, { eager: true })
  @JoinColumn({ name: "productoId" })
  producto!: Producto;

  @Column()
  cantidad!: number;

  static crear(combo: Combo, producto: Producto, cantidad: number): ComboItem {
    const item = new ComboItem();
    item.combo = combo;
    item.producto = producto;
    item.cantidad = cantidad;
    return item;
  }
}
