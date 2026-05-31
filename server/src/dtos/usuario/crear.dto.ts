import z from "zod";

const validarCUIL = (cuil: string): boolean => {
  const base = [5, 4, 3, 2, 7, 6, 5, 4, 3, 2];

  const suma = cuil
    .replaceAll("-", "")
    .split("")
    .map(Number)
    .slice(0, 10)
    .reduce((acc, n, i) => acc + n * base[i]!, 0);

  let dv = 11 - (suma % 11);

  if (dv === 11) dv = 0;
  if (dv === 10) dv = 9;

  return dv === Number(cuil[12]);
};

export const CrearUsuarioSchema = z
  .object({
    cuil: z
      .string()
      .regex(/^\d{2}-\d{8}-\d{1}$/, "El CUIL ingresado no tiene un formato válido")
      .refine(validarCUIL, {
        message: "El CUIL ingresado no es válido",
      }),
    nombre: z.string().min(1, "El nombre es obligatorio"),
    apellido: z.string().min(1, "El apellido es obligatorio"),
    email: z.string().email("El email ingresado no tiene un formato válido"),
    password: z.string().min(8, "La contraseña debe tener al menos 8 caracteres"),
  })
  .strict();

export type CrearUsuarioDTO = z.infer<typeof CrearUsuarioSchema>;
