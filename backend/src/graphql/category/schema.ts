import gql from "graphql-tag";

export const categoryTypeDefs = gql`
  type Category {
    id: ID!
    name: String!
    description: String
    parentCategory: Category
    createdAt: String!
    updatedAt: String!
  }

  type CategoryResponse {
    code: Int!
    success: Boolean!
    message: String!
    data: Category
  }

  type CategoriesResponse {
    code: Int!
    success: Boolean!
    message: String!
    data: [Category]
  }

  input CreateCategoryInput {
    name: String!
    description: String
    parentCategory: ID
  }

  input UpdateCategoryInput {
    name: String
    description: String
    image: String
    isActive: Boolean
    parentCategory: ID
  }

  type Query {
    getAllCategories: CategoriesResponse!
    getCategoryById(id: ID!): CategoryResponse!
    getCategoryBySlug(slug: String!): CategoryResponse!
    getActiveCategories: CategoriesResponse!
  }

  type Mutation {
    createCategory(input: CreateCategoryInput!): CategoryResponse!
    updateCategory(id: ID!, input: UpdateCategoryInput!): CategoryResponse!
    deleteCategory(id: ID!): CategoryResponse!
  }
`;
