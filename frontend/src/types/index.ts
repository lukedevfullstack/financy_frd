import type { ColorName } from "@/utils/badge-colors";
import type { IconName } from "@/utils/category-icons";

export interface User {
  id: string;
  name: string;
  email: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface RegisterInput {
  name: string;
  email: string;
  password: string;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface UpdateUserInput {
  name: string;
}

export type TransactionType = "INCOME" | "EXPENSE";

export const TransactionType = {
  INCOME: "INCOME" as const,
  EXPENSE: "EXPENSE" as const,
};

export interface Category {
  id: string;
  name: string;
  description?: string;
  color: ColorName; // Color name: "blue", "green", "red", etc.
  icon: IconName; // Icon name: "shopping-cart", "coffee", etc.
  userId: string;
  transactionCount?: number;
  createdAt: string;
  updatedAt: string;
}

export interface Transaction {
  id: string;
  description: string;
  amount: number;
  type: TransactionType;
  date: string;
  categoryId?: string;
  category?: Category | null;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface BalanceData {
  total: number;
  income: number;
  expense: number;
}

export interface CategoryStats {
  category: Category;
  transactionCount: number;
  totalAmount: number;
}

export interface DashboardData {
  balance: BalanceData;
  recentTransactions: Transaction[];
  topCategories: CategoryStats[];
}

export interface DashboardQueryVariables {
  month?: number;
  year?: number;
}

export interface CreateTransactionInput {
  description: string;
  amount: number;
  type: TransactionType;
  date?: string;
  categoryId?: string;
}

export interface UpdateTransactionInput {
  description?: string;
  amount?: number;
  type?: TransactionType;
  date?: string;
  categoryId?: string;
}

export interface TransactionFilterInput {
  description?: string;
  type?: TransactionType;
  categoryId?: string;
  month?: number;
  year?: number;
}

export interface TransactionPaginationInput {
  page?: number;
  limit?: number;
}

export interface PaginatedTransactions {
  transactions: Transaction[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface CreateCategoryInput {
  name: string;
  description?: string;
  color: ColorName;
  icon: IconName;
}

export interface UpdateCategoryInput {
  name?: string;
  description?: string;
  color?: ColorName;
  icon?: IconName;
}

export interface CategoryStatsData {
  totalCategories: number;
  totalTransactions: number;
  mostUsedCategory: Category | null;
  mostUsedCategoryCount: number;
}

export interface DeleteOutput {
  success: boolean;
  message: string;
}
