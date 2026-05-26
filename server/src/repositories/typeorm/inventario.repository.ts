import { Repository } from "typeorm";
import { AppDataSource } from "../../config/data-source";
import { Inventario } from "../../models/entities/inventario";
import { MateriaPrima } from "../../models/entities/materiaPrima";
import { InventarioDao } from "../interfaces/inventario.interface";

export class TypeORMInventarioRepository implements InventarioDao {
  private repository: Repository<Inventario> = AppDataSource.getRepository(Inventario);

  async findById(idMateriaPrima: number): Promise<Inventario | null> {
    return await this.repository.findOneBy({ idMateriaPrima });
  }

  async save(inventario: Inventario): Promise<Inventario> {
    return await this.repository.save(inventario);
  }

  async findAllWithDetails(): Promise<any[]> {
    const query = AppDataSource.createQueryBuilder()
      .select([
        "mp.id AS id",
        "mp.nombre AS nombre",
        "COALESCE(i.stockActual, 0) AS \"stockActual\"",
        "COALESCE(i.stockMinimo, 0) AS \"stockMinimo\"",
        "mp.unidad AS \"unidadDeMedida\""
      ])
      .from(MateriaPrima, "mp")
      .leftJoin(Inventario, "i", "mp.id = i.idMateriaPrima");

    return await query.getRawMany();
  }
}
