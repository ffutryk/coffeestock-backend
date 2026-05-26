import { z } from "zod";

export const RegistrarMovimientoInventario = z
  .object({
    idMateriaPrima: z.number().int().positive("ID de la materia prima invalido"),
    cantidad: z.number().refine((n) => n !== 0, "La cantidad no puede ser cero"), // !==0 porque  se puede aumentar el stock o decrementar el stock
    motivo: z.enum(["compra", "uso", "descarte", "correccion"], {
      // no le pongo acento a correccion porque es un valor que se va a guardar en la base de datos y es mejor evitar acentos en esos casos
      error: "Motivo debe ser 'compra', 'uso', 'descarte' o 'correccion'",
    }),

    nota: z.string().max(255).optional(),
  })
  .strict();

export type RegistrarMovimientoDTO = z.infer<typeof RegistrarMovimientoInventario>;
