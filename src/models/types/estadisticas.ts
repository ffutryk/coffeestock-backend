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
