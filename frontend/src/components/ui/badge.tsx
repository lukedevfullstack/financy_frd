import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";
import { getColorClasses, type ColorName } from "@/utils/badge-colors";

const badgeVariants = cva(
  "inline-flex items-center rounded-full py-1 px-3 text-sm font-medium transition-colors focus:outline-none",
  {
    variants: {
      variant: {
        default:
          "bg-brand-base text-neutral-white shadow hover:bg-brand-base/80",
        secondary: "bg-gray-100 text-gray-800 hover:bg-gray-200",
        destructive:
          "bg-feedback-danger text-neutral-white shadow hover:bg-feedback-danger/80",
        blue: "bg-blue-light text-blue-base",
        purple: "bg-purple-light text-purple-base",
        pink: "bg-pink-light text-pink-base",
        red: "bg-red-light text-red-base",
        orange: "bg-orange-light text-orange-base",
        yellow: "bg-yellow-light text-yellow-base",
        green: "bg-green-light text-green-dark",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {
  /**
   * Dynamic color name from backend (e.g., "blue", "green")
   * When provided, overrides the variant prop
   */
  color?: ColorName | string;
}

function Badge({ className, variant, color, ...props }: BadgeProps) {
  if (color) {
    const colorVariant = color.toLowerCase() as ColorName;
    const colorClasses = getColorClasses(colorVariant);

    return (
      <div
        className={cn(
          "inline-flex items-center rounded-full py-1 px-3 text-sm font-medium transition-colors focus:outline-none",
          colorClasses.bg,
          colorClasses.text,
          className,
        )}
        {...props}
      />
    );
  }

  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge };
