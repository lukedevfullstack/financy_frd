import { Category } from "@prisma/client";
import { TransactionWithCategory } from "./transaction.types";

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
  recentTransactions: TransactionWithCategory[];
  topCategories: CategoryStats[];
}
