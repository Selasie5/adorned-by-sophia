import { authResolvers } from "./auth/resolver";
import { ProductResolvers } from "./product/resolver";
import { categoryResolvers } from "./category/resolver";

export const resolvers = {
  Query: {
    ...authResolvers.Query,
    ...ProductResolvers.Query,
    ...categoryResolvers.Query
  },
  Mutation: {
    ...authResolvers.Mutation,
    ...ProductResolvers.Mutation,
    ...categoryResolvers.Mutation
  }
};
