import { CategoryController } from "../../controllers/categories";

export const categoryResolvers = {
  Query: {
    getAllCategories: async (_: any, __: any, context: any) => {
      return await CategoryController.getAllCategories();
    },
    getCategoryById: async (_: any, args: { id: string }, context: any) => {
      return await CategoryController.getCategoryById(args.id);
    }
  },
  Mutation: {
    createCategory: async (_: any, args: any, context: any) => {
      return await CategoryController.createCategory(context, _, args);
    },
    updateCategory: async (_: any, args: any, context: any) => {
      return await CategoryController.updateCategory(context, _, args);
    },
    deleteCategory: async (_: any, args: any, context: any) => {
      return await CategoryController.deleteCategory(context, _, args);
    }
  }
};
