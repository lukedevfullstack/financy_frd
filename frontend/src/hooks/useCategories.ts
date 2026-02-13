import { useQuery } from "@tanstack/react-query";
import { apolloClient } from "@/lib/graphql/apollo";
import { GET_CATEGORIES } from "@/lib/graphql/queries/categories";
import type { Category } from "@/types";

type CategoriesQueryData = {
  categories: Category[];
};

export function useCategories() {
  return useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const { data } = await apolloClient.query<CategoriesQueryData>({
        query: GET_CATEGORIES,
        fetchPolicy: "network-only",
      });

      if (!data?.categories) {
        throw new Error("Erro ao buscar categorias");
      }

      return data.categories;
    },
  });
}
