import { Receta } from "../../models/entities/receta";
import { MateriaPrimaResumenDTO } from "../materiasPrimas/response.dto";

export class RecetaResponseDTO {
  cantidad!: number;
  materiaPrima!: MateriaPrimaResumenDTO;

  static from(receta: Receta): RecetaResponseDTO {
    const dto = new RecetaResponseDTO();

    dto.cantidad = Number(receta.cantidad);
    dto.materiaPrima = MateriaPrimaResumenDTO.from(receta.materiaPrima);

    return dto;
  }

  static fromMany(recetas: Receta[]): RecetaResponseDTO[] {
    return recetas.map(RecetaResponseDTO.from);
  }
}
