import { Paginacion } from "../../models/types/paginacion";
import { ResultadoPaginado } from "../../models/types/resultado-paginado";
import { Venta } from "../../models/entities/venta";

export interface VentaRepository {
  save(venta: Venta): Promise<Venta>;
  findById(id: number): Promise<Venta | null>;
  findManyWithItems(paginacion: Paginacion): Promise<ResultadoPaginado<Venta>>;
  delete(id: number): Promise<boolean>;
}
