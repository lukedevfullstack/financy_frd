import { useEffect } from "react";
import { useAuthStore } from "@/stores/auth";
import { isTokenExpired } from "@/utils/token";
import { toast } from "sonner";

interface AuthGuardProps {
  children: React.ReactNode;
}

/**
 * AuthGuard component that checks token validity on mount
 * and logs out user if token is expired
 */
export function AuthGuard({ children }: AuthGuardProps) {
  const { token, logout, isAuthenticated } = useAuthStore();

  useEffect(() => {
    if (isAuthenticated && token) {
      if (isTokenExpired(token)) {
        toast.error("Sua sessão expirou. Por favor, faça login novamente.");
        logout();
      }
    }
  }, [token, isAuthenticated, logout]);

  return <>{children}</>;
}
