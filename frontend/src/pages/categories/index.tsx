import { ArrowUpDown, Plus, Tag } from "lucide-react";
import { useState } from "react";
import { CategoriesSummaryCard } from "./components/categories-summary-card";
import { useCategoryStats } from "@/hooks/useCategoryStats";
import { CategoryIcon } from "@/components/category-icon";
import { getColorClasses } from "@/utils/badge-colors";
import { useCategories } from "@/hooks/useCategories";
import { CategoryInfoCard } from "./components/category-info-card";
import { CategoryDialog } from "./components/create-category-dialog";
import { DeleteCategoryDialog } from "./components/delete-category-dialog";
import { useDeleteCategory } from "@/hooks/useDeleteCategory";
import { Button } from "@/components/ui/button";
import type { Category } from "@/types";

export function Categories() {
  const { data: stats } = useCategoryStats();
  const { data: categories } = useCategories();

  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deletingCategory, setDeletingCategory] = useState<Category | null>(
    null,
  );
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const { mutate: deleteCategory, isPending: isDeleting } = useDeleteCategory();

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setEditDialogOpen(true);
  };

  const handleDelete = (category: Category) => {
    setDeletingCategory(category);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (deletingCategory) {
      deleteCategory(deletingCategory.id, {
        onSuccess: () => {
          setDeleteDialogOpen(false);
          setDeletingCategory(null);
        },
      });
    }
  };

  return (
    <div className="flex flex-col gap-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold leading-8 text-gray-800">
            Categorias
          </h1>
          <p className="text-base text-gray-600 leading-6">
            Organize suas transações por categorias
          </p>
        </div>
        <CategoryDialog>
          <Button size="sm">
            <Plus /> Nova categoria
          </Button>
        </CategoryDialog>
      </div>
      <div className="grid grid-cols-3 gap-6">
        <CategoriesSummaryCard
          icon={<Tag />}
          title={stats?.totalCategories ?? 0}
          description="Total de categorias"
        />
        <CategoriesSummaryCard
          icon={<ArrowUpDown className="text-purple-base" />}
          title={stats?.totalTransactions ?? 0}
          description="Total de transações"
        />
        <CategoriesSummaryCard
          icon={
            stats?.mostUsedCategory && (
              <CategoryIcon
                icon={stats.mostUsedCategory.icon}
                size={24}
                className={getColorClasses(stats.mostUsedCategory.color).text}
              />
            )
          }
          title={stats?.mostUsedCategory?.name ?? "N/A"}
          description="Categoria mais utilizada"
        />
      </div>
      <div className="grid grid-cols-4 gap-4">
        {categories?.map((category) => (
          <CategoryInfoCard
            key={category.id}
            icon={
              <CategoryIcon
                icon={category.icon}
                size={16}
                className={getColorClasses(category.color).text}
              />
            }
            title={category.name}
            description={category.description || "N/A"}
            color={category.color}
            count={category.transactionCount ?? 0}
            onEdit={() => handleEdit(category)}
            onDelete={() => handleDelete(category)}
          />
        ))}
      </div>

      <CategoryDialog
        category={editingCategory}
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
      />

      <DeleteCategoryDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleConfirmDelete}
        categoryName={deletingCategory?.name || ""}
        isDeleting={isDeleting}
      />
    </div>
  );
}
