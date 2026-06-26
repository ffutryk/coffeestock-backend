import type { NextFunction, Request, Response } from "express";
import type { IRecetaService } from "../services/interfaces/receta.service";
import { RecetaResponseDTO } from "../dtos/receta/response.dto";
export class RecetaController {
  constructor(private readonly recetaService: IRecetaService) {}

  crear = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const creadas = await this.recetaService.crearReceta(req.body);

      return res.status(201).json({
        success: true,
        data: RecetaResponseDTO.fromMany(creadas),
      });
    } catch (err) {
      next(err);
    }
  };
}
