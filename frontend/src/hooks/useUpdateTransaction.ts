import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apolloClient } from "@/lib/graphql/apollo";
import { UPDATE_TRANSACTION } from "@/lib/graphql/mutations/transactions";
import type { UpdateTransactionInput, Transaction } from "@/types";
import { toast } from "sonner";

type UpdateTransactionData = {
  updateTransaction: Transaction;
};

interface UpdateTransactionParams {
  id: string;
  data: UpdateTransactionInput;
}

export function useUpdateTransaction() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: UpdateTransactionParams) => {
      const { data: result } = await apolloClient.mutate<UpdateTransactionData>(
        {
          mutation: UPDATE_TRANSACTION,
          variables: { id, data },
        }
      );

      if (!result?.updateTransaction) {
        throw new Error("Erro ao atualizar transação");
      }

      return result.updateTransaction;
    },
    onSuccess: (data) => {
      toast.success("Transação atualizada com sucesso!");
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      queryClient.invalidateQueries({ queryKey: ["transaction", data.id] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
    },
    onError: (error: Error) => {
      toast.error(
        error.message || "Erro ao atualizar transação. Tente novamente."
      );
      console.error("Erro ao atualizar transação:", error);
    },
  });
}
