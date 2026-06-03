import { TypeOrmBaseRepository } from "./base.repository";
import { Alerta } from "../../models/entities/alerta";
import { AlertaRepository } from "../interfaces/alerta.interface";

export class TypeOrmAlertaRepository
  extends TypeOrmBaseRepository<Alerta>
  implements AlertaRepository
{
  constructor() {
    super(Alerta);
  }

  async findLatestStockBajoAlertByMateriaPrimaId(materiaPrimaId: number): Promise<Alerta | null> {
    return await this.repository
      .createQueryBuilder("a")
      .where("a.metadata @> :metadata::jsonb", {
        metadata: JSON.stringify({ materiaPrimaId, reason: "STOCK_BAJO" }),
      })
      .orderBy("a.createdAt", "DESC")
      .getOne();
  }
}
