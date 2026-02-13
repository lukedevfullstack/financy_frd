import { z } from "zod";

export const categorySchema = z.object({
  name: z
    .string()
    .min(1, "O título é obrigatório")
    .min(3, "O título deve ter no mínimo 3 caracteres")
    .max(50, "O título deve ter no máximo 50 caracteres"),
  description: z
    .string()
    .max(200, "A descrição deve ter no máximo 200 caracteres")
    .optional()
    .or(z.literal("")),
  icon: z.string().min(1, "Selecione um ícone"),
  color: z.string().min(1, "Selecione uma cor"),
});

export type CategoryFormData = z.infer<typeof categorySchema>;
