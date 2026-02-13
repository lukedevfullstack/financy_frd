import { prismaClient } from "../../prisma/prisma";
import {
  CreateCategoryInput,
  UpdateCategoryInput,
} from "../dtos/input/category.input";
import { Category } from "@prisma/client";
import { CategoryStatsData, CategoryWithCount } from "../types/category.types";

export class CategoryService {
  async create(userId: string, data: CreateCategoryInput): Promise<Category> {
    const existingCategory = await prismaClient.category.findUnique({
      where: {
        userId_name: {
          userId,
          name: data.name,
        },
      },
    });

    if (existingCategory) {
      throw new Error("Category with this name already exists");
    }

    const category = await prismaClient.category.create({
      data: {
        ...data,
        userId,
      },
    });

    return category;
  }

  async findAll(userId: string): Promise<CategoryWithCount[]> {
    const categories = await prismaClient.category.findMany({
      where: {
        userId,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    const categoriesWithCount = await Promise.all(
      categories.map(async (category) => {
        const transactionCount = await prismaClient.transaction.count({
          where: {
            categoryId: category.id,
            userId,
          },
        });

        return {
          ...category,
          transactionCount,
        };
      }),
    );

    return categoriesWithCount;
  }

  async findById(id: string, userId: string): Promise<Category | null> {
    const category = await prismaClient.category.findFirst({
      where: {
        id,
        userId,
      },
    });

    return category;
  }

  async update(
    id: string,
    userId: string,
    data: UpdateCategoryInput,
  ): Promise<Category> {
    const category = await this.findById(id, userId);

    if (!category) {
      throw new Error("Category not found");
    }

    if (data.name && data.name !== category.name) {
      const existingCategory = await prismaClient.category.findUnique({
        where: {
          userId_name: {
            userId,
            name: data.name,
          },
        },
      });

      if (existingCategory) {
        throw new Error("Category with this name already exists");
      }
    }

    const updatedCategory = await prismaClient.category.update({
      where: {
        id,
      },
      data,
    });

    return updatedCategory;
  }

  async delete(id: string, userId: string): Promise<boolean> {
    const category = await this.findById(id, userId);

    if (!category) {
      throw new Error("Category not found");
    }

    await prismaClient.category.delete({
      where: {
        id,
      },
    });

    return true;
  }

  async getCategoryStats(userId: string): Promise<CategoryStatsData> {
    const totalCategories = await prismaClient.category.count({
      where: {
        userId,
      },
    });

    const totalTransactions = await prismaClient.transaction.count({
      where: {
        userId,
      },
    });

    const categoryUsage = await prismaClient.transaction.groupBy({
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
      orderBy: {
        _count: {
          id: "desc",
        },
      },
      take: 1,
    });

    let mostUsedCategory = null;
    let mostUsedCategoryCount = 0;

    if (categoryUsage.length > 0 && categoryUsage[0].categoryId) {
      mostUsedCategory = await prismaClient.category.findUnique({
        where: {
          id: categoryUsage[0].categoryId,
        },
      });
      mostUsedCategoryCount = categoryUsage[0]._count.id;
    }

    return {
      totalCategories,
      totalTransactions,
      mostUsedCategory,
      mostUsedCategoryCount,
    };
  }
}
