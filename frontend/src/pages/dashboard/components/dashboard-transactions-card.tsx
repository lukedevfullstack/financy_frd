import { CategoryBadge } from "@/components/category-badge";
import { CategoryIcon } from "@/components/category-icon";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrencyBRL } from "@/lib/utils";
import { CreateTransactionDialog } from "@/pages/transactions/components/create-transaction-dialog";
import type { DashboardData } from "@/types";
import { getColorClasses } from "@/utils/badge-colors";
import {
  ChevronRight,
  CircleArrowDown,
  CircleArrowUp,
  Plus,
} from "lucide-react";
import { Link } from "react-router-dom";

interface DashboardTransactionsCardProps {
  data: DashboardData;
}

export function DashboardTransactionsCard({
  data,
}: DashboardTransactionsCardProps) {
  return (
    <Card>
      <CardHeader className="py-5 flex-row pl-6 pr-3 items-center justify-between border-b border-gray-200">
        <CardTitle className="text-xs text-gray-500 uppercase font-medium leading-4 tracking-[0.6px]">
          Transações recentes
        </CardTitle>
        <Link to="/transactions">
          <Button
            variant="link"
            size="link"
            className="text-sm gap-1 hover:no-underline"
          >
            Ver todas
            <ChevronRight />
          </Button>
        </Link>
      </CardHeader>
      <CardContent className="p-0 flex flex-col">
        <div>
          {data.recentTransactions.map((transaction) => (
            <div
              key={transaction.id}
              className="grid grid-cols-[1fr_160px_160px] items-center gap-4 py-5 px-6 border-b border-gray-200"
            >
              <div className="flex items-center gap-4">
                {transaction.category && (
                  <div
                    className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      getColorClasses(transaction.category.color).bg
                    } ${getColorClasses(transaction.category.color).text}`}
                  >
                    <CategoryIcon icon={transaction.category.icon} size={16} />
                  </div>
                )}
                <div>
                  <p className="font-medium text-gray-800 text-base leading-6">
                    {transaction.description}
                  </p>
                  <p className="text-sm text-gray-600 leading-5">
                    {new Date(transaction.date).toLocaleDateString("pt-BR", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "2-digit",
                    })}
                  </p>
                </div>
              </div>
              <div className="flex justify-center">
                {transaction.category && (
                  <CategoryBadge category={transaction.category} />
                )}
              </div>
              <div className="flex items-center justify-end gap-2">
                <p
                  className={`font-semibold leading-5 text-gray-800 whitespace-nowrap`}
                >
                  {transaction.type === "INCOME" ? "+" : "-"}{" "}
                  {formatCurrencyBRL(transaction.amount)}
                </p>
                {transaction.type === "INCOME" ? (
                  <CircleArrowUp className="text-base text-brand-base" />
                ) : (
                  <CircleArrowDown className="text-base text-red-base" />
                )}
              </div>
            </div>
          ))}
          <div className="py-5 px-6 flex items-center justify-center">
            <CreateTransactionDialog>
              <Button
                variant="link"
                className="text-sm gap-1 hover:no-underline p-0 h-fit"
              >
                <Plus />
                Nova transação
              </Button>
            </CreateTransactionDialog>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
