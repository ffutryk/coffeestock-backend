import type { NextFunction, Request, Response } from "express";
import { ProductoService } from "../services/producto.service";
import { BadRequestError } from "../errors";
import { PaginacionQuerySchema } from "../dtos/paginacion.dto";
import { ProductoResponseDTO } from "../dtos/producto/response.dto";

export class ProductoController {
  constructor(private readonly productoService: ProductoService) {}

  crear = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const creado = await this.productoService.crearProducto(req.body);
      return res.status(201).json(ProductoResponseDTO.from(creado));
    } catch (err) {
      next(err);
    }
  };

  ver = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = this.parseId(req.params.id);
      const producto = await this.productoService.verProducto(id);
      return res.status(200).json(ProductoResponseDTO.from(producto));
    } catch (err) {
      next(err);
    }
  };

  listar = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const paginacion =
        Object.keys(req.query).length > 0 ? PaginacionQuerySchema.parse(req.query) : undefined;

      const resultado = await this.productoService.listarProductos(paginacion);

      if (Array.isArray(resultado)) {
        return res.status(200).json(ProductoResponseDTO.fromMany(resultado));
      }

      return res.status(200).json({
        ...resultado,
        data: ProductoResponseDTO.fromMany(resultado.data),
      });
    } catch (err) {
      next(err);
    }
  };

  actualizar = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = this.parseId(req.params.id);
      const actualizado = await this.productoService.actualizarProducto(id, req.body);
      return res.status(200).json(ProductoResponseDTO.from(actualizado!));
    } catch (err) {
      next(err);
    }
  };

  eliminar = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = this.parseId(req.params.id);
      await this.productoService.eliminarProducto(id);
      return res.status(200).json({
        success: true,
        message: "El producto fue eliminado correctamente",
      });
    } catch (err) {
      next(err);
    }
  };

  private parseId(param: string | string[] | undefined): number {
    const raw = Array.isArray(param) ? param[0] : param;
    if (!raw) throw new BadRequestError("ID inválido");
    const id = parseInt(raw, 10);
    if (isNaN(id)) throw new BadRequestError("ID inválido");
    return id;
  }
}
