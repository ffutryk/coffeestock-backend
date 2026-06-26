import { Alerta } from "../../models/entities/alerta";
import { BaseRepository } from "./base.interface";

export interface AlertaRepository extends BaseRepository<Alerta> {
  findLatestStockBajoAlertByMateriaPrimaId(materiaPrimaId: number): Promise<Alerta | null>;
}
