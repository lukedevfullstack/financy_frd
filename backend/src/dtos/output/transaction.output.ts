import { Field, Int, ObjectType } from "type-graphql";
import { TransactionModel } from "../../models/transaction.model";

@ObjectType()
export class TransactionOutput {
  @Field(() => TransactionModel)
  transaction!: TransactionModel;
}

@ObjectType()
export class TransactionsOutput {
  @Field(() => [TransactionModel])
  transactions!: TransactionModel[];
}

@ObjectType()
export class DeleteTransactionOutput {
  @Field(() => Boolean)
  success!: boolean;

  @Field(() => String)
  message!: string;
}

@ObjectType()
export class PaginatedTransactionsOutput {
  @Field(() => [TransactionModel])
  transactions!: TransactionModel[];

  @Field(() => Int)
  total!: number;

  @Field(() => Int)
  page!: number;

  @Field(() => Int)
  limit!: number;

  @Field(() => Int)
  totalPages!: number;
}
