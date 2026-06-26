import { CrearRecetaDTO } from "../dtos/receta/crear.dto";
import { BadRequestError, NotFoundError } from "../errors";
import { Transactional } from "../decorators/transactional.decorator";

import type { ProductoRepository } from "../repositories/interfaces/producto.interface";
import type { MateriasPrimasRepository } from "../repositories/interfaces/materias.primas.interface";
import type { RecetaRepository } from "../repositories/interfaces/receta.interface";
import { Receta } from "../models/entities/receta";

@Transactional()
export class RecetaService {
  constructor(
    private readonly recetaRepository: RecetaRepository,
    private readonly productoRepository: ProductoRepository,
    private readonly materiaPrimaRepository: MateriasPrimasRepository,
  ) {}

  async crearReceta(datos: CrearRecetaDTO): Promise<Receta[]> {
    const producto = await this.productoRepository.findById(datos.idProducto);

    if (!producto) {
      throw new NotFoundError("No se encontró el producto");
    }

    // Validar ingredientes duplicados
    const ids = datos.ingredientes.map((i) => i.idMateriaPrima);
    const idsUnicos = new Set(ids);

    if (ids.length !== idsUnicos.size) {
      throw new BadRequestError("Hay ingredientes duplicados en la receta");
    }

    // Buscar materias primas en una sola query
    const materiasPrimas = await this.materiaPrimaRepository.findByIds(ids);

    if (materiasPrimas.length !== ids.length) {
      const encontrados = new Set(materiasPrimas.map((mp) => mp.id));

      const faltante = ids.find((id) => !encontrados.has(id));

      throw new NotFoundError(`No se encontró la materia prima con id ${faltante}`);
    }

    const materiasPrimasMap = new Map(materiasPrimas.map((mp) => [mp.id, mp]));

    // Construir ingredientes
    const ingredientes = datos.ingredientes.map(({ idMateriaPrima, cantidad }) => ({
      materiaPrima: materiasPrimasMap.get(idMateriaPrima)!,
      cantidad,
    }));

    // Crear recetas desde el dominio
    const recetas = producto.construirReceta(ingredientes);

    // Guardar
    const recetasGuardadas = await Promise.all(recetas.map((r) => this.recetaRepository.save(r)));

    // Response
    return recetasGuardadas;
  }
}
