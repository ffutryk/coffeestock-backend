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
  constructor(
    private readonly materiasPrimasRepository: MateriasPrimasRepository,
    private readonly inventarioRepository: InventarioRepository,
  ) {}
  async crearMateriaPrima(materiaPrimaACrear: CrearMateriaPrimaDTO): Promise<MateriaPrima> {
    const { nombre, marca } = materiaPrimaACrear;
    let materiaPrimaRecuperada = await this.materiasPrimasRepository.findByNameAndBrand({
      nombre,
      marca,
    });
    if (materiaPrimaRecuperada != null) {
      throw new BadRequestError("La materia prima ya existe");
    }
    materiaPrimaRecuperada = new MateriaPrima();
    Object.assign(materiaPrimaRecuperada, materiaPrimaACrear);
    const materiaPrima = await this.materiasPrimasRepository.save(materiaPrimaRecuperada);
    const inventario = new Inventario();
    inventario.materiaPrima = materiaPrima;

    await this.inventarioRepository.save(inventario);

    return materiaPrima;
  }
}

export default MateriasPrimasService;
