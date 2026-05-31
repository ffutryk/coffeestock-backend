import { ReporteEstadisticasDTO } from "../../models/types/estadisticas";

export interface EstadisticasVentasDTO {
  totalFacturado: number;
  cantidadVentas: number;
  ticketPromedio: number;
}

export interface EstadisticaDao {
  obtenerMetricasGenerales(): Promise<ReporteEstadisticasDTO | null>;
  obtenerEstadisticasVentas(fechaInicio?: Date, fechaFin?: Date): Promise<EstadisticasVentasDTO>;
}
