import { Producto } from "../models/Producto";

export interface ProductoDao {
  findById(id: number): Promise<Producto | null>;
  findByIds(ids: number[]): Promise<Producto[]>;
  findAll(): Promise<Producto[]>;
  save(producto: Producto): Promise<Producto>;
  delete(id: number): Promise<boolean>;
  // faltan otros metodos, no esta completo
}
