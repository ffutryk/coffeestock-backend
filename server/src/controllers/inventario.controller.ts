import type { NextFunction, Request, Response } from "express";
import { InventarioService } from "../services/inventario.service";

export class InventarioController {

  constructor(private readonly inventarioService: InventarioService) {}

  obtenerInventario = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const inventario = await this.inventarioService.obtenerInventario();
      const formattedInventario = inventario.map(item => ({
        ...item,
        stockActual: Number(item.stockActual),
        stockMinimo: Number(item.stockMinimo)
      }));
      return res.status(200).json(formattedInventario);
    } catch (err) {
      next(err);
    }
  }

  registrarMovimiento = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user!.id.toString();
      const inventario = await this.inventarioService.registrarMovimiento(req.body, userId);

      return res.status(200).json(inventario);
    } catch (err) {
      next(err);
    }
  }

}
