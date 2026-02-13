import { gql } from "@apollo/client";

export const GET_DASHBOARD = gql`
  query Dashboard($month: Int, $year: Int) {
    dashboard(month: $month, year: $year) {
      balance {
        total
        income
        expense
      }
      recentTransactions {
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
      topCategories {
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
        transactionCount
        totalAmount
      }
    }
  }
`;
