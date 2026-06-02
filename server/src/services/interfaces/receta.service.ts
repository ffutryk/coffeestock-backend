import { CrearRecetaDTO } from "../../dtos/receta/crear.dto";
import { RecetaResponseDTO } from "../../dtos/receta/response.dto";

export interface IRecetaService {
  crearReceta(datos: CrearRecetaDTO): Promise<RecetaResponseDTO>;
}
