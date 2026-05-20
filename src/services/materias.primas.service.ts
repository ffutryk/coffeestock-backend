import { CrearMateriaPrimaDTO } from "../dtos/materiasPrimas/crear.dto";
import { BadRequestError } from "../errors";
import { MateriaPrima } from "../models/entities/materiaPrima";
import { MateriasPrimasRepository } from "../repositories/interfaces/materias.primas.interface";
import { IMateriasPrimasService } from "./interfaces/materias.primas.service";

class MateriasPrimasService implements IMateriasPrimasService {
  constructor(private readonly materiasPrimasRepository: MateriasPrimasRepository) {}
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
    return await this.materiasPrimasRepository.save(materiaPrimaRecuperada);
  }
}

export default MateriasPrimasService;
