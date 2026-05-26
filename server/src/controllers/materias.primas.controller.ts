import { Request, Response } from "express";
import { NextFunction } from "express-serve-static-core";
import { IMateriasPrimasService } from "../services/interfaces/materias.primas.service";
import { MateriaPrima } from "../models/entities/materiaPrima";

class MateriasPrimasController {
  constructor(private readonly materiasPrimasService: IMateriasPrimasService) {}

  crearMateriaPrima = async (req: Request, res: Response, next: NextFunction) => {
    try {
      return await this.materiasPrimasService.crearMateriaPrima(req.body);
    } catch (err) {
      next(err);
    }
  };
}

export default MateriasPrimasController;
