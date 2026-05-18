import { EstadisticaDao } from "../repositories/interfaces/estadistica.interface";
import { ReporteEstadisticasDTO } from "../models/types/estadisticas";

export class EstadisticaService {

  constructor(private estadisticaDao: EstadisticaDao) {}

  async obtenerEstadisticasProductos(user: string): Promise<ReporteEstadisticasDTO> {
    if(!user) {
      throw new Error("Usuario no autenticado");
    }

    const estadisticas = await this.estadisticaDao.obtenerMetricasGenerales();

    if (!estadisticas) {
      throw new Error("No hay ventas disponibles para realizar estadísticas");
    }

    return estadisticas;

  }

}
