"use client";

import * as React from "react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Field, FieldLabel, FieldDescription } from "@/components/ui/field";
import { InputGroup, InputGroupInput } from "@/components/ui/input-group";
import { IconPicker } from "@/components/icon-picker";
import { ColorPicker } from "@/components/color-picker";
import { useCreateCategory } from "@/hooks/useCreateCategory";
import { useUpdateCategory } from "@/hooks/useUpdateCategory";
import type { IconName } from "@/utils/category-icons";
import type { ColorName } from "@/utils/badge-colors";
import type { Category } from "@/types";
import {
  categorySchema,
  type CategoryFormData,
} from "@/schemas/category.schema";

interface CategoryDialogProps {
  children?: React.ReactNode;
  category?: Category | null;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function CategoryDialog({
  children,
  category,
  open: controlledOpen,
  onOpenChange: controlledOnOpenChange,
}: CategoryDialogProps) {
  const isEditMode = !!category;
  const [internalOpen, setInternalOpen] = React.useState(false);

  const open = controlledOpen !== undefined ? controlledOpen : internalOpen;
  const setOpen = controlledOnOpenChange || setInternalOpen;

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<CategoryFormData>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: "",
      description: "",
      icon: "shopping-cart",
      color: "blue",
    },
  });

  const icon = watch("icon") as IconName;
  const color = watch("color") as ColorName;

  const { mutate: createCategory, isPending: isCreating } = useCreateCategory();
  const { mutate: updateCategory, isPending: isUpdating } = useUpdateCategory();

  const isPending = isCreating || isUpdating;

  useEffect(() => {
    if (open && category) {
      reset({
        name: category.name,
        description: category.description || "",
        icon: category.icon as IconName,
        color: category.color as ColorName,
      });
    } else if (open && !category) {
      reset({
        name: "",
        description: "",
        icon: "",
        color: "",
      });
    }
  }, [open, category]);

  const onSubmit = (data: CategoryFormData) => {
    const categoryData = {
      name: data.name,
      description: data.description || undefined,
      icon: data.icon as IconName,
      color: data.color as ColorName,
    };

    if (isEditMode) {
      updateCategory(
        { id: category.id, data: categoryData },
        {
          onSuccess: () => {
            setOpen(false);
          },
        },
      );
    } else {
      createCategory(categoryData, {
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
      <DialogContent className="w-[488px]">
        <DialogHeader>
          <DialogTitle>
            {isEditMode ? "Editar Categoria" : "Nova Categoria"}
          </DialogTitle>
          <DialogDescription>
            {isEditMode
              ? "Atualize as informações da categoria"
              : "Organize suas transações com categorias"}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <Field>
            <FieldLabel htmlFor="name">Título</FieldLabel>
            <InputGroup>
              <InputGroupInput
                id="name"
                placeholder="Ex. Alimentação"
                {...register("name")}
              />
            </InputGroup>
            {errors.name && (
              <p className="text-sm text-feedback-danger mt-1">
                {errors.name.message}
              </p>
            )}
          </Field>

          <Field>
            <FieldLabel htmlFor="description">Descrição</FieldLabel>
            <InputGroup>
              <InputGroupInput
                id="description"
                placeholder="Descrição da categoria"
                {...register("description")}
              />
            </InputGroup>
            <FieldDescription>Opcional</FieldDescription>
            {errors.description && (
              <p className="text-sm text-feedback-danger mt-1">
                {errors.description.message}
              </p>
            )}
          </Field>

          <Field>
            <FieldLabel>Ícone</FieldLabel>
            <IconPicker
              value={icon}
              onChange={(value) => setValue("icon", value)}
            />
            {errors.icon && (
              <p className="text-sm text-feedback-danger mt-1">
                {errors.icon.message}
              </p>
            )}
          </Field>

          <Field>
            <FieldLabel>Cor</FieldLabel>
            <ColorPicker
              value={color}
              onChange={(value) => setValue("color", value)}
            />
            {errors.color && (
              <p className="text-sm text-feedback-danger mt-1">
                {errors.color.message}
              </p>
            )}
          </Field>

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

export const CreateCategoryDialog = CategoryDialog;
