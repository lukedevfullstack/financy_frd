import { Field, Int, ObjectType } from "type-graphql";
import { CategoryModel } from "../../models/category.model";

@ObjectType()
export class CategoryOutput {
  @Field(() => CategoryModel)
  category!: CategoryModel;
}

@ObjectType()
export class CategoriesOutput {
  @Field(() => [CategoryModel])
  categories!: CategoryModel[];
}

@ObjectType()
export class DeleteCategoryOutput {
  @Field(() => Boolean)
  success!: boolean;

  @Field(() => String)
  message!: string;
}

@ObjectType()
export class CategoryStatsForListOutput {
  @Field(() => Int)
  totalCategories!: number;

  @Field(() => Int)
  totalTransactions!: number;

  @Field(() => CategoryModel, { nullable: true })
  mostUsedCategory?: CategoryModel;

  @Field(() => Int, { nullable: true })
  mostUsedCategoryCount?: number;
}
