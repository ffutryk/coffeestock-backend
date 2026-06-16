import { AppDataSource } from "../../config/data-source";
import { ItemVenta } from "../../models/entities/item-venta";
import { Venta } from "../../models/entities/venta";
import { Usuario } from "../../models/entities/usuario";
import { EstadisticaRepository, EstadisticasVentasDTO } from "../interfaces/estadistica.interface";
import { ReporteEstadisticasDTO, EmpleadoEstadistica } from "../../models/types/estadisticas";

export class TypeORMEstadisticaRepository implements EstadisticaRepository {
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

  async obtenerEstadisticasEmpleados(): Promise<EmpleadoEstadistica[]> {
    const usuarioRepo = AppDataSource.getRepository(Usuario);

    const rawResults = await usuarioRepo
      .createQueryBuilder("u")
      .innerJoin("ventas", "v", "v.created_by = u.id")
      .innerJoin("item_venta", "iv", "iv.ventaId = v.id")
      .select("u.id", "id")
      .addSelect("CONCAT(u.nombre, ' ', u.apellido)", "nombre")
      .addSelect("COUNT(DISTINCT v.id)", "totalSales")
      .addSelect(
        `COUNT(DISTINCT CASE WHEN v.created_at >= NOW() - INTERVAL '30 days' THEN v.id END)`,
        "last30DaysSales",
      )
      .addSelect("COALESCE(SUM(iv.cantidad * iv.precio), 0)", "totalRevenue")
      .where("u.rol = :rol", { rol: "EMPLEADO" })
      .groupBy("u.id")
      .addGroupBy("u.nombre")
      .addGroupBy("u.apellido")
      .orderBy('"totalSales"', "DESC")
      .getRawMany();

    return rawResults.map((r) => ({
      id: Number(r.id),
      nombre: r.nombre,
      totalSales: Number(r.totalSales),
      last30DaysSales: Number(r.last30DaysSales),
      totalRevenue: Number(r.totalRevenue),
    }));
  }
}
