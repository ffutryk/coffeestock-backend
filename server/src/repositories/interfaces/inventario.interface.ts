import { Inventario } from "../../models/entities/inventario";
import { BaseRepository } from "./base.interface";

export interface InventarioRepository extends BaseRepository<Inventario> {
  findById(idMateriaPrima: number): Promise<Inventario | null>;
  findAllWithDetails(): Promise<any[]>;
}
