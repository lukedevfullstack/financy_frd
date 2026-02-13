import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apolloClient } from "@/lib/graphql/apollo";
import { CREATE_TRANSACTION } from "@/lib/graphql/mutations/transactions";
import type { CreateTransactionInput, Transaction } from "@/types";
import { toast } from "sonner";

type CreateTransactionData = {
  createTransaction: Transaction;
};

export function useCreateTransaction() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateTransactionInput) => {
      const { data: result } = await apolloClient.mutate<CreateTransactionData>(
        {
          mutation: CREATE_TRANSACTION,
          variables: { data },
        }
      );

      if (!result?.createTransaction) {
        throw new Error("Erro ao criar transação");
      }

      return result.createTransaction;
    },
    onSuccess: () => {
      toast.success("Transação criada com sucesso!");
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
    },
    onError: (error: Error) => {
      toast.error(
        error.message || "Erro ao criar transação. Tente novamente."
      );
      console.error("Erro ao criar transação:", error);
    },
  });
}
