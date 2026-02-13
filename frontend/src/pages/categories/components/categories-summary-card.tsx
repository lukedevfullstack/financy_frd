import { Card, CardContent } from "@/components/ui/card";

interface CategoriesSummaryCardProps {
  icon: React.ReactNode;
  title: string | number;
  description: string;
}

export function CategoriesSummaryCard({
  icon,
  title,
  description,
}: CategoriesSummaryCardProps) {
  return (
    <Card className="p-6">
      <CardContent className="p-0">
        <div className="flex gap-4">
          <div className="mt-1">{icon}</div>
          <div className="flex flex-col gap-2">
            <h2 className="font-bold leading-8 text-[28px] text-gray-800">
              {title}
            </h2>
            <span className="text-xs font-medium leading-4 tracking-[0.6px] uppercase text-gray-500">
              {description}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
