import { CrearComboDTO } from "../../dtos/combo/crear.dto";
import { ComboResponseDTO } from "../../dtos/combo/response.dto";

export interface IComboService {
  crearCombo(datos: CrearComboDTO): Promise<ComboResponseDTO>;
  listarCombos(): Promise<ComboResponseDTO[]>;
}