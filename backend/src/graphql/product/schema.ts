import gql from "graphql-tag";

export const productTypeDefs = gql`
type Product {
  id: ID!
  name: String!
  description: String!  
  images: [String!]!
  category: Category!
  price: String!
  createdAt: String!
  updatedAt: String!
}

type ProductResponse {
  code: Int!
  success: Boolean!
  message: String!
  data: Product
}

type ProductsResponse {
  code: Int!  
  success: Boolean!
  message: String!
  data: [Product]
}

input ProductInput {
  name: String!
  description: String!  
  images: [String!]!
  category: ID!
  price: String!
}

type Query {
  getAllProducts: ProductsResponse!
  getProductById(id: ID!): ProductResponse!
}

type Mutation {
  createProduct(input: ProductInput!): ProductResponse!
  updateProduct(input: ProductInput!, id: ID!): ProductResponse!
  deleteProduct(id: ID!): ProductResponse!
}

`
