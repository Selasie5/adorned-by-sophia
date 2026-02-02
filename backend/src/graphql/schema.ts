import { authTypeDefs } from "./auth/schema";
import { productTypeDefs } from "./product/schema";
import { categoryTypeDefs } from "./category/schema";
import { inventoryTypeDefs } from "./inventory/schema";

export const typeDefs = [authTypeDefs, productTypeDefs, categoryTypeDefs, inventoryTypeDefs];
