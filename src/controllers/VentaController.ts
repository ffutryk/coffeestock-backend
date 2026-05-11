import type { Request, Response, NextFunction } from "express";
import { VentaService } from "../services/VentaService";
import { VentaResponseDTO } from "../dtos/ventaResponse.dto";
import { Paginacion } from "../models/types/paginacion";

export class VentaController {
  constructor(private readonly ventaService: VentaService) {}

  crear = async (req: Request, res: Response, next: NextFunction) => {
    try {
      /* AGREGAR CUANDO SE IMPLEMENTE AUTENTICACIÓN
      const userId = req.user?.id;

      if (!userId) {
          return res.status(401).json({ message: "Usuario no autenticado" });
      }
      */
      const userId = 1;
      const nuevaVenta = await this.ventaService.crearVenta(req.body, userId);
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

      /* AGREGAR CUANDO SE IMPLEMENTE AUTENTICACIÓN
      const userId = req.user?.id;
      if (!userId) {
          return res.status(401).json({ message: "Usuario no autenticado" });
      }
      */
      const userId = 1;
      const ventaActualizada = await this.ventaService.actualizarVenta(id, req.body, userId);
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
      const paginacion = req.validatedQuery as Paginacion;
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
      const deletedBy = 1; // Cambiar a userId cuando se implemente autenticación
      const resultado = await this.ventaService.eliminar(id, deletedBy);

      return res.status(200).json({
        message: "Venta eliminada exitosamente",
        data: resultado,
      });
    } catch (error: unknown) {
      next(error);
    }
  };
}
