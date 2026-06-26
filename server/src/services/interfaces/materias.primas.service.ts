import { CrearMateriaPrimaDTO } from "../../dtos/materiasPrimas/crear.dto";
import { MateriaPrima } from "../../models/entities/materia-prima";

export interface IMateriasPrimasService {
  crearMateriaPrima(materiaPrimaACrear: CrearMateriaPrimaDTO): Promise<MateriaPrima>;
}
