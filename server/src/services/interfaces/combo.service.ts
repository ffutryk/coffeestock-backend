import { CrearComboDTO } from "../../dtos/combo/crear.dto";
import { ComboResponseDTO } from "../../dtos/combo/response.dto";

export interface IComboService {
  obtenerPorId(arg0: number): unknown;
  actualizarCombo(arg0: number, body: any): unknown;
  crearCombo(datos: CrearComboDTO): Promise<ComboResponseDTO>;
  listarCombos(): Promise<ComboResponseDTO[]>;
}
