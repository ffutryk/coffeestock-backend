import { Inventario } from "../../models/entities/inventario";
import { BaseRepository } from "./base.interface";

export interface InventarioDetalle {
  id: number;
  nombre: string;
  stockActual: string | number;
  stockMinimo: string | number;
  unidadDeMedida: string;
}

export interface InventarioRepository extends BaseRepository<Inventario> {
  findById(idMateriaPrima: number): Promise<Inventario | null>;
  findAllWithDetails(): Promise<InventarioDetalle[]>;
}
