import { EstadisticaRepository, EstadisticasVentasDTO } from "../repositories/interfaces/estadistica.interface";
import { ReporteEstadisticasDTO, EmpleadoEstadistica } from "../models/types/estadisticas";

export class EstadisticaService {

  constructor(private estadisticaRepository: EstadisticaRepository) {}

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

    return await this.estadisticaRepository.obtenerEstadisticasVentas(inicio, fin);
  }

  async obtenerEstadisticasProductos(user: string, fechaInicio?: string, fechaFin?: string): Promise<ReporteEstadisticasDTO> {
    if (!user) {
      throw new Error("Usuario no autenticado");
    }

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

    const estadisticas = await this.estadisticaRepository.obtenerMetricasGenerales(inicio, fin);

    if (!estadisticas) {
      return {
        productosMasVendidos: [],
        gananciasTotales: 0,
        promedioVentaPorTicket: 0,
      };
    }

    return estadisticas;
  }

  async obtenerEstadisticasEmpleados(): Promise<EmpleadoEstadistica[]> {
    return await this.estadisticaRepository.obtenerEstadisticasEmpleados();
  }

  async obtenerEstadisticasEmpleados(): Promise<EmpleadoEstadistica[]> {
    return await this.estadisticaRepository.obtenerEstadisticasEmpleados();
  }

}
