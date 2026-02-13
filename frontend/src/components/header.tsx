import { Link, useLocation } from "react-router-dom";
import { useAuthStore } from "../stores/auth";
import logo from "@/assets/logo.svg";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback } from "./ui/avatar";

export function Header() {
  const { user, isAuthenticated } = useAuthStore();
  const location = useLocation();
  const isDashboardPage = location.pathname === "/";
  const isTransactionsPage = location.pathname === "/transactions";
  const isCategoriesPage = location.pathname === "/categories";

  return (
    <div>
      {isAuthenticated && (
        <div className="flex justify-between items-center py-4 px-12 w-full border-gray-200 border-b bg-neutral-white">
          <div>
            <img src={logo} />
          </div>
          <div className="flex items-center gap-5">
            <Link to="/">
              <Button
                size="sm"
                className="hover:no-underline leading-5"
                variant={isDashboardPage ? "link" : "ghost"}
              >
                Dashboard
              </Button>
            </Link>
            <Link to="/transactions">
              <Button
                size="sm"
                className="hover:no-underline leading-5"
                variant={isTransactionsPage ? "link" : "ghost"}
              >
                Transações
              </Button>
            </Link>
            <Link to="/categories">
              <Button
                size="sm"
                className="hover:no-underline leading-5"
                variant={isCategoriesPage ? "link" : "ghost"}
              >
                Categorias
              </Button>
            </Link>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2">
              <Link to="/profile">
                <Avatar>
                  <AvatarFallback className="bg-gray-300 text-gray-800">
                    {user?.name?.charAt(0)}
                  </AvatarFallback>
                </Avatar>
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
