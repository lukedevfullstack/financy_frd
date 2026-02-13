import { prismaClient } from "../../prisma/prisma";
import { TransactionType } from "../types/transaction-type.enum";
import { DashboardData } from "../types/dashboard.types";
import { Transaction, Category } from "@prisma/client";
import { TransactionWithCategory } from "../types/transaction.types";

export class DashboardService {
  async getDashboardData(
    userId: string,
    month?: number,
    year?: number,
  ): Promise<DashboardData> {
    const currentDate = new Date();
    const selectedMonth = month ?? currentDate.getMonth() + 1;
    const selectedYear = year ?? currentDate.getFullYear();

    const startDate = new Date(selectedYear, selectedMonth - 1, 1);
    const endDate = new Date(selectedYear, selectedMonth, 0, 23, 59, 59, 999);

    const allTransactions = await prismaClient.transaction.findMany({
      where: {
        userId,
      },
      include: {
        category: true,
      },
    });

    const totalIncome = allTransactions
      .filter(
        (t: Transaction & { category: Category | null }) =>
          t.type === TransactionType.INCOME,
      )
      .reduce(
        (sum: number, t: Transaction & { category: Category | null }) =>
          sum + t.amount,
        0,
      );

    const totalExpense = allTransactions
      .filter(
        (t: Transaction & { category: Category | null }) =>
          t.type === TransactionType.EXPENSE,
      )
      .reduce(
        (sum: number, t: Transaction & { category: Category | null }) =>
          sum + t.amount,
        0,
      );

    const monthTransactions = await prismaClient.transaction.findMany({
      where: {
        userId,
        date: {
          gte: startDate,
          lte: endDate,
        },
      },
      include: {
        category: true,
      },
    });

    const monthIncome = monthTransactions
      .filter(
        (t: Transaction & { category: Category | null }) =>
          t.type === TransactionType.INCOME,
      )
      .reduce(
        (sum: number, t: Transaction & { category: Category | null }) =>
          sum + t.amount,
        0,
      );

    const monthExpense = monthTransactions
      .filter(
        (t: Transaction & { category: Category | null }) =>
          t.type === TransactionType.EXPENSE,
      )
      .reduce(
        (sum: number, t: Transaction & { category: Category | null }) =>
          sum + t.amount,
        0,
      );

    const balance = {
      total: totalIncome - totalExpense,
      income: monthIncome,
      expense: monthExpense,
    };

    const recentTransactionsRaw = await prismaClient.transaction.findMany({
      where: {
        userId,
      },
      include: {
        category: true,
      },
      orderBy: {
        date: "desc",
      },
      take: 5,
    });

    const recentTransactions = recentTransactionsRaw.map(
      (
        t: Transaction & { category: Category | null },
      ): TransactionWithCategory => ({
        ...t,
        type: t.type as TransactionType,
      }),
    );

    const categoryStats = await prismaClient.transaction.groupBy({
      by: ["categoryId"],
      where: {
        userId,
        categoryId: {
          not: null,
        },
      },
      _count: {
        id: true,
      },
      _sum: {
        amount: true,
      },
      orderBy: {
        _count: {
          id: "desc",
        },
      },
      take: 5,
    });

    const topCategories = await Promise.all(
      categoryStats.map(
        async (stat: {
          categoryId: string | null;
          _count: { id: number };
          _sum: { amount: number | null };
        }) => {
          const category = await prismaClient.category.findUnique({
            where: { id: stat.categoryId! },
          });

          return {
            category,
            transactionCount: stat._count.id,
            totalAmount: stat._sum.amount || 0,
          };
        },
      ),
    );

    return {
      balance,
      recentTransactions,
      topCategories,
    };
  }
}
