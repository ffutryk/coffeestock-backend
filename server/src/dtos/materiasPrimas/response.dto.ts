import { MateriaPrima } from "../../models/entities/materia-prima";
import { UnidadDeMedida } from "../../models/enums/unidad-de-medida";

export class MateriaPrimaResumenDTO {
  id!: number;
  nombre!: string;
  marca!: string;
  unidad!: UnidadDeMedida;
  cantidadUnidad!: number;
  esSinTacc!: boolean;

  static from(mp: MateriaPrima): MateriaPrimaResumenDTO {
    const dto = new MateriaPrimaResumenDTO();

    dto.id = mp.id;
    dto.nombre = mp.nombre;
    dto.marca = mp.marca;
    dto.unidad = mp.unidad;
    dto.cantidadUnidad = mp.cantidad_unidad;
    dto.esSinTacc = mp.esSinTacc;

    return dto;
  }
}
