import { Arg, Mutation, Query, Resolver, UseMiddleware } from "type-graphql";
import {
  CreateTransactionInput,
  UpdateTransactionInput,
  TransactionFilterInput,
  TransactionPaginationInput,
} from "../dtos/input/transaction.input";
import {
  DeleteTransactionOutput,
  PaginatedTransactionsOutput,
} from "../dtos/output/transaction.output";
import { TransactionModel } from "../models/transaction.model";
import { TransactionService } from "../services/transaction.service";
import { IsAuth } from "../middlewares/auth.middleware";
import { GqlUser } from "../graphql/decorators/user.decorator";
import { User } from "@prisma/client";
import {
  TransactionWithCategory,
  PaginatedTransactions,
} from "../types/transaction.types";

@Resolver()
export class TransactionResolver {
  private transactionService = new TransactionService();

  @Query(() => [TransactionModel])
  @UseMiddleware(IsAuth)
  async transactions(
    @GqlUser() user: User,
  ): Promise<TransactionWithCategory[]> {
    const transactions = await this.transactionService.findAll(user.id);
    return transactions;
  }

  @Query(() => PaginatedTransactionsOutput)
  @UseMiddleware(IsAuth)
  async transactionsPaginated(
    @GqlUser() user: User,
    @Arg("filters", () => TransactionFilterInput, { nullable: true })
    filters?: TransactionFilterInput,
    @Arg("pagination", () => TransactionPaginationInput, { nullable: true })
    pagination?: TransactionPaginationInput,
  ): Promise<PaginatedTransactions> {
    return this.transactionService.findAllWithFilters(
      user.id,
      filters,
      pagination,
    );
  }

  @Query(() => TransactionModel, { nullable: true })
  @UseMiddleware(IsAuth)
  async transaction(
    @Arg("id", () => String) id: string,
    @GqlUser() user: User,
  ): Promise<TransactionWithCategory | null> {
    const transaction = await this.transactionService.findById(id, user.id);

    if (!transaction) {
      throw new Error("Transaction not found");
    }

    return transaction;
  }

  @Mutation(() => TransactionModel)
  @UseMiddleware(IsAuth)
  async createTransaction(
    @Arg("data", () => CreateTransactionInput) data: CreateTransactionInput,
    @GqlUser() user: User,
  ): Promise<TransactionWithCategory> {
    const transaction = await this.transactionService.create(user.id, data);
    return transaction;
  }

  @Mutation(() => TransactionModel)
  @UseMiddleware(IsAuth)
  async updateTransaction(
    @Arg("id", () => String) id: string,
    @Arg("data", () => UpdateTransactionInput) data: UpdateTransactionInput,
    @GqlUser() user: User,
  ): Promise<TransactionWithCategory> {
    const transaction = await this.transactionService.update(id, user.id, data);
    return transaction;
  }

  @Mutation(() => DeleteTransactionOutput)
  @UseMiddleware(IsAuth)
  async deleteTransaction(
    @Arg("id", () => String) id: string,
    @GqlUser() user: User,
  ): Promise<DeleteTransactionOutput> {
    await this.transactionService.delete(id, user.id);
    return {
      success: true,
      message: "Transaction deleted successfully",
    };
  }
}
