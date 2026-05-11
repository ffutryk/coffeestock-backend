import type { NextFunction, Request, Response } from "express";
import { ProductService } from "../services/ProductService";
import { BadRequestError } from "../errors";

const MOCK_USER_ID = 1;

export class ProductController {
  constructor(private readonly productService: ProductService) {}

  crear = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const creado = await this.productService.crearProducto(req.body, MOCK_USER_ID);
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
      const producto = await this.productService.verProducto(id);
      return res.status(200).json(producto);
    } catch (err) {
      next(err);
    }
  };

  listar = async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const productos = await this.productService.listarProductos();
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
      const actualizado = await this.productService.actualizarProducto(id, req.body, 1 /*Id de prueba*/);

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
      await this.productService.eliminarProducto(id, 2 /*Id de prueba*/ );

      return res.status(200).json({
        success: true,
        message: "El producto fue eliminado correctamente",
      });
    } catch (err) {
      next(err);
    }
  };
}
