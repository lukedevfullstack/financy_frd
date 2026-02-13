import { getIconOptions, type IconName } from "@/utils/category-icons";
import { cn } from "@/lib/utils";

interface IconPickerProps {
  /**
   * Currently selected icon name
   */
  value: IconName;
  /**
   * Callback when icon is selected
   */
  onChange: (icon: IconName) => void;
  /**
   * Additional CSS classes
   */
  className?: string;
}

/**
 * IconPicker component
 *
 * Displays a grid of icon options for the user to select.
 * Shows the icon name in Portuguese and a visual preview.
 *
 * @example
 * ```tsx
 * const [icon, setIcon] = useState<IconName>("shopping-cart");
 *
 * <IconPicker value={icon} onChange={setIcon} />
 *
 * // With color preview
 * <IconPicker value={icon} onChange={setIcon} color="blue" />
 * ```
 */
export function IconPicker({ value, onChange, className }: IconPickerProps) {
  const icons = getIconOptions();

  return (
    <div className={cn("grid grid-cols-8 grid-rows-2 gap-2 w-fit", className)}>
      {icons.slice(0, 16).map((icon) => {
        const isSelected = value === icon.name;
        const IconComponent = icon.component;

        return (
          <button
            key={icon.name}
            type="button"
            onClick={() => onChange(icon.name)}
            className={cn(
              "flex items-center justify-center w-[42px] h-[42px] rounded-xl border transition-colors group",
              isSelected
                ? "border-brand-base"
                : "border-gray-200 hover:border-gray-300",
            )}
            aria-label={`Selecionar ícone ${icon.label}`}
            aria-pressed={isSelected}
            title={icon.label}
          >
            <IconComponent
              size={20}
              className={cn(isSelected ? "text-gray-600" : "text-gray-500")}
            />
          </button>
        );
      })}
    </div>
  );
}
