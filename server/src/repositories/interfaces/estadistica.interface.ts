import { ReporteEstadisticasDTO, EmpleadoEstadistica } from "../../models/types/estadisticas";

export interface EstadisticasVentasDTO {
  totalFacturado: number;
  cantidadVentas: number;
  ticketPromedio: number;
}

export interface EstadisticaRepository {
  obtenerMetricasGenerales(fechaInicio?: Date, fechaFin?: Date): Promise<ReporteEstadisticasDTO | null>;
  obtenerEstadisticasVentas(fechaInicio?: Date, fechaFin?: Date): Promise<EstadisticasVentasDTO>;
  obtenerEstadisticasEmpleados(): Promise<EmpleadoEstadistica[]>;
}
