import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apolloClient } from "@/lib/graphql/apollo";
import { UPDATE_USER } from "@/lib/graphql/mutations/users";
import type { UpdateUserInput, User } from "@/types";
import { toast } from "sonner";

type UpdateUserData = {
  updateUser: User;
};

export function useUpdateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: UpdateUserInput) => {
      const { data: result } = await apolloClient.mutate<UpdateUserData>({
        mutation: UPDATE_USER,
        variables: { data },
      });

      if (!result?.updateUser) {
        throw new Error("Erro ao atualizar usuário");
      }

      return result.updateUser;
    },
    onSuccess: (data) => {
      toast.success("Usuário atualizado com sucesso!");
      queryClient.invalidateQueries({ queryKey: ["user", "me"] });
      queryClient.setQueryData(["user", "me"], data);
    },
    onError: (error: Error) => {
      toast.error(
        error.message || "Erro ao atualizar usuário. Tente novamente."
      );
      console.error("Erro ao atualizar usuário:", error);
    },
  });
}
