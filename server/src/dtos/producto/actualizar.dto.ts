import z from "zod";
import { IngredienteSchema } from "../receta/crear.dto";

export const ActualizarProductoSchema = z
  .object({
    nombre: z.string().min(3, "El nombre es muy corto").optional(),
    descripcion: z.string().optional(),
    stock: z.number().int().min(0, "El stock no puede ser negativo").nullable().optional(),
    precio: z.number().min(0, "El precio no puede ser negativo").optional(),
    sinTacc: z.boolean().optional(),
    ingredientes: z.array(IngredienteSchema).optional(),
  })
  .strict();

export type ActualizarProductoDTO = z.infer<typeof ActualizarProductoSchema>;
