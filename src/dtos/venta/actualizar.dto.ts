import z from "zod";
import { MedioDePago } from "../../models/enums/medio-de-pago";

export const ActualizarVentaSchema = z.object({
  medioDePago: z.enum(MedioDePago).optional(),
  items: z
    .array(
      z.object({
        productoId: z.number().int().positive(),
        cantidad: z.number().int().positive(),
      }),
    )
    .min(1)
    .optional(),
});

export type ActualizarVentaDTO = z.infer<typeof ActualizarVentaSchema>;
