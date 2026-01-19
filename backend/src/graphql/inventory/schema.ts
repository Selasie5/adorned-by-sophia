import gql from "graphql-tag";

export const inventoryTypeDefs = gql`
type InventoryAdmin {
  id: ID!
  name: String
  email: String
}

type Inventory {
  id: ID!
  product: Product!
  sizes: [String!]!
  quantity: Int!
  createdBy: InventoryAdmin
  updatedBy: InventoryAdmin
  createdAt: String!
  updatedAt: String!
}

type InventoryResponse {
  code: Int!
  success: Boolean!
  message: String!
  data: Inventory
}

type InventoriesResponse {
  code: Int!
  success: Boolean!
  message: String!
  data: [Inventory]
}

input InventoryInput {
  product: ID!
  sizes: [String!]!
  quantity: Int!
}

input InventoryUpdateInput {
  sizes: [String!]!
  quantity: Int!
}

type Query {
  getAllInventory: InventoriesResponse!
  getInventoryById(id: ID!): InventoryResponse!
  getInventoryByProduct(productId: ID!): InventoryResponse!
}

type Mutation {
  createInventory(input: InventoryInput!): InventoryResponse!
  updateInventory(id: ID!, input: InventoryUpdateInput!): InventoryResponse!
  adjustStock(id: ID!, adjustment: Int!): InventoryResponse!
  deleteInventory(id: ID!): InventoryResponse!
}
`;
