import { z } from "zod";
import { MedioDePago } from "../../models/enums/medio-de-pago";

export const CrearItemVentaSchema = z.object({
  productoId: z.number().int().positive("ID de producto inválido"),
  cantidad: z.number().int().positive("La cantidad debe ser mayor a 0"),
});

export const CrearVentaSchema = z.object({
  medioDePago: z.enum(MedioDePago, "Medio de pago inválido"),
  items: z.array(CrearItemVentaSchema).min(1, "Debe haber al menos un item"),
});

export type CrearVentaDTO = z.infer<typeof CrearVentaSchema>;
export type CrearItemVentaDTO = z.infer<typeof CrearItemVentaSchema>;
