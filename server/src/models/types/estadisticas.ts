export interface ProductoEstadistica {
  idProducto: number;
  nombre: string;
  cantidadVendida: number;
  gananciaGenerada: number;
}

export interface ReporteEstadisticasDTO {
  productosMasVendidos: ProductoEstadistica[];
  gananciasTotales: number;
  promedioVentaPorTicket: number;
}

export interface EmpleadoEstadistica {
  id: number;
  nombre: string;
  totalSales: number;
  last30DaysSales: number;
  totalRevenue: number;
}
