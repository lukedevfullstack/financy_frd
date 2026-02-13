import { DashboardValuesCard } from "./components/dashboard-values-card";
import { CircleArrowDown, CircleArrowUp, Wallet } from "lucide-react";
import { useDashboard } from "@/hooks/useDashboard";
import { DashboardCategoriesCard } from "./components/dashboard-categories-card";
import { DashboardTransactionsCard } from "./components/dashboard-transactions-card";

export function Dashboard() {
  const { data, isLoading, isError, error } = useDashboard();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-200px)]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-base" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-200px)]">
        <p className="text-feedback-danger text-lg mb-4">
          Erro ao carregar dashboard
        </p>
        <p className="text-gray-600 text-sm">
          {error?.message || "Tente novamente mais tarde"}
        </p>
      </div>
    );
  }

  if (!data) {
    return null;
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex gap-6">
        <DashboardValuesCard
          title="Saldo total"
          value={data.balance.total}
          icon={<Wallet className="h-5 text-purple-base" />}
        />
        <DashboardValuesCard
          title="Receitas do mês"
          value={data.balance.income}
          icon={<CircleArrowUp className="h-5 text-brand-base" />}
        />
        <DashboardValuesCard
          title="Despesas do mês"
          value={data.balance.expense}
          icon={<CircleArrowDown className="h-5 text-red-base" />}
        />
      </div>

      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2">
          <DashboardTransactionsCard data={data} />
        </div>
        <div className="col-span-1">
          <DashboardCategoriesCard data={data} />
        </div>
      </div>
    </div>
  );
}
