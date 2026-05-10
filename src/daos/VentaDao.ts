import { Venta } from "../models/Venta";

export interface VentaDao {
  save(venta: Venta): Promise<Venta>;
  findById(id: number): Promise<Venta | null>;
}