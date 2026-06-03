import { AppDataSource } from "../../config/data-source";
import { Inventario } from "../../models/entities/inventario";
import { MateriaPrima } from "../../models/entities/materia-prima";
import { InventarioRepository } from "../interfaces/inventario.interface";
import { TypeOrmBaseRepository } from "./base.repository";

export class TypeOrmInventarioRepository
  extends TypeOrmBaseRepository<Inventario>
  implements InventarioRepository
{
  constructor() {
    super(Inventario);
  }

  async findById(idMateriaPrima: number): Promise<Inventario | null> {
    return await this.repository.findOneBy({ materiaPrima: { id: idMateriaPrima } });
  }

  async findAllWithDetails(): Promise<any[]> {
    const query = AppDataSource.createQueryBuilder()
      .select([
        "mp.id AS id",
        "mp.nombre AS nombre",
        'COALESCE(i.stockActual, 0) AS "stockActual"',
        'COALESCE(i.stockMinimo, 0) AS "stockMinimo"',
        'mp.unidad AS "unidadDeMedida"',
      ])
      .from(MateriaPrima, "mp")
      .leftJoin(Inventario, "i", "mp.id = i.id");

    return await query.getRawMany();
  }
}
