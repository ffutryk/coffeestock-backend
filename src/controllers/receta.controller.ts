import type {NextFunction, Request, Response} from "express";
import { IRecetaService } from "../services/interfaces/receta.service";

const MOCK_USER_ID = 1;

export class RecetaController {

    constructor(private readonly recetaService: IRecetaService) {}

    crear = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const creada = await this.recetaService.crearReceta(req.body, MOCK_USER_ID);
            return res.status(201).json({success: true, data: creada});
        } catch (err) {
            next(err);
        }
    };
}