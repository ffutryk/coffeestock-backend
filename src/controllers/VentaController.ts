import type { Request, Response, NextFunction } from "express";
import { VentaService } from "../services/VentaService";
import { VentaResponseDTO } from "../dtos/ventaResponse.dto";
import { Paginacion } from "../models/Paginacion";

export class VentaController {
  constructor(private readonly ventaService: VentaService) {}

  crear = async (req: Request, res: Response, next: NextFunction) => {
    try {
      /* AGREGAR CUANDO SE IMPLEMENTE AUTENTICACIÓN
      const userId = req.user?.id; 

      if (!userId) {
          return res.status(401).json({ message: "Usuario no autenticado" });
      }
      */

      const nuevaVenta = await this.ventaService.crearVenta(req.body);
      const respuesta = new VentaResponseDTO(nuevaVenta);

      return res.status(201).json({
        data: respuesta
      });

    } catch (error: unknown) {
      next(error);
    }
  };

  obtenerMuchas = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const paginacion = req.validatedQuery as Paginacion;
      const { data: ventas, total } = await this.ventaService.obtenerMuchas(paginacion);
        
      return res.status(200).json({
        data: ventas.map(v => new VentaResponseDTO(v)),
          metadata: {
            total,
            pagina: paginacion.page,
            paginasTotales: Math.ceil(total / paginacion.limit),
          }
      });
    } catch (error: unknown) {
      next(error);
    }
  }
}