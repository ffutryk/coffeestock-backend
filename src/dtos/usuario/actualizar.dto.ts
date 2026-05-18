import z from "zod";
import { RolUsuario } from "../../models/enums/rolUsuario";

export const ActualizarUsuarioSchema = z
    .object({
        cuil: z.string().regex(/^\d{2}-\d{8}-\d$/, "CUIL inválido").optional(),
        nombre: z.string().min(2).optional(),
        apellido: z.string().min(2).optional(),
        email: z.email("Email inválido").optional(),
        password: z.string().min(8, "La contraseña debe tener al menos 8 caracteres").optional(),
        rol: z.enum(RolUsuario).optional()
    })
    .strict();

export type ActualizarUsuarioDTO = z.infer<typeof ActualizarUsuarioSchema>;