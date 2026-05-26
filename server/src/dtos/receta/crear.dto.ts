import z from "zod";

export const IngredienteSchema = z
    .object({
        idMateriaPrima: z.number().int(),
        cantidad: z.number().positive("La cantidad debe ser mayor a 0"),
    });

export const CrearRecetaSchema = z
    .object({
        idProducto: z.number().int(),
        ingredientes: z.array(IngredienteSchema).min(1, "Debe enviar al menos un ingrediente"),
    });

export type CrearRecetaDTO = z.infer<typeof CrearRecetaSchema>;