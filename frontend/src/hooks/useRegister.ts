import { useMutation } from "@tanstack/react-query";
import { useAuthStore } from "@/stores/auth";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

interface RegisterInput {
  name: string;
  email: string;
  password: string;
}

export function useRegister() {
  const navigate = useNavigate();
  const signup = useAuthStore((state) => state.signup);

  return useMutation({
    mutationFn: async (data: RegisterInput) => {
      const success = await signup(data);
      if (!success) {
        throw new Error("Erro ao criar conta");
      }
      return success;
    },
    onSuccess: () => {
      toast.success("Conta criada com sucesso!");
      navigate("/");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Erro ao criar conta. Tente novamente.");
      console.error("Erro ao registrar:", error);
    },
  });
}
