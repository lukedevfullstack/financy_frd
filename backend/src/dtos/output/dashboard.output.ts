import { Field, Float, Int, ObjectType } from "type-graphql";
import { TransactionModel } from "../../models/transaction.model";
import { CategoryModel } from "../../models/category.model";

@ObjectType()
export class BalanceOutput {
  @Field(() => Float)
  total!: number;

  @Field(() => Float)
  income!: number;

  @Field(() => Float)
  expense!: number;
}

@ObjectType()
export class CategoryStatsOutput {
  @Field(() => CategoryModel)
  category!: CategoryModel;

  @Field(() => Int)
  transactionCount!: number;

  @Field(() => Float)
  totalAmount!: number;
}

@ObjectType()
export class DashboardOutput {
  @Field(() => BalanceOutput)
  balance!: BalanceOutput;

  @Field(() => [TransactionModel])
  recentTransactions!: TransactionModel[];

  @Field(() => [CategoryStatsOutput])
  topCategories!: CategoryStatsOutput[];
}
