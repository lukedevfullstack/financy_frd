import { Category } from "@prisma/client";

export interface CategoryWithCount extends Category {
  transactionCount: number;
}

export interface CategoryStatsData {
  totalCategories: number;
  totalTransactions: number;
  mostUsedCategory: Category | null;
  mostUsedCategoryCount: number;
}
