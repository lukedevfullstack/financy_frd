import { gql } from "@apollo/client";

export const GET_TRANSACTIONS = gql`
  query Transactions {
    transactions {
      id
      description
      amount
      type
      date
      categoryId
      category {
        id
        name
        description
        color
        icon
        userId
        createdAt
        updatedAt
      }
      userId
      createdAt
      updatedAt
    }
  }
`;

export const GET_TRANSACTIONS_PAGINATED = gql`
  query TransactionsPaginated(
    $filters: TransactionFilterInput
    $pagination: TransactionPaginationInput
  ) {
    transactionsPaginated(filters: $filters, pagination: $pagination) {
      transactions {
        id
        description
        amount
        type
        date
        categoryId
        category {
          id
          name
          description
          color
          icon
          userId
          createdAt
          updatedAt
        }
        userId
        createdAt
        updatedAt
      }
      total
      page
      limit
      totalPages
    }
  }
`;

export const GET_TRANSACTION = gql`
  query Transaction($id: String!) {
    transaction(id: $id) {
      id
      description
      amount
      type
      date
      categoryId
      category {
        id
        name
        description
        color
        icon
        userId
        createdAt
        updatedAt
      }
      userId
      createdAt
      updatedAt
    }
  }
`;
