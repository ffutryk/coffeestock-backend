import { AppDataSource } from "../config/data-source.js";
import { Venta } from "../models/Venta.js";
import type { VentaDao } from "../daos/VentaDao.js";

export class TypeOrmVentaDao implements VentaDao {
  private repository = AppDataSource.getRepository(Venta);

  async save(venta: Venta): Promise<Venta> {
    return await this.repository.save(venta);
  }

  async findById(id: number): Promise<Venta | null> {
    return await this.repository.findOne({
      where: { id },
      relations: ["items"]
    });
  }
}