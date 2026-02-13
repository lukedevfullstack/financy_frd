import { z } from "zod";

export const transactionSchema = z.object({
  description: z
    .string()
    .min(1, "A descrição é obrigatória")
    .min(3, "A descrição deve ter no mínimo 3 caracteres")
    .max(100, "A descrição deve ter no máximo 100 caracteres"),
  amount: z
    .number()
    .positive("O valor deve ser maior que zero")
    .min(0.01, "O valor mínimo é R$ 0,01"),
  type: z.enum(["INCOME", "EXPENSE"]),
  date: z.string().min(1, "A data é obrigatória"),
  categoryId: z.string().optional().or(z.literal("")),
});

export type TransactionFormData = z.infer<typeof transactionSchema>;
