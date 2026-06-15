import { Paginacion } from "../../models/types/paginacion";
import { ResultadoPaginado } from "../../models/types/resultado-paginado";
import { Venta } from "../../models/entities/venta";
import { BaseRepository } from "./base.interface";

export interface VentaRepository extends BaseRepository<Venta> {
  findManyWithItems(paginacion: Paginacion, fechaDesde?: Date): Promise<ResultadoPaginado<Venta>>;
  findByIdWithInventories(id: number): Promise<Venta | null>;
  deleteItems(ventaId: number): Promise<void>;
}
