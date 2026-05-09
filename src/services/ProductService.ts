import { Producto } from "../models/Producto";
import type { ProductoDao } from "../daos/ProductoDao";
import type { ActualizarProductoDTO } from "../dtos/product.dto";

export class ProductService {
  constructor(private readonly productoDao: ProductoDao) {}

  async actualizarProducto(
    id: number,
    datosNuevos: ActualizarProductoDTO,
    updatedBy: string,
  ): Promise<Producto | null> {
    // uso el dao para acceder al DataSource
    const producto = await this.productoDao.findById(id);

    if (!producto) throw new Error("No se pudo encontrar el producto");

    producto.updatedBy = updatedBy;

    Object.assign(producto, datosNuevos);
    return await this.productoDao.save(producto);
  }

  async eliminarProducto(id: number, deletedBy: string): Promise<boolean> {
    const producto = await this.productoDao.findById(id);

    if (!producto) {
      throw new Error("No se pudo encontrar el producto");
    }

    // se guarda quien lo borra
    producto.deletedBy = deletedBy;
    await this.productoDao.save(producto);

    return await this.productoDao.delete(id);
  }
}

