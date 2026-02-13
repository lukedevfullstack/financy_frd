import { prismaClient } from "../../prisma/prisma";
import {
  CreateTransactionInput,
  UpdateTransactionInput,
  TransactionFilterInput,
  TransactionPaginationInput,
} from "../dtos/input/transaction.input";
import { TransactionType } from "../types/transaction-type.enum";
import {
  TransactionWithCategory,
  PaginatedTransactions,
  TransactionWhereInput,
} from "../types/transaction.types";
import { Transaction, Category } from "@prisma/client";

export class TransactionService {
  async create(
    userId: string,
    data: CreateTransactionInput,
  ): Promise<TransactionWithCategory> {
    if (data.categoryId) {
      const category = await prismaClient.category.findFirst({
        where: {
          id: data.categoryId,
          userId,
        },
      });

      if (!category) {
        throw new Error("Category not found or does not belong to user");
      }
    }

    const transaction = await prismaClient.transaction.create({
      data: {
        description: data.description,
        amount: data.amount,
        type: data.type,
        date: data.date || new Date(),
        userId,
        categoryId: data.categoryId,
      },
      include: {
        category: true,
      },
    });

    return {
      ...transaction,
      type: transaction.type as TransactionType,
    };
  }

  async findAll(userId: string): Promise<TransactionWithCategory[]> {
    const transactions = await prismaClient.transaction.findMany({
      where: {
        userId,
      },
      include: {
        category: true,
      },
      orderBy: {
        date: "desc",
      },
    });

    return transactions.map(
      (
        t: Transaction & { category: Category | null },
      ): TransactionWithCategory => ({
        ...t,
        type: t.type as TransactionType,
      }),
    );
  }

  async findAllWithFilters(
    userId: string,
    filters?: TransactionFilterInput,
    pagination?: TransactionPaginationInput,
  ): Promise<PaginatedTransactions> {
    const page = pagination?.page || 1;
    const limit = pagination?.limit || 10;
    const skip = (page - 1) * limit;

    const where: TransactionWhereInput = {
      userId,
    };

    if (filters?.type) {
      where.type = filters.type;
    }

    if (filters?.categoryId) {
      where.categoryId = filters.categoryId;
    }

    if (filters?.month && filters?.year) {
      const startDate = new Date(filters.year, filters.month - 1, 1);
      const endDate = new Date(filters.year, filters.month, 0, 23, 59, 59, 999);

      where.date = {
        gte: startDate,
        lte: endDate,
      };
    } else if (filters?.year) {
      const startDate = new Date(filters.year, 0, 1);
      const endDate = new Date(filters.year, 11, 31, 23, 59, 59, 999);

      where.date = {
        gte: startDate,
        lte: endDate,
      };
    }

    let allTransactions = await prismaClient.transaction.findMany({
      where,
      include: {
        category: true,
      },
      orderBy: [
        {
          date: "desc",
        },
        {
          createdAt: "desc",
        },
      ],
    });

    if (filters?.description) {
      const searchTerm = filters.description.toLowerCase();
      allTransactions = allTransactions.filter((t) =>
        t.description.toLowerCase().includes(searchTerm),
      );
    }

    const total = allTransactions.length;
    const transactions = allTransactions.slice(skip, skip + limit);

    return {
      transactions: transactions.map(
        (
          t: Transaction & { category: Category | null },
        ): TransactionWithCategory => ({
          ...t,
          type: t.type as TransactionType,
        }),
      ),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findById(
    id: string,
    userId: string,
  ): Promise<TransactionWithCategory | null> {
    const transaction = await prismaClient.transaction.findFirst({
      where: {
        id,
        userId,
      },
      include: {
        category: true,
      },
    });

    if (!transaction) return null;

    return {
      ...transaction,
      type: transaction.type as TransactionType,
    };
  }

  async update(
    id: string,
    userId: string,
    data: UpdateTransactionInput,
  ): Promise<TransactionWithCategory> {
    const transaction = await this.findById(id, userId);

    if (!transaction) {
      throw new Error("Transaction not found");
    }

    if (data.categoryId) {
      const category = await prismaClient.category.findFirst({
        where: {
          id: data.categoryId,
          userId,
        },
      });

      if (!category) {
        throw new Error("Category not found or does not belong to user");
      }
    }

    const updatedTransaction = await prismaClient.transaction.update({
      where: {
        id,
      },
      data,
      include: {
        category: true,
      },
    });

    return {
      ...updatedTransaction,
      type: updatedTransaction.type as TransactionType,
    };
  }

  async delete(id: string, userId: string): Promise<boolean> {
    const transaction = await this.findById(id, userId);

    if (!transaction) {
      throw new Error("Transaction not found");
    }

    await prismaClient.transaction.delete({
      where: {
        id,
      },
    });

    return true;
  }
}
