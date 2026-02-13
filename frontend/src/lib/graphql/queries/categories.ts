import { gql } from "@apollo/client";

export const GET_CATEGORIES = gql`
  query Categories {
    categories {
      id
      name
      description
      color
      icon
      userId
      transactionCount
      createdAt
      updatedAt
    }
  }
`;

export const GET_CATEGORY = gql`
  query Category($id: String!) {
    category(id: $id) {
      id
      name
      description
      color
      icon
      userId
      createdAt
      updatedAt
    }
  }
`;

export const GET_CATEGORY_STATS = gql`
  query CategoryStats {
    categoryStats {
      totalCategories
      totalTransactions
      mostUsedCategory {
        id
        name
        description
        color
        icon
        userId
        createdAt
        updatedAt
      }
      mostUsedCategoryCount
    }
  }
`;
