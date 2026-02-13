import { Transaction, Category } from "@prisma/client";
import { TransactionType } from "./transaction-type.enum";

export interface TransactionWithType extends Omit<Transaction, "type"> {
  type: TransactionType;
}

export interface TransactionWithCategory extends TransactionWithType {
  category: Category | null;
}

export interface PaginatedTransactions {
  transactions: TransactionWithCategory[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface TransactionWhereInput {
  userId: string;
  description?: {
    contains: string;
    mode: "insensitive";
  };
  type?: TransactionType;
  categoryId?: string;
  date?: {
    gte: Date;
    lte: Date;
  };
}
