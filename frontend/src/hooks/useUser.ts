import { useQuery } from "@tanstack/react-query";
import { apolloClient } from "@/lib/graphql/apollo";
import { GET_ME } from "@/lib/graphql/queries/users";
import type { User } from "@/types";

type UserQueryData = {
  me: User;
};

interface UseUserParams {
  enabled?: boolean;
}

export function useUser({ enabled = true }: UseUserParams = {}) {
  return useQuery({
    queryKey: ["user", "me"],
    queryFn: async () => {
      const { data } = await apolloClient.query<UserQueryData>({
        query: GET_ME,
        fetchPolicy: "network-only",
      });

      if (!data?.me) {
        throw new Error("Usuário não encontrado");
      }

      return data.me;
    },
    enabled,
    staleTime: 1000 * 60 * 5, // 5 minutos
  });
}
