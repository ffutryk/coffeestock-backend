import z from "zod";
import { TipoItemVenta } from "../../models/enums/tipo-item-venta";
import { IngredienteSchema } from "../receta/crear.dto";

export const CrearProductoSchema = z
  .object({
    nombre: z.string().min(3, "El nombre es muy corto"),
    descripcion: z.string().optional(),
    stock: z.number().int().min(0, "El stock no puede ser negativo").nullish(),
    precio: z.number().min(0, "El precio no puede ser negativo"),
    tipo: z.enum(TipoItemVenta),
    sinTacc: z.boolean().optional(),
    ingredientes: z.array(IngredienteSchema).optional(),
  })
  .strict();

export type CrearProductoDTO = z.infer<typeof CrearProductoSchema>;
