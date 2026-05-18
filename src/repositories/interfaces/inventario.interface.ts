import { Inventario } from "../../models/entities/inventario";

export interface InventarioDao {
  findById(idMateriaPrima: number): Promise<Inventario | null>;
  save(inventario: Inventario): Promise<Inventario>;
}
