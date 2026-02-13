import { registerEnumType } from "type-graphql";

export enum TransactionType {
  INCOME = "income",
  EXPENSE = "expense",
}

registerEnumType(TransactionType, {
  name: "TransactionType",
  description: "Tipo de transação: receita ou despesa",
});
