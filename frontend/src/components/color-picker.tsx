import { getColorOptions, type ColorName } from "@/utils/badge-colors";
import { cn } from "@/lib/utils";

interface ColorPickerProps {
  /**
   * Currently selected color name
   */
  value: ColorName;
  /**
   * Callback when color is selected
   */
  onChange: (color: ColorName) => void;
  /**
   * Additional CSS classes
   */
  className?: string;
}

/**
 * ColorPicker component
 *
 * Displays a grid of color options for the user to select.
 * Shows the color name in Portuguese and a visual preview.
 *
 * @example
 * ```tsx
 * const [color, setColor] = useState<ColorName>("blue");
 *
 * <ColorPicker value={color} onChange={setColor} />
 * ```
 */
export function ColorPicker({ value, onChange, className }: ColorPickerProps) {
  const colors = getColorOptions();

  return (
    <div className={cn("space-y-2", className)}>
      <div className="grid grid-cols-7 gap-3 w-fit">
        {colors.map((color) => {
          const isSelected = value === color.name;

          return (
            <button
              key={color.name}
              type="button"
              onClick={() => onChange(color.name)}
              className={cn(
                "flex flex-col items-center p-1 rounded-lg border w-fit",
                isSelected ? "border-gray-800" : "border-gray-200",
              )}
              aria-label={`Selecionar cor ${color.label}`}
              aria-pressed={isSelected}
            >
              <div
                className="w-10 h-5 rounded-sm flex items-center justify-center"
                style={{ backgroundColor: color.hex }}
              ></div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
