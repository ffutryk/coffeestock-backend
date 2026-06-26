import { z } from "zod";

export const FiltrarEstadisticasVentasSchema = z.object({
  fechaInicio: z.string().optional().refine(val => {
    if (!val) return true;
    return !isNaN(Date.parse(val));
  }, { message: "Formato de fechaInicio inválido" }),
  fechaFin: z.string().optional().refine(val => {
    if (!val) return true;
    return !isNaN(Date.parse(val));
  }, { message: "Formato de fechaFin inválido" }),
}).superRefine((data, ctx) => {
  if (data.fechaInicio && data.fechaFin) {
    const inicio = new Date(data.fechaInicio);
    const fin = new Date(data.fechaFin);
    if (inicio > fin) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "fechaInicio no puede ser posterior a fechaFin",
        path: ["fechaInicio"]
      });
    }
  }
});

export type FiltrarEstadisticasVentasDTO = z.infer<typeof FiltrarEstadisticasVentasSchema>;
