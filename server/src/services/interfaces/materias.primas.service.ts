import { CrearMateriaPrimaDTO } from "../../dtos/materiasPrimas/crear.dto";
import { MateriaPrima } from "../../models/entities/materiaPrima";

export interface IMateriasPrimasService {
  crearMateriaPrima(materiaPrimaACrear: CrearMateriaPrimaDTO): Promise<MateriaPrima>;
}
