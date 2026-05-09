import { AppDataSource } from "../config/data-source.js";
import { Producto } from "../entities/Producto.js";
import type { ProductoDao } from "../daos/ProductoDao.js";

export class TypeOrmProductoDao implements ProductoDao {
  private repository = AppDataSource.getRepository(Producto);

  async findById(id: number): Promise<Producto | null> {
    return await this.repository.findOneBy({ id });
  }

  async save(producto: Producto): Promise<Producto> {
    return await this.repository.save(producto);
  }

  async softDelete(id: number): Promise<boolean> {
    const resultado = await this.repository.softDelete(id);
    return (resultado.affected ?? 0) > 0;
  }
}
