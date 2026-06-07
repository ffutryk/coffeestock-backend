import { z } from "zod";

export const CrearComboSchema = z
    .object({
        nombre: z.string().min(1, "El nombre es obligatorio"),
        precio: z.number().positive("El precio debe ser mayor a 0"),
        items: z.array(z
            .object({
                productoId: z.number().int().positive(), 
                cantidad: z.number().int().positive()
            })
        ).min(2, "El combo debe tener al menos 2 productos")
    });

export type CrearComboDTO = z.infer<typeof CrearComboSchema>;