import { CrearRecetaDTO } from "../dtos/receta/crear.dto";
import { NotFoundError } from "../errors";
import type { ProductoRepository } from "../repositories/interfaces/producto.interface";
import type { MateriasPrimasRepository } from "../repositories/interfaces/materias.primas.interface";
import type { RecetaRepository } from "../repositories/interfaces/receta.interface";
import { RecetaResponseDTO } from "../dtos/receta/response.dto";
import { Transactional } from "../decorators/transactional.decorator";

@Transactional()
export class RecetaService {
  constructor(
    private readonly recetaRepository: RecetaRepository,
    private readonly productoRepository: ProductoRepository,
    private readonly materiaPrimaRepository: MateriasPrimasRepository,
  ) {}

  async crearReceta(datos: CrearRecetaDTO): Promise<RecetaResponseDTO> {
    const producto = await this.productoRepository.findById(datos.idProducto);
    if (!producto) throw new NotFoundError("No se encontró el producto");

    const ids = datos.ingredientes.map((i) => i.idMateriaPrima);
    const materiasPrimas = await this.materiaPrimaRepository.findByIds(ids);

    if (materiasPrimas.length !== ids.length) {
      const encontrados = new Set(materiasPrimas.map((mp) => mp.id));
      const faltante = ids.find((id) => !encontrados.has(id));
      throw new NotFoundError(`No se encontró la materia prima con id ${faltante}`);
    }

    const materiasPrimasMap = new Map(materiasPrimas.map((mp) => [mp.id, mp]));

    const ingredientes = datos.ingredientes.map(({ idMateriaPrima, cantidad }) => ({
      materiaPrima: materiasPrimasMap.get(idMateriaPrima)!,
      cantidad,
    }));

    const recetas = producto.construirReceta(ingredientes);
    const recetasGuardadas = await Promise.all(recetas.map((r) => this.recetaRepository.save(r)));

    return {
      producto: { id: producto.id, nombre: producto.nombre },
      ingredientes: recetasGuardadas.map(({ materiaPrima, cantidad }) => ({
        materiaPrima: { id: materiaPrima.id, nombre: materiaPrima.nombre },
        cantidad,
      })),
    };
  }
}
