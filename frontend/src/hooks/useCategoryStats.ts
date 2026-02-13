import { useQuery } from "@tanstack/react-query";
import { apolloClient } from "@/lib/graphql/apollo";
import { GET_CATEGORY_STATS } from "@/lib/graphql/queries/categories";
import type { CategoryStatsData } from "@/types";

type CategoryStatsQueryData = {
  categoryStats: CategoryStatsData;
};

export function useCategoryStats() {
  return useQuery({
    queryKey: ["categoryStats"],
    queryFn: async () => {
      const { data } = await apolloClient.query<CategoryStatsQueryData>({
        query: GET_CATEGORY_STATS,
        fetchPolicy: "network-only",
      });

      if (!data?.categoryStats) {
        throw new Error("Erro ao buscar estatísticas de categorias");
      }

      return data.categoryStats;
    },
  });
}
