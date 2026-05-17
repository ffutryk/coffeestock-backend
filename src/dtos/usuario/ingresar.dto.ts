import z from "zod";

export const IngresarUsuarioSchema = z
  .object({
    email: z.email("El email ingresado no tiene un formato válido"),
    contraseña: z.string().min(8, "La contraseña debe tener al menos 8 caracteres"),
  })
  .strict();

export type IngresarUsuarioDTO = z.infer<typeof IngresarUsuarioSchema>;
