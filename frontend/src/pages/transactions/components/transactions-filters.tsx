"use client";

import * as React from "react";
import { Search } from "lucide-react";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { Field, FieldLabel } from "@/components/ui/field";
import { CategoryIcon } from "@/components/category-icon";
import { getColorClasses } from "@/utils/badge-colors";
import { useCategories } from "@/hooks/useCategories";
import {
  FilterCombobox,
  type FilterComboboxOption,
} from "@/components/filter-combobox";
import { cn } from "@/lib/utils";
import type { TransactionFilterInput, TransactionType } from "@/types";

interface TransactionsFiltersProps {
  onFiltersChange: (filters: TransactionFilterInput) => void;
}

const TRANSACTION_TYPES: FilterComboboxOption[] = [
  { value: "all", label: "Todos" },
  { value: "EXPENSE", label: "Saída" },
  { value: "INCOME", label: "Entrada" },
];

interface CategoryFilterOption extends FilterComboboxOption {
  icon?: string;
  color?: string;
}

interface PeriodOption extends FilterComboboxOption {
  month: number;
  year: number;
}

function generatePeriodOptions(): PeriodOption[] {
  const options: PeriodOption[] = [
    { value: "all", label: "Todos os períodos", month: 0, year: 0 },
  ];
  const now = new Date();

  for (let i = 0; i < 12; i++) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const month = date.getMonth() + 1;
    const year = date.getFullYear();

    const label = date.toLocaleDateString("pt-BR", {
      month: "long",
      year: "numeric",
    });

    const formattedLabel = label.charAt(0).toUpperCase() + label.slice(1);

    options.push({ value: `${year}-${month}`, label: formattedLabel, month, year });
  }

  return options;
}

export function TransactionsFilters({
  onFiltersChange,
}: TransactionsFiltersProps) {
  const { data: categories } = useCategories();

  const [searchValue, setSearchValue] = React.useState("");
  const [selectedType, setSelectedType] = React.useState("all");
  const [selectedCategory, setSelectedCategory] = React.useState("all");
  const [selectedPeriod, setSelectedPeriod] = React.useState("all");

  const periodOptions = React.useMemo(() => generatePeriodOptions(), []);

  const categoryFilterOptions: CategoryFilterOption[] = React.useMemo(() => {
    const cats = categories || [];
    return [
      { value: "all", label: "Todas" },
      ...cats.map((c) => ({
        value: c.id,
        label: c.name,
        icon: c.icon,
        color: c.color,
      })),
    ];
  }, [categories]);

  const debounceTimeoutRef = React.useRef<number | undefined>(undefined);

  React.useEffect(() => {
    if (debounceTimeoutRef.current) {
      window.clearTimeout(debounceTimeoutRef.current);
    }

    debounceTimeoutRef.current = window.setTimeout(() => {
      const filters: TransactionFilterInput = {};

      if (searchValue) {
        filters.description = searchValue;
      }

      if (selectedType !== "all") {
        filters.type = selectedType as TransactionType;
      }

      if (selectedCategory !== "all") {
        filters.categoryId = selectedCategory;
      }

      if (selectedPeriod !== "all") {
        const period = periodOptions.find((p) => p.value === selectedPeriod);
        if (period) {
          filters.month = period.month;
          filters.year = period.year;
        }
      }

      onFiltersChange(filters);
    }, 300);

    return () => {
      if (debounceTimeoutRef.current) {
        window.clearTimeout(debounceTimeoutRef.current);
      }
    };
  }, [
    searchValue,
    selectedType,
    selectedCategory,
    selectedPeriod,
    periodOptions,
    onFiltersChange,
  ]);

  const renderCategoryOption = (option: CategoryFilterOption) => {
    if (!option.icon || !option.color) return option.label;
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
      </div>
    );
  };

  const renderCategoryValue = (option: CategoryFilterOption) => {
    if (!option.icon || !option.color) return option.label;
    return (
      <div className="flex items-center gap-2">
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
      </div>
    );
  };

  return (
    <div className="flex flex-col gap-4 p-6 bg-neutral-white rounded-lg border border-gray-200 shadow-xs">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Field>
          <FieldLabel htmlFor="search">Buscar</FieldLabel>
          <InputGroup>
            <InputGroupAddon>
              <Search className="h-4 w-4 text-gray-400" />
            </InputGroupAddon>
            <InputGroupInput
              id="search"
              type="text"
              placeholder="Buscar por descrição..."
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
            />
          </InputGroup>
        </Field>

        <Field>
          <FieldLabel>Tipo</FieldLabel>
          <FilterCombobox
            options={TRANSACTION_TYPES}
            value={selectedType}
            onValueChange={setSelectedType}
            searchPlaceholder="Buscar tipo..."
            emptyMessage="Nenhum tipo encontrado."
            showSearch
          />
        </Field>

        <Field>
          <FieldLabel>Categoria</FieldLabel>
          <FilterCombobox
            options={categoryFilterOptions}
            value={selectedCategory}
            onValueChange={setSelectedCategory}
            searchPlaceholder="Buscar categoria..."
            emptyMessage="Nenhuma categoria encontrada."
            showSearch
            renderOption={renderCategoryOption}
            renderValue={renderCategoryValue}
          />
        </Field>

        <Field>
          <FieldLabel>Período</FieldLabel>
          <FilterCombobox
            options={periodOptions}
            value={selectedPeriod}
            onValueChange={setSelectedPeriod}
            searchPlaceholder="Buscar período..."
            emptyMessage="Nenhum período encontrado."
            showSearch
          />
        </Field>
      </div>
    </div>
  );
}
