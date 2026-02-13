import { Badge } from "@/components/ui/badge";
import { CategoryIcon } from "@/components/category-icon";
import type { Category } from "@/types";

interface CategoryBadgeProps {
  /**
   * Category object from backend
   */
  category: Pick<Category, "name" | "color" | "icon">;
  /**
   * Additional CSS classes
   */
  className?: string;
  /**
   * Show icon alongside name
   */
  showIcon?: boolean;
}

/**
 * CategoryBadge component
 *
 * Displays a badge with the category name and color from the backend.
 * The badge background uses the light variant of the color,
 * and the text uses the base color.
 *
 * @example
 * ```tsx
 * <CategoryBadge
 *   category={{ name: "Alimentação", color: "green", icon: "coffee" }}
 *   showIcon
 * />
 * ```
 */
export function CategoryBadge({
  category,
  className,
  showIcon = false,
}: CategoryBadgeProps) {
  return (
    <Badge color={category.color} className={className}>
      {showIcon && category.icon && (
        <CategoryIcon icon={category.icon} size={16} className="mr-1.5" />
      )}
      {category.name}
    </Badge>
  );
}
