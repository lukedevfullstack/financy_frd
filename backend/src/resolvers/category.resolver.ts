import { Arg, Mutation, Query, Resolver, UseMiddleware } from "type-graphql";
import {
  CreateCategoryInput,
  UpdateCategoryInput,
} from "../dtos/input/category.input";
import {
  DeleteCategoryOutput,
  CategoryStatsForListOutput,
} from "../dtos/output/category.output";
import { CategoryModel } from "../models/category.model";
import { CategoryService } from "../services/category.service";
import { IsAuth } from "../middlewares/auth.middleware";
import { GqlUser } from "../graphql/decorators/user.decorator";
import { User, Category } from "@prisma/client";
import { CategoryStatsData, CategoryWithCount } from "../types/category.types";

@Resolver()
export class CategoryResolver {
  private categoryService = new CategoryService();

  @Query(() => [CategoryModel])
  @UseMiddleware(IsAuth)
  async categories(@GqlUser() user: User): Promise<CategoryWithCount[]> {
    const categories = await this.categoryService.findAll(user.id);
    return categories;
  }

  @Query(() => CategoryStatsForListOutput)
  @UseMiddleware(IsAuth)
  async categoryStats(@GqlUser() user: User): Promise<CategoryStatsData> {
    return this.categoryService.getCategoryStats(user.id);
  }

  @Query(() => CategoryModel, { nullable: true })
  @UseMiddleware(IsAuth)
  async category(
    @Arg("id", () => String) id: string,
    @GqlUser() user: User,
  ): Promise<Category | null> {
    const category = await this.categoryService.findById(id, user.id);

    if (!category) {
      throw new Error("Category not found");
    }

    return category;
  }

  @Mutation(() => CategoryModel)
  @UseMiddleware(IsAuth)
  async createCategory(
    @Arg("data", () => CreateCategoryInput) data: CreateCategoryInput,
    @GqlUser() user: User,
  ): Promise<Category> {
    const category = await this.categoryService.create(user.id, data);
    return category;
  }

  @Mutation(() => CategoryModel)
  @UseMiddleware(IsAuth)
  async updateCategory(
    @Arg("id", () => String) id: string,
    @Arg("data", () => UpdateCategoryInput) data: UpdateCategoryInput,
    @GqlUser() user: User,
  ): Promise<Category> {
    const category = await this.categoryService.update(id, user.id, data);
    return category;
  }

  @Mutation(() => DeleteCategoryOutput)
  @UseMiddleware(IsAuth)
  async deleteCategory(
    @Arg("id", () => String) id: string,
    @GqlUser() user: User,
  ): Promise<DeleteCategoryOutput> {
    await this.categoryService.delete(id, user.id);
    return {
      success: true,
      message: "Category deleted successfully",
    };
  }
}
