import type { NextFunction, Request, Response } from "express";
import { EstadisticaService } from "../services/estadistica.service";
import { ReporteEstadisticasDTO} from "../models/types/estadisticas";


export class EstadisticaController {
  constructor(private readonly estadisticaService: EstadisticaService) {}

  obtenerEstadisticasProductos = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = (req as any).user?.username || "usuarioDePrueba"; // uso el any para que no me tiro error en el req.user

      const estadisticas: ReporteEstadisticasDTO =
        await this.estadisticaService.obtenerEstadisticasProductos(user);

      return res.status(200).json(estadisticas);
    } catch (err) {
      next(err);
    }
  };
}