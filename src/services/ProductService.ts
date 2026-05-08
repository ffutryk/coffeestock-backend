import { AppDataSource } from "../config/data-source.js";
import { Producto } from "../Entities/Producto.js";

export class ProductService {
  async actualizarProducto(id: number, datosNuevos: Partial<Producto>): Promise<Producto | null> {
    const productRepo = AppDataSource.getRepository(Producto);

    const producto = await productRepo.findOneBy({ id });
    if (!producto) {
      return null;
    }

    const productoActualizado = productRepo.merge(producto, datosNuevos);

    return await productRepo.save(productoActualizado);
  }



  async eliminarProducto(id: number): Promise<boolean> {
    const productRepo = AppDataSource.getRepository(Producto);

    const resultado = await productRepo.softDelete(id);

    // Retornamos true si se afectó al menos una fila, de lo contrario false
    return (resultado.affected ?? 0) > 0;
  }
}

