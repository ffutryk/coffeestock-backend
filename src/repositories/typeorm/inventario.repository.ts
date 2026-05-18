import { Repository } from "typeorm";
import { AppDataSource } from "../../config/data-source";
import { Inventario } from "../../models/entities/inventario";
import { InventarioDao } from "../interfaces/inventario.interface";

export class TypeORMInventarioRepository implements InventarioDao {
  private repository: Repository<Inventario> = AppDataSource.getRepository(Inventario);

  async findById(idMateriaPrima: number): Promise<Inventario | null> {
    return await this.repository.findOneBy({ idMateriaPrima });
  }

  async save(inventario: Inventario): Promise<Inventario> {
    return await this.repository.save(inventario);
  }
}
