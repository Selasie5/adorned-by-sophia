import { authResolvers } from "./auth/resolver";
import { ProductResolvers } from "./product/resolver";
import { categoryResolvers } from "./category/resolver";
import { inventoryResolvers } from "./inventory/resolver";

export const resolvers = {
  Query: {
    ...authResolvers.Query,
    ...ProductResolvers.Query,
    ...categoryResolvers.Query,
    ...inventoryResolvers.Query
  },
  Mutation: {
    ...authResolvers.Mutation,
    ...ProductResolvers.Mutation,
    ...categoryResolvers.Mutation,
    ...inventoryResolvers.Mutation
  }
};
