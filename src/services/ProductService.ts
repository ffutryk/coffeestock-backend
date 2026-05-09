import { AppDataSource } from "../config/data-source.js";
import { Producto } from "../entities/Producto.js";
import type { ProductoDao } from "../daos/ProductoDao.js";

export class ProductService {
  constructor(private readonly productoDao: ProductoDao) {}

  async actualizarProducto(id: number, datosNuevos: Partial<Producto>): Promise<Producto | null> {
    // uso el dao para acceder al DataSource
    const producto = await this.productoDao.findById(id);

    if (!producto) return null;

    Object.assign(producto, datosNuevos);
    return await this.productoDao.save(producto);
  }

  async eliminarProducto(id: number): Promise<boolean> {
    return await this.productoDao.softDelete(id); // lo hago con borrado logico
  }
}

