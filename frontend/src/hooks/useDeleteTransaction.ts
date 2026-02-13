import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apolloClient } from "@/lib/graphql/apollo";
import { DELETE_TRANSACTION } from "@/lib/graphql/mutations/transactions";
import type { DeleteOutput } from "@/types";
import { toast } from "sonner";

type DeleteTransactionData = {
  deleteTransaction: DeleteOutput;
};

export function useDeleteTransaction() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { data } = await apolloClient.mutate<DeleteTransactionData>({
        mutation: DELETE_TRANSACTION,
        variables: { id },
      });

      if (!data?.deleteTransaction?.success) {
        throw new Error("Erro ao deletar transação");
      }

      return data.deleteTransaction;
    },
    onSuccess: () => {
      toast.success("Transação deletada com sucesso!");
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
    },
    onError: (error: Error) => {
      toast.error(
        error.message || "Erro ao deletar transação. Tente novamente."
      );
      console.error("Erro ao deletar transação:", error);
    },
  });
}
