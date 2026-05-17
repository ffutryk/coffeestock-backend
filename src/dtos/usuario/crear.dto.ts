import z from "zod";

export const CrearUsuarioSchema = z
  .object({
    cuil: z.string().regex(/^\d{2}-\d{8}-\d{1}$/,
        "El CUIL ingresado no tiene un formato válido",),
    nombre: z.string().min(1, "El nombre es obligatorio"),
    apellido: z.string().min(1, "El apellido es obligatorio"),
    email: z.string().email("El email ingresado no tiene un formato válido"),
    password: z.string().min(8, "La contraseña debe tener al menos 8 caracteres"),
  })
  .strict();

export type CrearUsuarioDTO = z.infer<typeof CrearUsuarioSchema>;