
import { ProductController } from "../../controllers/products";

export const ProductResolvers = {
  Query: {
    getAllProducts:  async(_: any, __: any, context: any) => {
      return await ProductController.getAllProducts();
    },
    getProductById: async(_: any, args: any, context: any) => {
      const {id} = args;
      return await ProductController.getProductById(id);
    }
  },
  Mutation: {
    createProduct: async(_: any, args: any, context: any) => {
      return await ProductController.createProduct(context, _, args);
    },
    updateProduct: async(_: any, args: any, context: any) => {
      return await ProductController.updateProduct(context, _, args);
    },
    deleteProduct: async(_: any, args: any, context: any) => {
      return await ProductController.deleteProduct(context, _, args);
    }
  }
  
}
