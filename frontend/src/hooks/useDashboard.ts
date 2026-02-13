import { useQuery } from "@tanstack/react-query";
import { apolloClient } from "@/lib/graphql/apollo";
import { GET_DASHBOARD } from "@/lib/graphql/queries/dashboard";
import type { DashboardData, DashboardQueryVariables } from "@/types";

type DashboardQueryData = {
  dashboard: DashboardData;
};

export function useDashboard() {
  const currentDate = new Date();
  const month = currentDate.getMonth() + 1; // JavaScript months are 0-indexed
  const year = currentDate.getFullYear();

  return useQuery({
    queryKey: ["dashboard", month, year],
    queryFn: async () => {
      const { data } = await apolloClient.query<
        DashboardQueryData,
        DashboardQueryVariables
      >({
        query: GET_DASHBOARD,
        variables: {
          month,
          year,
        },
        fetchPolicy: "network-only",
      });

      if (!data?.dashboard) {
        throw new Error("Erro ao buscar dados do dashboard");
      }

      return data.dashboard;
    },
  });
}
