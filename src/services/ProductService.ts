import { Producto } from "../models/Producto";
import type { ProductoDao } from "../daos/ProductoDao";
import type { ActualizarProductoDTO } from "../dtos/product.dto";
import type { CrearProductoDTO } from "../dtos/product.dto";
import { NotFoundError } from "../errors";

export class ProductService {
  constructor(private readonly productoDao: ProductoDao) {}

  async crearProducto(datos: CrearProductoDTO, createdBy: number): Promise<Producto> {
    const producto = new Producto();
    Object.assign(producto, datos);
    // if (datos.nombre !== undefined) producto.nombre = datos.nombre;
    // if (datos.descripcion !== undefined) producto.descripcion = datos.descripcion;
    // if (datos.precio !== undefined) producto.precio = datos.precio;
    // if (datos.stock !== undefined && datos.stock !== null) producto.stock = datos.stock;
    // if (datos.tipo !== undefined) producto.tipo = datos.tipo;
    // if (datos.sinTacc !== undefined) producto.sinTacc = datos.sinTacc;
    producto.updatedBy = createdBy;
    return await this.productoDao.save(producto);
  }

  async verProducto(id: number): Promise<Producto> {
    const producto = await this.productoDao.findById(id);
    if (!producto) {
      throw new NotFoundError("No se pudo encontrar el producto");
    }
    return producto;
  }

  async listarProductos(): Promise<Producto[]> {
    return await this.productoDao.findAll();
  }

  async actualizarProducto(
    id: number,
    datosNuevos: ActualizarProductoDTO,
    updatedBy: number,
  ): Promise<Producto | null> {
    // uso el dao para acceder al DataSource
    const producto = await this.productoDao.findById(id);

    if (!producto) throw new NotFoundError("No se pudo encontrar el producto");

    producto.updatedBy = updatedBy;

    Object.assign(producto, datosNuevos);
    return await this.productoDao.save(producto);
  }

  async eliminarProducto(id: number, deletedBy: number): Promise<boolean> {
    const producto = await this.productoDao.findById(id);

    if (!producto) {
      throw new NotFoundError("No se pudo encontrar el producto");
    }

    // se guarda quien lo borra
    producto.deletedBy = deletedBy;
    await this.productoDao.save(producto);

    return await this.productoDao.delete(id);
  }
}
