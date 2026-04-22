import { z } from "zod";

export const herbSchema = z.object({
  name: z
    .string()
    .min(2, "El nombre debe tener al menos 2 caracteres")
    .max(100, "El nombre no puede exceder 100 caracteres"),
  description: z
    .string()
    .min(10, "La descripción debe tener al menos 10 caracteres"),
  img: z
    .string()
    .url("Debe ser una URL válida"),
  usageMethod: z
    .string()
    .min(5, "Los síntomas deben tener al menos 5 caracteres"),
  // CORRECCIÓN AQUÍ: Cambiamos required_error por invalid_type_error
});

export type HerbValues = z.infer<typeof herbSchema>;