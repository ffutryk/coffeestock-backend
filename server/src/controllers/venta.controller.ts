import type { Request, Response, NextFunction } from "express";
import { VentaService } from "../services/venta.service";
import { VentaResponseDTO } from "../dtos/venta/response.dto";
import { PaginacionDTO } from "../dtos/paginacion.dto";

export class VentaController {
  constructor(private readonly ventaService: VentaService) {}

  crear = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const nuevaVenta = await this.ventaService.crearVenta(req.body);
      const respuesta = new VentaResponseDTO(nuevaVenta);

      return res.status(201).json({
        message: "Venta registrada exitosamente",
        data: respuesta,
      });
    } catch (error: unknown) {
      next(error);
    }
  };

  actualizar = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = parseInt(req.params.id as string);
      const ventaActualizada = await this.ventaService.actualizarVenta(id, req.body);
      const respuesta = new VentaResponseDTO(ventaActualizada);

      return res.status(200).json({
        message: "Venta modificada exitosamente",
        data: respuesta,
      });
    } catch (error: unknown) {
      next(error);
    }
  };

  obtenerMuchas = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const paginacion = req.validatedQuery as PaginacionDTO;
      const { data: ventas, total } = await this.ventaService.obtenerMuchas(paginacion);

      return res.status(200).json({
        data: ventas.map((v) => new VentaResponseDTO(v)),
        metadata: {
          total,
          pagina: paginacion.page,
          paginasTotales: Math.ceil(total / paginacion.limit),
        },
      });
    } catch (error: unknown) {
      next(error);
    }
  };

  eliminar = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = parseInt(req.params.id as string);
      const resultado = await this.ventaService.eliminar(id);

      return res.status(200).json({
        message: "Venta eliminada exitosamente",
        data: resultado,
      });
    } catch (error: unknown) {
      next(error);
    }
  };
}
