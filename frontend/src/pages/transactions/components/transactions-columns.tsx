"use client";

import { type ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CategoryIcon } from "@/components/category-icon";
import { getColorClasses } from "@/utils/badge-colors";
import { CircleArrowDown, CircleArrowUp, SquarePen, Trash } from "lucide-react";
import type { Transaction } from "@/types";

interface TransactionsColumnsProps {
  onEdit: (transaction: Transaction) => void;
  onDelete: (transaction: Transaction) => void;
}

export const getTransactionsColumns = ({
  onEdit,
  onDelete,
}: TransactionsColumnsProps): ColumnDef<Transaction>[] => [
  {
    accessorKey: "description",
    header: "Descrição",
    cell: ({ row }) => {
      const transaction = row.original;
      const category = transaction.category;

      return (
        <div className="flex items-center gap-3">
          {category ? (
            <div
              className={`h-10 w-10 flex items-center justify-center rounded-lg ${
                getColorClasses(category.color).bg
              }`}
            >
              <CategoryIcon
                icon={category.icon}
                size={16}
                className={getColorClasses(category.color).text}
              />
            </div>
          ) : (
            <div className="h-10 w-10 flex items-center justify-center rounded-lg bg-gray-100">
              <span className="text-gray-400 text-xs">N/A</span>
            </div>
          )}
          <span className="font-medium text-gray-800">
            {transaction.description}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "date",
    header: () => <span className="block text-center">Data</span>,
    cell: ({ row }) => {
      const date = new Date(row.getValue("date"));
      return (
        <div className="text-center">
          <span className="text-gray-600">
            {date.toLocaleDateString("pt-BR", {
              day: "2-digit",
              month: "2-digit",
              year: "2-digit",
            })}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "category",
    header: () => <span className="block text-center">Categoria</span>,
    cell: ({ row }) => {
      const category = row.original.category;

      if (!category) {
        return (
          <div className="text-center">
            <span className="text-gray-400 text-sm italic">Sem categoria</span>
          </div>
        );
      }

      return (
        <div className="flex justify-center">
          <Badge color={category.color}>{category.name}</Badge>
        </div>
      );
    },
  },
  {
    accessorKey: "type",
    header: () => <span className="block text-center">Tipo</span>,
    cell: ({ row }) => {
      const type = row.getValue("type") as string;
      const isIncome = type === "INCOME";

      return (
        <div className="flex justify-center">
          <span
            className={`inline-flex items-center gap-1.5 text-sm font-medium ${
              isIncome ? "text-green-dark" : "text-red-dark"
            }`}
          >
            {isIncome ? (
              <CircleArrowUp size={16} />
            ) : (
              <CircleArrowDown size={16} />
            )}
            {isIncome ? "Entrada" : "Saída"}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "amount",
    header: () => <span className="block text-right">Valor</span>,
    cell: ({ row }) => {
      const amount = row.getValue("amount") as number;
      const type = row.original.type;
      const isIncome = type === "INCOME";

      const formatted = new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
      }).format(amount);

      return (
        <div className="text-right">
          <span className="text-sm font-semibold">
            {isIncome ? "+ " : "- "}
            {formatted}
          </span>
        </div>
      );
    },
  },
  {
    id: "actions",
    header: () => <span className="block text-right">Ações</span>,
    cell: ({ row }) => {
      const transaction = row.original;

      return (
        <div className="flex gap-2 justify-end">
          <Button
            variant="outline"
            size="icon"
            onClick={() => onDelete(transaction)}
          >
            <Trash className=" text-red-600" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => onEdit(transaction)}
          >
            <SquarePen className="text-gray-700" />
          </Button>
        </div>
      );
    },
  },
];
