import type { NextFunction, Request, Response } from "express";
import { ProductoService } from "../services/producto.service";
import { BadRequestError } from "../errors";

export class ProductoController {
  constructor(private readonly productoService: ProductoService) {}

  crear = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const creado = await this.productoService.crearProducto(req.body, req.user!.id);
      return res.status(201).json(creado);
    } catch (err) {
      next(err);
    }
  };

  ver = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id: idParam } = req.params;
      if (!idParam || typeof idParam !== "string") {
        throw new BadRequestError("ID invalido");
      }
      const id = parseInt(idParam);
      if (isNaN(id)) {
        throw new BadRequestError("ID invalido");
      }
      const producto = await this.productoService.verProducto(id);
      return res.status(200).json(producto);
    } catch (err) {
      next(err);
    }
  };

  listar = async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const productos = await this.productoService.listarProductos();
      return res.status(200).json(productos);
    } catch (err) {
      next(err);
    }
  };

  actualizar = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id: idParam } = req.params;

      if (!idParam || typeof idParam !== "string") {
        throw new BadRequestError("ID invalido");
      }

      const id = parseInt(idParam);
      const actualizado = await this.productoService.actualizarProducto(
        id,
        req.body,
        req.user!.id,
      );

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
        throw new BadRequestError("ID invalido");
      }

      const id = parseInt(idParam);
      await this.productoService.eliminarProducto(id, req.user!.id);

      return res.status(200).json({
        success: true,
        message: "El producto fue eliminado correctamente",
      });
    } catch (err) {
      next(err);
    }
  };
}
