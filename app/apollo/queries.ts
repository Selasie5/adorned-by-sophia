import { gql } from '@apollo/client';

export const GET_ALL_CATEGORIES = gql`
  query GetAllCategories {
    getAllCategories {
      code
      success
      message
      data {
        id
        name
        description
       
        createdAt
        updatedAt
      }
    }
  }
`;

export const GET_ALL_PRODUCTS = gql`
  query GetAllProducts {
    getAllProducts {
      code
      success
      message
      data {
        id
        name
        description
        images
        category {
          id
          name
        }
        price
        createdAt
        updatedAt
      }
    }
  }
`;

export const GET_ALL_INVENTORY = gql`
  query GetAllInventory {
    getAllInventory {
      code
      success
      message
      data {
        id
        product {
          id
          name
          images
          price
        }
        sizes
        quantity
        createdBy { id name email }
        updatedBy { id name email }
        createdAt
        updatedAt
      }
    }
  }
`;
