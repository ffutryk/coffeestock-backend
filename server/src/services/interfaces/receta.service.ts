import { CrearRecetaDTO } from "../../dtos/receta/crear.dto";
import { Receta } from "../../models/entities/receta";

export interface IRecetaService {
  crearReceta(datos: CrearRecetaDTO): Promise<Receta[]>;
}
