import { Paginacion } from "../models/Paginacion";
import { ResultadoPaginado } from "../models/ResultadoPaginado";
import { Venta } from "../models/Venta";

export interface VentaDao {
  save(venta: Venta): Promise<Venta>;
  findById(id: number): Promise<Venta | null>;
  findManyWithItems(paginacion: Paginacion): Promise<ResultadoPaginado<Venta>>;
}
