"use client";

import { cn } from "@/lib/utils";
import { Field, FieldLabel } from "@/components/ui/field";
import { CategoryIcon } from "@/components/category-icon";
import { getColorClasses } from "@/utils/badge-colors";
import {
  FilterCombobox,
  type FilterComboboxOption,
} from "@/components/filter-combobox";
import type { Category } from "@/types";

interface CategoryOption extends FilterComboboxOption {
  icon: string;
  color: string;
  description?: string | null;
}

interface CategorySelectProps {
  categories: Category[];
  value?: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
  label?: string;
}

function CategoryOptionDisplay({
  option,
  showDescription = false,
}: {
  option: CategoryOption;
  showDescription?: boolean;
}) {
  return (
    <div className="flex items-center gap-2 flex-1">
      <div
        className={cn(
          "h-5 w-5 flex items-center justify-center rounded",
          getColorClasses(option.color).bg,
        )}
      >
        <CategoryIcon
          icon={option.icon}
          size={10}
          className={getColorClasses(option.color).text}
        />
      </div>
      <span>{option.label}</span>
      {showDescription && option.description && (
        <span className="ml-auto text-xs text-gray-400">
          {option.description}
        </span>
      )}
    </div>
  );
}

export function CategorySelect({
  categories,
  value,
  onValueChange,
  placeholder = "Selecione uma categoria",
  label = "Categoria",
}: CategorySelectProps) {
  const options: CategoryOption[] = categories.map((cat) => ({
    value: cat.id,
    label: cat.name,
    icon: cat.icon,
    color: cat.color,
    description: cat.description,
  }));

  return (
    <Field>
      <FieldLabel>{label}</FieldLabel>
      <FilterCombobox
        options={options}
        value={value || ""}
        onValueChange={(newValue) => {
          onValueChange(newValue === value ? "" : newValue);
        }}
        placeholder={placeholder}
        emptyMessage="Nenhuma categoria encontrada."
        renderOption={(option) => (
          <CategoryOptionDisplay option={option} showDescription />
        )}
        renderValue={(option) => <CategoryOptionDisplay option={option} />}
      />
    </Field>
  );
}
