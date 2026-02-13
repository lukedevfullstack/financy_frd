import { CategoryBadge } from "@/components/category-badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrencyBRL } from "@/lib/utils";
import type { DashboardData } from "@/types";
import { ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";

interface DashboardCategoriesCardProps {
  data: DashboardData;
}

export function DashboardCategoriesCard({
  data,
}: DashboardCategoriesCardProps) {
  return (
    <Card>
      <CardHeader className="py-5 flex-row pl-6 pr-3 items-center justify-between border-b border-gray-200">
        <CardTitle className="text-xs text-gray-500 uppercase font-medium leading-4 tracking-[0.6px]">
          Categorias
        </CardTitle>
        <Link to="/categories">
          <Button
            variant="link"
            size="link"
            className="text-sm gap-1 hover:no-underline"
          >
            Gerenciar
            <ChevronRight />
          </Button>
        </Link>
      </CardHeader>
      <CardContent className="p-6 gap-5 flex flex-col">
        {data.topCategories.map((stat) => (
          <div
            key={stat.category.id}
            className="grid grid-cols-[auto_1fr_149px_88px] items-center gap-4"
          >
            <CategoryBadge category={stat.category} showIcon={false} />
            <div></div>
            <span className="text-sm text-gray-600 leading-5 text-right">
              {stat.transactionCount} itens
            </span>
            <span className="text-sm font-semibold text-gray-800 leading-5 text-right">
              {formatCurrencyBRL(stat.totalAmount)}
            </span>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
