import { Field, Float, InputType, Int } from "type-graphql";
import { TransactionType } from "../../types/transaction-type.enum";

@InputType()
export class CreateTransactionInput {
  @Field(() => String)
  description!: string;

  @Field(() => Float)
  amount!: number;

  @Field(() => TransactionType)
  type!: TransactionType;

  @Field(() => Date, { nullable: true })
  date?: Date;

  @Field(() => String, { nullable: true })
  categoryId?: string;
}

@InputType()
export class UpdateTransactionInput {
  @Field(() => String, { nullable: true })
  description?: string;

  @Field(() => Float, { nullable: true })
  amount?: number;

  @Field(() => TransactionType, { nullable: true })
  type?: TransactionType;

  @Field(() => Date, { nullable: true })
  date?: Date;

  @Field(() => String, { nullable: true })
  categoryId?: string;
}

@InputType()
export class TransactionFilterInput {
  @Field(() => String, { nullable: true })
  description?: string;

  @Field(() => TransactionType, { nullable: true })
  type?: TransactionType;

  @Field(() => String, { nullable: true })
  categoryId?: string;

  @Field(() => Int, { nullable: true })
  month?: number;

  @Field(() => Int, { nullable: true })
  year?: number;
}

@InputType()
export class TransactionPaginationInput {
  @Field(() => Int, { defaultValue: 1 })
  page!: number;

  @Field(() => Int, { defaultValue: 10 })
  limit!: number;
}
