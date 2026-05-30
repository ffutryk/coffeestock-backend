import z from "zod";

export const PaginacionQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(50),
});

export type PaginacionDTO = z.infer<typeof PaginacionQuerySchema>;
