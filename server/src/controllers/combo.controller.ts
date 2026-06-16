import type { Request, Response, NextFunction } from "express";
import type { IComboService } from "../services/interfaces/combo.service";

export class ComboController {
  constructor(private readonly comboService: IComboService) {}
  crear = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const combo = await this.comboService.crearCombo(req.body);
      return res.status(201).json({ success: true, data: combo });
    } catch (err) {
      next(err);
    }
  };

  listar = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const combos = await this.comboService.listarCombos();
      return res.status(200).json({ success: true, data: combos });
    } catch (err) {
      next(err);
    }
  };

  actualizar = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const comboActualizado = await this.comboService.actualizarCombo(
        Number(req.params.id),
        req.body,
      );
      return res.status(200).json({ success: true, data: comboActualizado });
    } catch (err) {
      next(err);
    }
  };

  obtenerPorId = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const combo = await this.comboService.obtenerPorId(Number(req.params.id));
      return res.status(200).json({ success: true, data: combo });
    } catch (err) {
      next(err);
    }
  };

  eliminar = async (req: Request, res: Response, next: NextFunction) => {
    try {
      await this.comboService.eliminarCombo(Number(req.params.id));
      return res.status(204).send();
    } catch (err) {
      next(err);
    }
  };
}
