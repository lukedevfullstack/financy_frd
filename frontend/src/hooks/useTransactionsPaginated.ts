import { useQuery } from "@tanstack/react-query";
import { apolloClient } from "@/lib/graphql/apollo";
import { GET_TRANSACTIONS_PAGINATED } from "@/lib/graphql/queries/transactions";
import type {
  PaginatedTransactions,
  TransactionFilterInput,
  TransactionPaginationInput,
} from "@/types";

type TransactionsPaginatedQueryData = {
  transactionsPaginated: PaginatedTransactions;
};

interface UseTransactionsPaginatedParams {
  filters?: TransactionFilterInput;
  pagination?: TransactionPaginationInput;
}

export function useTransactionsPaginated({
  filters,
  pagination,
}: UseTransactionsPaginatedParams = {}) {
  return useQuery({
    queryKey: ["transactions", "paginated", filters, pagination],
    queryFn: async () => {
      const { data } =
        await apolloClient.query<TransactionsPaginatedQueryData>({
          query: GET_TRANSACTIONS_PAGINATED,
          variables: {
            filters,
            pagination,
          },
          fetchPolicy: "network-only",
        });

      if (!data?.transactionsPaginated) {
        throw new Error("Erro ao buscar transações paginadas");
      }

      return data.transactionsPaginated;
    },
  });
}
