import type { Request, Response, NextFunction } from "express";
import { VentaService } from "../services/VentaService";
import { VentaResponseDTO } from "../dtos/ventaResponse.dto";

export class VentaController {
  constructor(private readonly ventaService: VentaService) {}

  crear = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const nuevaVenta = await this.ventaService.crearVenta(req.body);
      const respuesta = new VentaResponseDTO(nuevaVenta);

      return res.status(201).json({
        data: respuesta
      });

    } catch (error: unknown) {
      next(error);
    }
  };
}