import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apolloClient } from "@/lib/graphql/apollo";
import { CREATE_CATEGORY } from "@/lib/graphql/mutations/categories";
import type { CreateCategoryInput, Category } from "@/types";
import { toast } from "sonner";

type CreateCategoryData = {
  createCategory: Category;
};

export function useCreateCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateCategoryInput) => {
      const { data: result } = await apolloClient.mutate<CreateCategoryData>({
        mutation: CREATE_CATEGORY,
        variables: { data },
      });

      if (!result?.createCategory) {
        throw new Error("Erro ao criar categoria");
      }

      return result.createCategory;
    },
    onSuccess: () => {
      toast.success("Categoria criada com sucesso!");
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      queryClient.invalidateQueries({ queryKey: ["categoryStats"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
    },
    onError: (error: Error) => {
      toast.error(
        error.message || "Erro ao criar categoria. Tente novamente."
      );
      console.error("Erro ao criar categoria:", error);
    },
  });
}
