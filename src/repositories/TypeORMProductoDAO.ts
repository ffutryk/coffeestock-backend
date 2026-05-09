import { AppDataSource } from "../config/data-source";
import { Producto } from "../entities/Producto";
import type { ProductoDao } from "../daos/ProductoDao";

export class TypeOrmProductoDao implements ProductoDao {
  private repository = AppDataSource.getRepository(Producto);

  async findById(id: number): Promise<Producto | null> {
    return await this.repository.findOneBy({ id });
  }

  async save(producto: Producto): Promise<Producto> {
    return await this.repository.save(producto);
  }

  async delete(id: number): Promise<boolean> {
    const resultado = await this.repository.softDelete(id);
    return (resultado.affected ?? 0) > 0;
  }
}
