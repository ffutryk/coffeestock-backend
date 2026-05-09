import { AppDataSource } from "../config/data-source";
import { Venta } from "../models/Venta";
import type { VentaDao } from "../daos/VentaDao";

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