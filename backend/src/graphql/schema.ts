import { authTypeDefs } from "./auth/schema";
import { productTypeDefs } from "./product/schema";
import { categoryTypeDefs } from "./category/schema";

export const typeDefs = [authTypeDefs, productTypeDefs, categoryTypeDefs];
