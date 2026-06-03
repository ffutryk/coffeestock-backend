import { Transactional } from "../decorators/transactional.decorator";
import { CrearMateriaPrimaDTO } from "../dtos/materiasPrimas/crear.dto";
import { BadRequestError } from "../errors";
import { Inventario } from "../models/entities/inventario";
import { MateriaPrima } from "../models/entities/materia-prima";
import type { InventarioRepository } from "../repositories/interfaces/inventario.interface";
import type { MateriasPrimasRepository } from "../repositories/interfaces/materias.primas.interface";
import type { IMateriasPrimasService } from "./interfaces/materias.primas.service";

@Transactional()
class MateriasPrimasService implements IMateriasPrimasService {
  constructor(private readonly materiasPrimasRepository: MateriasPrimasRepository) {}

  async crearMateriaPrima(materiaPrimaACrear: CrearMateriaPrimaDTO): Promise<MateriaPrima> {
    const { nombre, marca } = materiaPrimaACrear;
    const materiaPrimaRecuperada = await this.materiasPrimasRepository.findByNameAndBrand({
      nombre,
      marca,
    });
    if (materiaPrimaRecuperada != null) {
      throw new BadRequestError("La materia prima ya existe");
    }

    const materiaPrima = MateriaPrima.crear(
      nombre,
      marca,
      materiaPrimaACrear.unidad,
      materiaPrimaACrear.cantidad_unidad,
    );

    return await this.materiasPrimasRepository.save(materiaPrima);
  }
}

export default MateriasPrimasService;
