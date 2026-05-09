import { Producto } from "../entities/Producto.js";

export interface ProductoDao {
  findById(id: number): Promise<Producto | null>;
  save(producto: Producto): Promise<Producto>;
  delete(id: number): Promise<boolean>;
  // faltan otros metodos, no esta completo
}
