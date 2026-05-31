import { CrearRecetaDTO } from "../../dtos/receta/crear.dto";
import { Receta } from "../../models/entities/receta";
import { RecetaResponseDTO } from "../../dtos/receta/response.dto";

export interface IRecetaService {
  crearReceta(datos: CrearRecetaDTO): Promise<RecetaResponseDTO>;
}
