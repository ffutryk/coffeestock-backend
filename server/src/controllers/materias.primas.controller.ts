import { Request, Response } from "express";
import { NextFunction } from "express-serve-static-core";
import { IMateriasPrimasService } from "../services/interfaces/materias.primas.service";

class MateriasPrimasController {
  constructor(private readonly materiasPrimasService: IMateriasPrimasService) {}

  crearMateriaPrima = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.materiasPrimasService.crearMateriaPrima(req.body);

      res.status(201).json(result);
    } catch (err) {
      next(err);
    }
  };
}

export default MateriasPrimasController;
