import { z } from 'zod';
import { TipoItemVenta } from "../models/TipoItemVenta";

export const CrearItemVentaSchema = z.object({
  nombre: z.string().min(1, "El nombre del item de venta es requerido"),
  cantidad: z.number().int().positive("La cantidad debe ser mayor a 0"),
  precio: z.number().positive("El precio debe ser mayor a 0"),
  tipo: z.nativeEnum(TipoItemVenta)
});

export const CrearVentaSchema = z.object({
  medioDePago: z.string().min(1, "El medio de pago es requerido"),
  createdBy: z.number().int(),
  items: z.array(CrearItemVentaSchema).min(1, "Debe haber al menos un item en la venta"),
});

export type CrearVentaDTO = z.infer<typeof CrearVentaSchema>;
export type CrearItemVentaDTO = z.infer<typeof CrearItemVentaSchema>;