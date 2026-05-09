import type { Request, Response } from "express";
import { VentaService } from "../services/VentaService";
import { CrearVentaSchema } from "../dtos/venta.dto";

export class VentaController {
  constructor(private readonly ventaService: VentaService) {}

  crear = async (req: Request, res: Response) => {
    try {
      const datosValidados = CrearVentaSchema.parse(req.body);
      const nuevaVenta = await this.ventaService.crearVenta(datosValidados);

      return res.status(201).json({
        mensaje: "Venta creada con éxito",
        data: nuevaVenta,
        total: nuevaVenta.getPrecioTotal()
      });

    } catch (error: any) {
      if (error.name === "ZodError") {
        return res.status(400).json({
          error: "Error de validación",
          detalles: error.errors
        });
      }
      return res.status(500).json({ error: "No se pudo crear la venta. Vuelve a intentarlo." });

      // next(error); si implementamos un middleware de manejo de errores global.
    }
  };
}