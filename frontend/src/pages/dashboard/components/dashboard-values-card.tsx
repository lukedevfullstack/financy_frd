import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrencyBRL } from "@/lib/utils";
import type { ReactNode } from "react";

interface DashboardValuesCardProps {
  title: string;
  value: number;
  icon: ReactNode;
}

export function DashboardValuesCard({
  title,
  value,
  icon,
}: DashboardValuesCardProps) {
  return (
    <Card className="p-6 flex-1">
      <CardHeader className="p-0 mb-4">
        <CardTitle className="text-gray-500 text-xs font-medium leading-4 uppercase tracking-[0.6px] flex items-center gap-3">
          {icon}
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0 text-[28px] font-bold text-gray-800 leading-8">
        {formatCurrencyBRL(value)}
      </CardContent>
    </Card>
  );
}
