import { z } from 'zod';

export const CrearItemVentaSchema = z.object({
  productoId: z.number().int().positive("ID de producto inválido"),
  cantidad: z.number().int().positive("La cantidad debe ser mayor a 0"),
});

export const CrearVentaSchema = z.object({
  medioDePago: z.string().min(1, "El medio de pago es requerido"),
  createdBy: z.number().int(),
  items: z.array(CrearItemVentaSchema).min(1, "Debe haber al menos un item"),
});

export type CrearVentaDTO = z.infer<typeof CrearVentaSchema>;
export type CrearItemVentaDTO = z.infer<typeof CrearItemVentaSchema>;