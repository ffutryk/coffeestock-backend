import { Producto } from "../models/entities/producto";
import type { ProductoRepository } from "../repositories/interfaces/producto.interface";
import type { ActualizarProductoDTO } from "../dtos/product.dto";
import type { CrearProductoDTO } from "../dtos/product.dto";
import { NotFoundError } from "../errors";

export class ProductService {
  constructor(private readonly productoRepository: ProductoRepository) {}

  async crearProducto(datos: CrearProductoDTO, createdBy: number): Promise<Producto> {
    const producto = new Producto();
    Object.assign(producto, datos);
    // if (datos.nombre !== undefined) producto.nombre = datos.nombre;
    // if (datos.descripcion !== undefined) producto.descripcion = datos.descripcion;
    // if (datos.precio !== undefined) producto.precio = datos.precio;
    // if (datos.stock !== undefined && datos.stock !== null) producto.stock = datos.stock;
    // if (datos.tipo !== undefined) producto.tipo = datos.tipo;
    // if (datos.sinTacc !== undefined) producto.sinTacc = datos.sinTacc;
    producto.createdBy = createdBy;
    return await this.productoRepository.save(producto);
  }

  async verProducto(id: number): Promise<Producto> {
    const producto = await this.productoRepository.findById(id);
    if (!producto) {
      throw new NotFoundError("No se pudo encontrar el producto");
    }
    return producto;
  }

  async listarProductos(): Promise<Producto[]> {
    return await this.productoRepository.findAll();
  }

  async actualizarProducto(
    id: number,
    datosNuevos: ActualizarProductoDTO,
    updatedBy: number,
  ): Promise<Producto | null> {
    // uso el dao para acceder al DataSource
    const producto = await this.productoRepository.findById(id);

    if (!producto) throw new NotFoundError("No se pudo encontrar el producto");

    producto.updatedBy = updatedBy;

    Object.assign(producto, datosNuevos);
    return await this.productoRepository.save(producto);
  }

  async eliminarProducto(id: number, deletedBy: number): Promise<boolean> {
    const producto = await this.productoRepository.findById(id);

    if (!producto) {
      throw new NotFoundError("No se pudo encontrar el producto");
    }

    // se guarda quien lo borra
    producto.deletedBy = deletedBy;
    await this.productoRepository.save(producto);

    return await this.productoRepository.delete(id);
  }
}
