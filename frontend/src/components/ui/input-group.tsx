import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useFieldContext } from "@/components/ui/field-context";

const INPUT_GROUP_BUTTON_TYPE = Symbol.for("InputGroupButton");

function InputGroup({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="input-group"
      role="group"
      className={cn(
        "group/input-group border-gray-300 dark:bg-gray-100/30 shadow-xs relative flex w-full items-center rounded-lg border outline-none",
        "h-12 has-[>textarea]:h-auto",

        "has-[>[data-align=inline-start]]:[&>input]:pl-2",
        "has-[>[data-align=inline-end]]:[&>input]:pr-2",
        "has-[>[data-align=block-start]]:h-auto has-[>[data-align=block-start]]:flex-col has-[>[data-align=block-start]]:[&>input]:pb-3",
        "has-[>[data-align=block-end]]:h-auto has-[>[data-align=block-end]]:flex-col has-[>[data-align=block-end]]:[&>input]:pt-3",

        "has-[[data-slot][aria-invalid=true]]:ring-red-500/20 has-[[data-slot][aria-invalid=true]]:border-red-500 dark:has-[[data-slot][aria-invalid=true]]:ring-red-500/40",

        className,
      )}
      {...props}
    />
  );
}

const inputGroupAddonVariants = cva(
  "flex h-auto cursor-text select-none items-center justify-center gap-2 py-1.5 text-sm font-medium group-data-[disabled=true]/input-group:opacity-50 [&>kbd]:rounded-[calc(var(--radius)-5px)] [&>svg:not([class*='size-'])]:size-4",
  {
    variants: {
      align: {
        "inline-start":
          "order-first pl-3 has-[>button]:ml-[-0.45rem] has-[>kbd]:ml-[-0.35rem]",
        "inline-end":
          "order-last pr-3 has-[>button]:mr-[-0.4rem] has-[>kbd]:mr-[-0.35rem]",
        "block-start":
          "[.border-b]:pb-3 order-first w-full justify-start px-3 pt-3 group-has-[>input]/input-group:pt-2.5",
        "block-end":
          "[.border-t]:pt-3 order-last w-full justify-start px-3 pb-3 group-has-[>input]/input-group:pb-2.5",
      },
    },
    defaultVariants: {
      align: "inline-start",
    },
  },
);

function InputGroupAddon({
  className,
  align = "inline-start",
  children,
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof inputGroupAddonVariants>) {
  const fieldContext = useFieldContext();

  const hasButton = React.useMemo(() => {
    let foundButton = false;
    React.Children.forEach(children, (child) => {
      if (React.isValidElement(child)) {
        const childType = child.type as unknown as {
          displayName?: string;
          [key: symbol]: unknown;
        };
        if (
          childType?.displayName === "InputGroupButton" ||
          childType?.[INPUT_GROUP_BUTTON_TYPE] === true
        ) {
          foundButton = true;
        }
      }
    });
    return foundButton;
  }, [children]);

  const getAddonColor = () => {
    if (hasButton) return "";
    if (fieldContext?.hasError) return "text-feedback-danger";
    if (fieldContext?.isFocused) return "text-brand-base";
    if (fieldContext?.isFilled) return "text-gray-800";
    return "text-gray-400";
  };

  return (
    <div
      role="group"
      data-slot="input-group-addon"
      data-align={align}
      data-has-button={hasButton}
      className={cn(
        inputGroupAddonVariants({ align }),
        !hasButton && "transition-colors",
        getAddonColor(),
        className,
      )}
      onClick={(e) => {
        if ((e.target as HTMLElement).closest("button")) {
          return;
        }
        e.currentTarget.parentElement?.querySelector("input")?.focus();
      }}
      {...props}
    >
      {children}
    </div>
  );
}

const inputGroupButtonVariants = cva(
  "flex items-center gap-2 text-sm shadow-none",
  {
    variants: {
      size: {
        xs: "h-6 gap-1 rounded-[calc(var(--radius)-5px)] px-2 has-[>svg]:px-2 [&>svg:not([class*='size-'])]:size-3.5",
        sm: "h-8 gap-1.5 rounded-md px-2.5 has-[>svg]:px-2.5",
        "icon-xs":
          "size-6 rounded-[calc(var(--radius)-5px)] p-0 has-[>svg]:p-0",
        "icon-sm": "size-8 p-0 has-[>svg]:p-0",
      },
    },
    defaultVariants: {
      size: "xs",
    },
  },
);

const InputGroupButton = React.forwardRef<
  HTMLButtonElement,
  Omit<React.ComponentProps<typeof Button>, "size"> &
    VariantProps<typeof inputGroupButtonVariants>
>(
  (
    { className, type = "button", variant = "ghost", size = "xs", ...props },
    ref,
  ) => {
    return (
      <Button
        ref={ref}
        type={type}
        data-size={size}
        data-slot="input-group-button"
        variant={variant}
        className={cn(inputGroupButtonVariants({ size }), className)}
        {...props}
      />
    );
  },
);
InputGroupButton.displayName = "InputGroupButton";
(InputGroupButton as typeof InputGroupButton & { [key: symbol]: boolean })[
  INPUT_GROUP_BUTTON_TYPE
] = true;

function InputGroupText({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      className={cn(
        "text-gray-400 flex items-center gap-2 text-sm [&_svg:not([class*='size-'])]:size-4 [&_svg]:pointer-events-none",
        className,
      )}
      {...props}
    />
  );
}

function InputGroupInput({
  className,
  onFocus,
  onBlur,
  onChange,
  value,
  ...props
}: React.ComponentProps<"input">) {
  const fieldContext = useFieldContext();

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    fieldContext?.setIsFocused(true);
    onFocus?.(e);
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    fieldContext?.setIsFocused(false);
    onBlur?.(e);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const isFilled = e.target.value.length > 0;
    fieldContext?.setIsFilled(isFilled);
    onChange?.(e);
  };

  React.useEffect(() => {
    if (value !== undefined) {
      const isFilled = String(value).length > 0;
      fieldContext?.setIsFilled(isFilled);
    }
  }, [value, fieldContext]);

  return (
    <Input
      data-slot="input-group-control"
      className={cn(
        "flex-1 rounded-none border-0 bg-transparent shadow-none focus-visible:ring-0 dark:bg-transparent",
        className,
      )}
      onFocus={handleFocus}
      onBlur={handleBlur}
      onChange={handleChange}
      value={value}
      aria-invalid={fieldContext?.hasError}
      {...props}
    />
  );
}

function InputGroupTextarea({
  className,
  onFocus,
  onBlur,
  ...props
}: React.ComponentProps<"textarea">) {
  const fieldContext = useFieldContext();

  const handleFocus = (e: React.FocusEvent<HTMLTextAreaElement>) => {
    fieldContext?.setIsFocused(true);
    onFocus?.(e);
  };

  const handleBlur = (e: React.FocusEvent<HTMLTextAreaElement>) => {
    fieldContext?.setIsFocused(false);
    onBlur?.(e);
  };

  return (
    <Textarea
      data-slot="input-group-control"
      className={cn(
        "flex-1 resize-none rounded-none border-0 bg-transparent py-3 shadow-none focus-visible:ring-0 dark:bg-transparent",
        className,
      )}
      onFocus={handleFocus}
      onBlur={handleBlur}
      aria-invalid={fieldContext?.hasError}
      {...props}
    />
  );
}

export {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupText,
  InputGroupInput,
  InputGroupTextarea,
};
