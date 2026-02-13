import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apolloClient } from "@/lib/graphql/apollo";
import { UPDATE_CATEGORY } from "@/lib/graphql/mutations/categories";
import type { UpdateCategoryInput, Category } from "@/types";
import { toast } from "sonner";

type UpdateCategoryData = {
  updateCategory: Category;
};

interface UpdateCategoryParams {
  id: string;
  data: UpdateCategoryInput;
}

export function useUpdateCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: UpdateCategoryParams) => {
      const { data: result } = await apolloClient.mutate<UpdateCategoryData>({
        mutation: UPDATE_CATEGORY,
        variables: { id, data },
      });

      if (!result?.updateCategory) {
        throw new Error("Erro ao atualizar categoria");
      }

      return result.updateCategory;
    },
    onSuccess: (data) => {
      toast.success("Categoria atualizada com sucesso!");
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      queryClient.invalidateQueries({ queryKey: ["category", data.id] });
      queryClient.invalidateQueries({ queryKey: ["categoryStats"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
    },
    onError: (error: Error) => {
      toast.error(
        error.message || "Erro ao atualizar categoria. Tente novamente."
      );
      console.error("Erro ao atualizar categoria:", error);
    },
  });
}
