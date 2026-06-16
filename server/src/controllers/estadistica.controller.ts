import type { NextFunction, Request, Response } from "express";
import { EstadisticaService } from "../services/estadistica.service";
import { FiltrarEstadisticasVentasDTO } from "../dtos/estadistica/filtrar-ventas.dto";
import { ReporteEstadisticasDTO, EmpleadoEstadistica } from "../models/types/estadisticas";

export class EstadisticaController {
  constructor(private readonly estadisticaService: EstadisticaService) {}

  obtenerEstadisticasVentas = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { fechaInicio, fechaFin } = req.validatedQuery as FiltrarEstadisticasVentasDTO;
      const estadisticas = await this.estadisticaService.obtenerEstadisticasVentas(fechaInicio, fechaFin);
      return res.status(200).json(estadisticas);
    } catch (err) {
      next(err);
    }
  };

  obtenerEstadisticasProductos = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user!.id.toString();

      const estadisticas: ReporteEstadisticasDTO =
        await this.estadisticaService.obtenerEstadisticasProductos(userId);

      return res.status(200).json(estadisticas);
    } catch (err) {
      next(err);
    }
  };

  obtenerEstadisticasEmpleados = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const estadisticas: EmpleadoEstadistica[] =
        await this.estadisticaService.obtenerEstadisticasEmpleados();

      return res.status(200).json(estadisticas);
    } catch (err) {
      next(err);
    }
  };
}