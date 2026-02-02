import { InventoryController } from "../../controllers/inventory/InventoryManagementController";

export const inventoryResolvers = {
  Query: {
    getAllInventory: async (_: any, __: any, context: any) => {
      return await InventoryController.getAllInventory();
    },
    getInventoryById: async (_: any, args: any, context: any) => {
      return await InventoryController.getInventoryById(args.id);
    },
    getInventoryByProduct: async (_: any, args: any, context: any) => {
      return await InventoryController.getInventoryByProduct(args.productId);
    }
  },
  Mutation: {
    createInventory: async (_: any, args: any, context: any) => {
      return await InventoryController.createInventory(context, _, args);
    },
    updateInventory: async (_: any, args: any, context: any) => {
      return await InventoryController.updateInventory(context, _, args);
    },
    adjustStock: async (_: any, args: any, context: any) => {
      return await InventoryController.adjustStock(context, _, args);
    },
    deleteInventory: async (_: any, args: any, context: any) => {
      return await InventoryController.deleteInventory(context, _, args);
    }
  }
};
