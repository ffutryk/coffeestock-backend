import { ReporteEstadisticasDTO } from "../../models/types/estadisticas";

export interface EstadisticaDao {
  obtenerMetricasGenerales(): Promise<ReporteEstadisticasDTO | null>;
}
