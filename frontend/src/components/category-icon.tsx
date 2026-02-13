import { createElement } from "react";
import { getIconComponent, type IconName } from "@/utils/category-icons";
import { cn } from "@/lib/utils";

interface CategoryIconProps {
  /**
   * Icon name from backend (e.g., "shopping-cart", "coffee")
   */
  icon: IconName | string;
  /**
   * Size of the icon (default: 20px)
   */
  size?: number;
  /**
   * Additional CSS classes
   */
  className?: string;
}

/**
 * CategoryIcon component
 *
 * Renders a Lucide icon based on the icon name from the backend.
 * Automatically maps icon names to their corresponding Lucide components.
 *
 * @example
 * ```tsx
 * // With icon name from backend
 * <CategoryIcon icon="shopping-cart" size={24} />
 *
 * // With custom styling
 * <CategoryIcon icon="coffee" className="text-brand-base" />
 *
 * // Used with category object
 * <CategoryIcon icon={category.icon} />
 * ```
 */
export function CategoryIcon({
  icon,
  size = 20,
  className,
}: CategoryIconProps) {
  const IconComponent = getIconComponent(icon);

  return createElement(IconComponent, {
    size,
    className: cn(className),
  });
}
