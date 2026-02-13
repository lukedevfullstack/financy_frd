import { useQuery } from "@tanstack/react-query";
import { apolloClient } from "@/lib/graphql/apollo";
import { GET_CATEGORY } from "@/lib/graphql/queries/categories";
import type { Category } from "@/types";

type CategoryQueryData = {
  category: Category;
};

interface UseCategoryParams {
  id: string;
  enabled?: boolean;
}

export function useCategory({ id, enabled = true }: UseCategoryParams) {
  return useQuery({
    queryKey: ["category", id],
    queryFn: async () => {
      const { data } = await apolloClient.query<CategoryQueryData>({
        query: GET_CATEGORY,
        variables: { id },
        fetchPolicy: "network-only",
      });

      if (!data?.category) {
        throw new Error("Categoria não encontrada");
      }

      return data.category;
    },
    enabled: enabled && !!id,
  });
}
