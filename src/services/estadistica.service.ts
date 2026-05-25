import { EstadisticaDao, EstadisticasVentasDTO } from "../repositories/interfaces/estadistica.interface";
import { ReporteEstadisticasDTO } from "../models/types/estadisticas";

export class EstadisticaService {

  constructor(private estadisticaDao: EstadisticaDao) {}

  async obtenerEstadisticasVentas(fechaInicio?: string, fechaFin?: string): Promise<EstadisticasVentasDTO> {
    let inicio: Date | undefined;
    let fin: Date | undefined;

    if (fechaInicio) {
      inicio = new Date(fechaInicio);
    }

    if (fechaFin) {
      fin = new Date(fechaFin);
      if (fechaFin.indexOf("T") === -1) {
        fin.setHours(23, 59, 59, 999);
      }
    }

    return await this.estadisticaDao.obtenerEstadisticasVentas(inicio, fin);
  }

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
