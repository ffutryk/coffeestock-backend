import { AppDataSource } from "../../config/data-source";
import { ItemVenta } from "../../models/entities/item-venta";
import { Venta } from "../../models/entities/venta";
import { EstadisticaDao, EstadisticasVentasDTO } from "../interfaces/estadistica.interface";
import { ReporteEstadisticasDTO } from "../../models/types/estadisticas";

export class TypeORMEstadisticaRepository implements EstadisticaDao {
  async obtenerEstadisticasVentas(fechaInicio?: Date, fechaFin?: Date): Promise<EstadisticasVentasDTO> {
    const ventaRepo = AppDataSource.getRepository(Venta);

    const query = ventaRepo.createQueryBuilder("venta")
      .leftJoin("venta.items", "item")
      .select("COUNT(DISTINCT venta.id)", "cantidadVentas")
      .addSelect("SUM(item.cantidad * item.precio)", "totalFacturado");

    if (fechaInicio) {
      query.andWhere("venta.createdAt >= :fechaInicio", { fechaInicio });
    }

    if (fechaFin) {
      query.andWhere("venta.createdAt <= :fechaFin", { fechaFin });
    }

    const rawResult = await query.getRawOne();

    const cantidadVentas = Number(rawResult?.cantidadVentas || 0);
    const totalFacturado = Number(rawResult?.totalFacturado || 0);
    const ticketPromedio = cantidadVentas > 0 ? Number((totalFacturado / cantidadVentas).toFixed(2)) : 0;

    return {
      totalFacturado,
      cantidadVentas,
      ticketPromedio
    };
  }

  async obtenerMetricasGenerales(): Promise<ReporteEstadisticasDTO | null> {
    const itemVentaRepo = AppDataSource.getRepository(ItemVenta);
    const ventaRepo = AppDataSource.getRepository(Venta);

    const totalVentas = await ventaRepo.count();
    if (totalVentas === 0) {
      return null;
    }

    // Query para el TOP 5 de productos mas vendidos y sus ganancias
    const productosRaw = await itemVentaRepo
      .createQueryBuilder("item")
      .select("item.idProducto", "idProducto")
      .addSelect("item.nombreProducto", "nombre")
      .addSelect("SUM(item.cantidad)", "cantidadVendida")
      .addSelect("SUM(item.cantidad * item.precioProducto)", "gananciaGenerada")
      .groupBy("item.idProducto")
      .addGroupBy("item.nombreProducto")
      .orderBy("cantidadVendida", "DESC")
      .limit(5)
      .getRawMany();

    const productosMasVendidos = productosRaw.map((p) => ({
      idProducto: Number(p.idProducto),
      nombre: p.nombre,
      cantidadVendida: Number(p.cantidadVendida),
      gananciaGenerada: Number(p.gananciaGenerada),
    }));

    // Query para calcular las ganancias totales
    const ganancias = await itemVentaRepo
      .createQueryBuilder("item")
      .select("SUM(item.cantidad * item.precioProducto)", "total")
      .getRawOne();

    const gananciasTotales = Number(ganancias?.total || 0);

    // Query para el promedio de ventas realizadas (promedio por ticket)
    const subQuery = itemVentaRepo
      .createQueryBuilder("item")
      .select("SUM(item.cantidad * item.precioProducto)", "totalVenta")
      .groupBy("item.idVenta")
      .getQuery();

    const promedio = await AppDataSource.manager
      .createQueryBuilder()
      .select("AVG(sub.totalVenta)", "promedio")
      .from(`(${subQuery})`, "sub")
      .setParameters(itemVentaRepo.createQueryBuilder("item").getParameters())
      .getRawOne();

    const promedioVentaPorTicket = Number(promedio?.promedio || 0);

    return {
      productosMasVendidos,
      gananciasTotales,
      promedioVentaPorTicket,
    };
  }
}
