import type { NextFunction, Request, Response } from "express";
import { InventarioService } from "../services/inventario.service";

export class InventarioController {

  constructor(private readonly inventarioService: InventarioService) {}

  registrarMovimiento = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const inventario = await this.inventarioService.registrarMovimiento(req.body, "usuarioDePrueba");

      const user = (req as any).user.username || "usuarioDePrueba";
      return res.status(200).json(inventario);
    } catch (err) {
      next(err);
    }
  }

}
