"use client";

import * as React from "react";
import { useEffect, useState } from "react";
import { useForm, useWatch, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { format, parse } from "date-fns";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Field, FieldLabel } from "@/components/ui/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,
} from "@/components/ui/input-group";
import { CategorySelect } from "@/components/category-combobox";
import { DatePicker } from "@/components/date-picker";
import { useCategories } from "@/hooks/useCategories";
import { useCreateTransaction } from "@/hooks/useCreateTransaction";
import { useUpdateTransaction } from "@/hooks/useUpdateTransaction";
import { CircleArrowDown, CircleArrowUp } from "lucide-react";
import type { TransactionType, Transaction } from "@/types";
import {
  transactionSchema,
  type TransactionFormData,
} from "@/schemas/transaction.schema";

interface TransactionDialogProps {
  children?: React.ReactNode;
  transaction?: Transaction | null;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function TransactionDialog({
  children,
  transaction,
  open: controlledOpen,
  onOpenChange: controlledOnOpenChange,
}: TransactionDialogProps) {
  const isEditMode = !!transaction;
  const [internalOpen, setInternalOpen] = useState(false);

  const open = controlledOpen !== undefined ? controlledOpen : internalOpen;
  const setOpen = controlledOnOpenChange || setInternalOpen;

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    control,
  } = useForm<TransactionFormData>({
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      description: "",
      amount: 0,
      type: "EXPENSE",
      date: new Date().toISOString().split("T")[0],
      categoryId: "",
    },
  });

  const type = useWatch({ control, name: "type" });

  const { data: categories } = useCategories();
  const { mutate: createTransaction, isPending: isCreating } =
    useCreateTransaction();
  const { mutate: updateTransaction, isPending: isUpdating } =
    useUpdateTransaction();

  const isPending = isCreating || isUpdating;

  useEffect(() => {
    if (open && transaction) {
      reset({
        description: transaction.description,
        amount: transaction.amount,
        type: transaction.type,
        date: new Date(transaction.date).toISOString().split("T")[0],
        categoryId: transaction.categoryId || "",
      });
    } else if (open && !transaction) {
      reset({
        description: "",
        amount: 0,
        type: "EXPENSE",
        date: new Date().toISOString().split("T")[0],
        categoryId: "",
      });
    }
  }, [open, transaction, reset]);

  const onSubmit = (data: TransactionFormData) => {
    const dateTime = new Date(data.date + "T12:00:00.000Z").toISOString();

    const transactionData = {
      description: data.description,
      amount: data.amount,
      type: data.type,
      date: dateTime,
      categoryId: data.categoryId || undefined,
    };

    if (isEditMode) {
      updateTransaction(
        { id: transaction.id, data: transactionData },
        {
          onSuccess: () => {
            setOpen(false);
          },
        },
      );
    } else {
      createTransaction(transactionData, {
        onSuccess: () => {
          reset();
          setOpen(false);
        },
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {children && <DialogTrigger asChild>{children}</DialogTrigger>}
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {isEditMode ? "Editar Transação" : "Nova Transação"}
          </DialogTitle>
          <DialogDescription>
            {isEditMode
              ? "Atualize os dados da transação"
              : "Registre sua despesa ou receita"}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <Field>
            <Controller
              name="type"
              control={control}
              render={({ field }) => (
                <Tabs
                  value={field.value}
                  onValueChange={(value) =>
                    field.onChange(value as TransactionType)
                  }
                  className="w-full"
                >
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger
                      value="EXPENSE"
                      className={`flex gap-3 ${
                        type === "EXPENSE"
                          ? "border-red-base data-[state=active]:border-red-base"
                          : ""
                      }`}
                    >
                      <CircleArrowDown
                        size={16}
                        className={
                          type === "EXPENSE" ? "text-red-base" : "text-gray-400"
                        }
                      />
                      Despesa
                    </TabsTrigger>
                    <TabsTrigger
                      value="INCOME"
                      className={`flex gap-3 ${
                        type === "INCOME"
                          ? "border-green-base data-[state=active]:border-green-base"
                          : ""
                      }`}
                    >
                      <CircleArrowUp
                        size={16}
                        className={
                          type === "INCOME"
                            ? "text-green-base"
                            : "text-gray-400"
                        }
                      />
                      Receita
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
              )}
            />
            {errors.type && (
              <p className="text-sm text-feedback-danger mt-1">
                {errors.type.message}
              </p>
            )}
          </Field>

          <Field>
            <FieldLabel htmlFor="description">Descrição</FieldLabel>
            <InputGroup>
              <InputGroupInput
                id="description"
                placeholder="Ex: Almoço no restaurante"
                {...register("description")}
              />
            </InputGroup>
            {errors.description && (
              <p className="text-sm text-feedback-danger mt-1">
                {errors.description.message}
              </p>
            )}
          </Field>

          <div className="flex gap-4">
            <Field className="flex-1">
              <FieldLabel>Data</FieldLabel>
              <Controller
                name="date"
                control={control}
                render={({ field }) => (
                  <DatePicker
                    value={
                      field.value
                        ? parse(field.value, "yyyy-MM-dd", new Date())
                        : undefined
                    }
                    onChange={(date) => {
                      field.onChange(date ? format(date, "yyyy-MM-dd") : "");
                    }}
                    placeholder="Selecione"
                  />
                )}
              />
              {errors.date && (
                <p className="text-sm text-feedback-danger mt-1">
                  {errors.date.message}
                </p>
              )}
            </Field>

            <Field className="flex-1">
              <FieldLabel htmlFor="amount">Valor</FieldLabel>
              <Controller
                name="amount"
                control={control}
                render={({ field }) => {
                  const formatCurrency = (value: number) => {
                    return value.toLocaleString("pt-BR", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    });
                  };

                  const handleChange = (
                    e: React.ChangeEvent<HTMLInputElement>,
                  ) => {
                    const digits = e.target.value.replace(/\D/g, "");
                    const numericValue = parseInt(digits || "0", 10) / 100;
                    field.onChange(numericValue);
                  };

                  return (
                    <InputGroup>
                      <InputGroupAddon>
                        <InputGroupText className="text-neutral-black">R$</InputGroupText>
                      </InputGroupAddon>
                      <InputGroupInput
                        id="amount"
                        type="text"
                        inputMode="numeric"
                        placeholder="0,00"
                        value={formatCurrency(field.value || 0)}
                        onChange={handleChange}
                        onBlur={field.onBlur}
                        ref={field.ref}
                        name={field.name}
                      />
                    </InputGroup>
                  );
                }}
              />
              {errors.amount && (
                <p className="text-sm text-feedback-danger mt-1">
                  {errors.amount.message}
                </p>
              )}
            </Field>
          </div>

          <Controller
            name="categoryId"
            control={control}
            render={({ field }) => (
              <CategorySelect
                categories={categories || []}
                value={field.value}
                onValueChange={field.onChange}
                placeholder="Selecione"
                label="Categoria"
              />
            )}
          />
          {errors.categoryId && (
            <p className="text-sm text-feedback-danger mt-1">
              {errors.categoryId.message}
            </p>
          )}

          {isEditMode ? (
            <div className="flex gap-3">
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                onClick={() => setOpen(false)}
                disabled={isPending}
              >
                Cancelar
              </Button>
              <Button type="submit" className="flex-1" disabled={isPending}>
                {isPending ? "Salvando..." : "Salvar"}
              </Button>
            </div>
          ) : (
            <Button type="submit" className="w-full" disabled={isPending}>
              {isPending ? "Salvando..." : "Salvar"}
            </Button>
          )}
        </form>
      </DialogContent>
    </Dialog>
  );
}

export const CreateTransactionDialog = TransactionDialog;
