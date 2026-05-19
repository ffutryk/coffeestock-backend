import z from "zod";
import { UnidadDeMedida } from "../../models/enums/unidad-de-medida";

export const CrearMateriaPrimaSchema = z
  .object({
    nombre: z.string(),
    marca: z.string(),
    unidadMedida: z.enum(UnidadDeMedida),
    cantidadPorUnidad: z.int().positive(),
    stock: z.int().positive(),
  })
  .strict();

export type CrearMateriaPrimaDTO = z.infer<typeof CrearMateriaPrimaSchema>;
