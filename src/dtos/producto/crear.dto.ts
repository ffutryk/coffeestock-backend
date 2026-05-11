import z from "zod";
import { TipoItemVenta } from "../../models/enums/tipo-item-venta";

export const CrearProductoSchema = z
  .object({
    nombre: z.string().min(3, "El nombre es muy corto").optional(),
    descripcion: z.string().optional(),
    stock: z.number().int().min(0, "El stock no puede ser negativo").nullable().optional(),
    precio: z.number().min(0, "El precio no puede ser negativo").optional(),
    tipo: z.enum(TipoItemVenta),
    sinTacc: z.boolean().optional(),
  })
  .strict();

export type CrearProductoDTO = z.infer<typeof CrearProductoSchema>;
