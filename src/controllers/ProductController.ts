import type { Request, Response } from "express";
import { ProductService } from "../services/ProductService.js";
import { id } from "zod/locales";

export class  ProductController {

  constructor(private readonly productService: ProductService) {}

  actualizar = async (req: Request, res: Response) => {
    const {id: idParam} = req.params;

    if (!idParam || typeof idParam !== "string") {
      return res.status(400).json({ error: "ID invalido" });
    }

    const id = parseInt(idParam);
    const actualizado = await this.productService.actualizarProducto(id, req.body);

    if (!actualizado) {
      return res.status(404).json({ error: "No se pudo encontrar el producto" });
    }

    res.status(200).send(actualizado);
  }

  eliminar = async (req: Request, res: Response) => {
    const {id: idParam} = req.params;
    if (!idParam || typeof idParam !== "string") {
      return res.status(400).json({ error: "ID invalido" });
    }

    const id = parseInt(idParam);
    const eliminado = await this.productService.eliminarProducto(id);

    if (!eliminado) {
      return res.status(404).json({ error: "No se pudo eliminar el producto" });
    }

    res.status(200).send(eliminado);
  }

}
