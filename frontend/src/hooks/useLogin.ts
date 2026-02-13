import { useMutation } from "@tanstack/react-query";
import { useAuthStore } from "@/stores/auth";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

interface LoginInput {
  email: string;
  password: string;
}

export function useLogin() {
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);

  return useMutation({
    mutationFn: async (data: LoginInput) => {
      const success = await login(data);
      if (!success) {
        throw new Error("E-mail ou senha incorretos");
      }
      return success;
    },
    onSuccess: () => {
      toast.success("Login realizado com sucesso!");
      navigate("/");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Erro ao fazer login. Tente novamente.");
      console.error("Erro ao fazer login:", error);
    },
  });
}
