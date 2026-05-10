import { z } from 'zod';
import { MedioDePago } from '../models/MedioDePago';

export const CrearItemVentaSchema = z.object({
  productoId: z.number().int().positive("ID de producto inválido"),
  cantidad: z.number().int().positive("La cantidad debe ser mayor a 0"),
});

export const CrearVentaSchema = z.object({
  medioDePago: z.enum(MedioDePago, "Medio de pago inválido"),
  items: z.array(CrearItemVentaSchema).min(1, "Debe haber al menos un item"),
});

export const ActualizarVentaSchema = z.object({
  medioDePago: z.enum(MedioDePago).optional(),
  items: z.array(z.object({
    productoId: z.number().int().positive(),
    cantidad: z.number().int().positive(),
  })).min(1).optional(),
});

export type ActualizarVentaDTO = z.infer<typeof ActualizarVentaSchema>;
export type CrearVentaDTO = z.infer<typeof CrearVentaSchema>;
export type CrearItemVentaDTO = z.infer<typeof CrearItemVentaSchema>;