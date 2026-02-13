import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apolloClient } from "@/lib/graphql/apollo";
import { DELETE_CATEGORY } from "@/lib/graphql/mutations/categories";
import type { DeleteOutput } from "@/types";
import { toast } from "sonner";

type DeleteCategoryData = {
  deleteCategory: DeleteOutput;
};

export function useDeleteCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { data } = await apolloClient.mutate<DeleteCategoryData>({
        mutation: DELETE_CATEGORY,
        variables: { id },
      });

      if (!data?.deleteCategory?.success) {
        throw new Error("Erro ao deletar categoria");
      }

      return data.deleteCategory;
    },
    onSuccess: () => {
      toast.success("Categoria deletada com sucesso!");
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      queryClient.invalidateQueries({ queryKey: ["categoryStats"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
    },
    onError: (error: Error) => {
      toast.error(
        error.message || "Erro ao deletar categoria. Tente novamente."
      );
      console.error("Erro ao deletar categoria:", error);
    },
  });
}
