import type {NextFunction, Request, Response} from "express";
import { IRecetaService } from "../services/interfaces/receta.service";

export class RecetaController {

    constructor(private readonly recetaService: IRecetaService) {}

    crear = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const createdBy = req.user!.id;
            const creada = await this.recetaService.crearReceta(req.body, createdBy);
            return res.status(201).json({success: true, data: creada});
        } catch (err) {
            next(err);
        }
    };
}
