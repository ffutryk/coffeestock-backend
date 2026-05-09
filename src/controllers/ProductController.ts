import type { NextFunction, Request, Response } from "express";
import { ProductService } from "../services/ProductService.js";

export class ProductController {
  constructor(private readonly productService: ProductService) {}

  actualizar = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id: idParam } = req.params;

      if (!idParam || typeof idParam !== "string") {
        return res.status(400).json({ error: "ID invalido" });
      }

      const id = parseInt(idParam);
      const actualizado = await this.productService.actualizarProducto(id, req.body, "UsuarioDePrueba");

      return res.status(200).send(actualizado);
    } catch (err) {
      next(err);
    }
  };

  // uso el nextFunction como en actualizar
  eliminar = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id: idParam } = req.params;

      if (!idParam || typeof idParam !== "string") {
        return res.status(400).json({ error: "ID invalido" });
      }

      const id = parseInt(idParam);
      await this.productService.eliminarProducto(id, "alguienDePrueba");

      return res.status(200).json({
        success: true,
        message: "El producto fue eliminado correctamente",
      });
    } catch (err) {
      next(err);
    }
  };
}
