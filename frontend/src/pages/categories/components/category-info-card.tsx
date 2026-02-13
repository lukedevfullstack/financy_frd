import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { getColorClasses } from "@/utils/badge-colors";
import { SquarePen, Trash } from "lucide-react";

interface CategoryInfoCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  color: string;
  count: number;
  onEdit?: () => void;
  onDelete?: () => void;
}

export function CategoryInfoCard({
  icon,
  title,
  description,
  color,
  count,
  onEdit,
  onDelete,
}: CategoryInfoCardProps) {
  return (
    <Card className="p-6 flex flex-col gap-5">
      <CardHeader className="p-0 flex flex-row justify-between">
        <div
          className={`h-10 w-10 flex items-center justify-center rounded-lg ${getColorClasses(color).bg}`}
        >
          {icon}
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            className="p-2 h-fit"
            onClick={onDelete}
            type="button"
          >
            <Trash className="text-feedback-danger" />
          </Button>
          <Button
            variant="outline"
            className="p-2 h-fit"
            onClick={onEdit}
            type="button"
          >
            <SquarePen className="text-gray-700" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <h3 className="text-base text-gray-800 font-semibold leading-6">
          {title}
        </h3>
        <span className="overflow-hidden text-ellipsis text-gray-600 whitespace-nowrap text-sm leading-5">
          {description}
        </span>
      </CardContent>
      <CardFooter className="p-0 flex justify-between">
        <div>
          <Badge color={color}>{title}</Badge>
        </div>
        <span className="text-gray-600 text-right leading-5 text-sm">
          {count} {count === 1 ? "item" : "itens"}
        </span>
      </CardFooter>
    </Card>
  );
}
