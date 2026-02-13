/**
 * Badge Color Utilities
 *
 * This file contains utility functions for mapping color names from backend
 * to badge styles with light backgrounds and base text colors.
 */

/**
 * Available color names that can be saved in the backend
 */
export type ColorName =
  | "blue"
  | "purple"
  | "pink"
  | "red"
  | "orange"
  | "yellow"
  | "green";

/**
 * Color configuration with Tailwind classes
 * Maps color names to their Tailwind CSS classes
 */
export const colorConfig: Record<
  ColorName,
  {
    bg: string; // Tailwind background class (light variant)
    text: string; // Tailwind text class (base variant)
    hex: {
      bg: string; // Hex value for light background
      text: string; // Hex value for base text
    };
  }
> = {
  blue: {
    bg: "bg-blue-light",
    text: "text-blue-base",
    hex: {
      bg: "#DBEAFE",
      text: "#2563EB",
    },
  },
  purple: {
    bg: "bg-purple-light",
    text: "text-purple-base",
    hex: {
      bg: "#F3E8FF",
      text: "#9333EA",
    },
  },
  pink: {
    bg: "bg-pink-light",
    text: "text-pink-base",
    hex: {
      bg: "#FCE7F3",
      text: "#DB2777",
    },
  },
  red: {
    bg: "bg-red-light",
    text: "text-red-base",
    hex: {
      bg: "#FEE2E2",
      text: "#DC2626",
    },
  },
  orange: {
    bg: "bg-orange-light",
    text: "text-orange-base",
    hex: {
      bg: "#FFEDD5",
      text: "#EA580C",
    },
  },
  yellow: {
    bg: "bg-yellow-light",
    text: "text-yellow-base",
    hex: {
      bg: "#F7F3CA",
      text: "#CA8A04",
    },
  },
  green: {
    bg: "bg-green-light",
    text: "text-green-dark",
    hex: {
      bg: "#E0FAE9",
      text: "#16A34A",
    },
  },
};

/**
 * Get Tailwind classes for a color name
 * @param colorName - Color name from backend (e.g., "blue", "green")
 * @returns Object with Tailwind bg and text classes
 */
export function getColorClasses(colorName: string): {
  bg: string;
  text: string;
} {
  const normalizedColor = colorName.toLowerCase() as ColorName;

  if (normalizedColor in colorConfig) {
    const config = colorConfig[normalizedColor];
    return {
      bg: config.bg,
      text: config.text,
    };
  }

  return {
    bg: "bg-blue-light",
    text: "text-blue-base",
  };
}

/**
 * Get hex values for a color name
 * Useful for inline styles or dynamic styling
 * @param colorName - Color name from backend
 * @returns Object with hex bg and text colors
 */
export function getColorHex(colorName: string): {
  bg: string;
  text: string;
} {
  const normalizedColor = colorName.toLowerCase() as ColorName;

  if (normalizedColor in colorConfig) {
    return colorConfig[normalizedColor].hex;
  }

  return colorConfig.blue.hex;
}

/**
 * Check if a color name is valid
 * @param colorName - Color name to validate
 * @returns true if color is valid
 */
export function isValidColor(colorName: string): colorName is ColorName {
  return colorName.toLowerCase() in colorConfig;
}

/**
 * Get all available color names
 * Useful for color pickers or select inputs
 * @returns Array of color names
 */
export function getAvailableColors(): ColorName[] {
  return Object.keys(colorConfig) as ColorName[];
}

/**
 * Get color configuration for display in UI
 * Useful for color pickers with preview
 * @returns Array of color objects with name, label and hex values
 */
export function getColorOptions(): Array<{
  name: ColorName;
  label: string;
  hex: string;
}> {
  return [
    { name: "green", label: "Verde", hex: "#16A34A" },
    { name: "blue", label: "Azul", hex: "#2563EB" },
    { name: "purple", label: "Roxo", hex: "#9333EA" },
    { name: "pink", label: "Rosa", hex: "#DB2777" },
    { name: "red", label: "Vermelho", hex: "#DC2626" },
    { name: "orange", label: "Laranja", hex: "#EA580C" },
    { name: "yellow", label: "Amarelo", hex: "#CA8A04" },
  ];
}
