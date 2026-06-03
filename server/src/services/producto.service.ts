import { Producto } from "../models/entities/producto";
import type { ProductoRepository } from "../repositories/interfaces/producto.interface";
import type { ActualizarProductoDTO } from "../dtos/producto/actualizar.dto";
import type { CrearProductoDTO } from "../dtos/producto/crear.dto";
import { NotFoundError } from "../errors";
import { Transactional } from "../decorators/transactional.decorator";

@Transactional()
export class ProductoService {
  constructor(private readonly productoRepository: ProductoRepository) {}

  async crearProducto(datos: CrearProductoDTO): Promise<Producto> {
    const producto = Producto.crear(
      datos.nombre,
      datos.descripcion ?? "",
      datos.precio,
      datos.tipo,
      datos.sinTacc,
    );

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
  ): Promise<Producto | null> {
    // uso el dao para acceder al DataSource
    const producto = await this.productoRepository.findById(id);

    if (!producto) throw new NotFoundError("No se pudo encontrar el producto");

    Object.assign(producto, datosNuevos);
    return await this.productoRepository.save(producto);
  }

  async eliminarProducto(id: number): Promise<boolean> {
    const producto = await this.productoRepository.findById(id);

    if (!producto) {
      throw new NotFoundError("No se pudo encontrar el producto");
    }

    return await this.productoRepository.delete(id);
  }
}
