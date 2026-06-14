import { Producto } from "../models/entities/producto";
import type { ProductoRepository } from "../repositories/interfaces/producto.interface";
import type { ActualizarProductoDTO } from "../dtos/producto/actualizar.dto";
import type { CrearProductoDTO } from "../dtos/producto/crear.dto";
import { NotFoundError } from "../errors";
import { Transactional } from "../decorators/transactional.decorator";
import { ResultadoPaginado } from "../models/types/resultado-paginado";
import { PaginacionDTO } from "../dtos/paginacion.dto";
import { Receta } from "../models/entities/receta";
import type { MateriasPrimasRepository } from "../repositories/interfaces/materias.primas.interface";

@Transactional()
export class ProductoService {
  constructor(
    private readonly productoRepository: ProductoRepository,
    private readonly materiaPrimaRepository: MateriasPrimasRepository,
  ) {}

  async crearProducto(datos: CrearProductoDTO): Promise<Producto> {
    const producto = Producto.crear(
      datos.nombre,
      datos.descripcion ?? "",
      datos.precio,
      datos.tipo,
      datos.sinTacc,
    );

    if (datos.ingredientes && datos.ingredientes.length > 0) {
      producto.recetas = await this.resolverReceta(producto, datos.ingredientes);
    } else {
      producto.stock = datos.stock ?? 0;
    }

    return await this.productoRepository.save(producto);
  }

  async verProducto(id: number): Promise<Producto> {
    const producto = await this.productoRepository.findById(id);
    if (!producto) {
      throw new NotFoundError("No se pudo encontrar el producto");
    }
    return producto;
  }

  async listarProductos(
    paginacion?: PaginacionDTO,
  ): Promise<ResultadoPaginado<Producto> | Producto[]> {
    if (paginacion) return await this.productoRepository.findAllPaginated(paginacion);
    return await this.productoRepository.findAll();
  }

  async actualizarProducto(
    id: number,
    datosNuevos: ActualizarProductoDTO,
  ): Promise<Producto | null> {
    const producto = await this.productoRepository.findById(id);

    if (!producto) throw new NotFoundError("No se pudo encontrar el producto");

    const { ingredientes, ...camposEscalares } = datosNuevos;

    Object.assign(producto, camposEscalares);

    if (ingredientes !== undefined) {
      producto.recetas = await this.resolverReceta(producto, ingredientes);
    }

    return await this.productoRepository.save(producto);
  }

  async eliminarProducto(id: number): Promise<boolean> {
    const producto = await this.productoRepository.findById(id);

    if (!producto) {
      throw new NotFoundError("No se pudo encontrar el producto");
    }

    return await this.productoRepository.delete(id);
  }

  private async resolverReceta(
    producto: Producto,
    ingredientes: { idMateriaPrima: number; cantidad: number }[],
  ): Promise<Receta[]> {
    const ingredientesResueltos = await Promise.all(
      ingredientes.map(async ({ idMateriaPrima, cantidad }) => {
        const materiaPrima = await this.materiaPrimaRepository.findById(idMateriaPrima);

        if (!materiaPrima) {
          throw new NotFoundError(`No se encontró la materia prima con id ${idMateriaPrima}`);
        }

        return { materiaPrima, cantidad };
      }),
    );

    return producto.construirReceta(ingredientesResueltos);
  }
}
