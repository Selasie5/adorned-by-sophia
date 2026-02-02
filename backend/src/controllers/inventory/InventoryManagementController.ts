import { Inventory } from "../../models/inventory";

export class InventoryController {
  static async getAllInventory() {
    const inventory = await Inventory.find()
      .populate('product')
      .populate('createdBy', 'name email')
      .populate('updatedBy', 'name email')
      .sort({ createdAt: -1 });
    return {
      code: 200,
      success: true,
      message: "Inventory fetched successfully",
      data: inventory
    };
  }

  static async getInventoryById(id: string) {
    const inventory = await Inventory.findById(id)
      .populate('product')
      .populate('createdBy', 'name email')
      .populate('updatedBy', 'name email');
    if (!inventory) {
      return {
        code: 404,
        success: false,
        message: "Inventory not found",
        data: null
      };
    }
    return {
      code: 200,
      success: true,
      message: "Inventory fetched successfully",
      data: inventory
    };
  }

  static async getInventoryByProduct(productId: string) {
    const inventory = await Inventory.findOne({ product: productId })
      .populate('product')
      .populate('createdBy', 'name email')
      .populate('updatedBy', 'name email');
    return {
      code: 200,
      success: true,
      message: "Inventory fetched successfully",
      data: inventory
    };
  }

  static async createInventory(context: any, _: any, args: any) {
    if (!context.user) throw new Error('Authentication required');
    
    const { product, sizes, quantity } = args.input;
    const adminId = context.user._id;
    const role = context.user.role;

    if (role !== 'SUPER_ADMIN' && role !== 'ADMIN') {
      throw new Error('Unauthorized');
    }

    const existingInventory = await Inventory.findOne({ product });
    if (existingInventory) {
      return {
        code: 400,
        success: false,
        message: "Inventory already exists for this product",
        data: null
      };
    }

    const inventory = await Inventory.create({
      product,
      sizes,
      quantity,
      createdBy: adminId,
      updatedBy: adminId
    });

    await inventory.populate(['product', { path: 'createdBy', select: 'name email' }, { path: 'updatedBy', select: 'name email' }]);

    return {
      code: 201,
      success: true,
      message: "Inventory created successfully",
      data: inventory
    };
  }

  static async updateInventory(context: any, _: any, args: any) {
    if (!context.user) throw new Error('Authentication required');

    const { id } = args;
    const { sizes, quantity } = args.input;
    const adminId = context.user._id;
    const role = context.user.role;

    if (role !== 'SUPER_ADMIN' && role !== 'ADMIN') {
      throw new Error('Unauthorized');
    }

    const inventory = await Inventory.findByIdAndUpdate(
      id,
      { sizes, quantity, updatedBy: adminId },
      { new: true }
    ).populate(['product', { path: 'createdBy', select: 'name email' }, { path: 'updatedBy', select: 'name email' }]);

    if (!inventory) {
      return {
        code: 404,
        success: false,
        message: "Inventory not found",
        data: null
      };
    }

    return {
      code: 200,
      success: true,
      message: "Inventory updated successfully",
      data: inventory
    };
  }

  static async adjustStock(context: any, _: any, args: any) {
    if (!context.user) throw new Error('Authentication required');

    const { id, adjustment } = args;
    const adminId = context.user._id;
    const role = context.user.role;

    if (role !== 'SUPER_ADMIN' && role !== 'ADMIN') {
      throw new Error('Unauthorized');
    }

    const inventory = await Inventory.findById(id);
    if (!inventory) {
      return {
        code: 404,
        success: false,
        message: "Inventory not found",
        data: null
      };
    }

    const newQuantity = inventory.quantity + adjustment;
    if (newQuantity < 0) {
      return {
        code: 400,
        success: false,
        message: "Insufficient stock",
        data: null
      };
    }

    inventory.quantity = newQuantity;
    inventory.updatedBy = adminId;
    await inventory.save();
    await inventory.populate(['product', { path: 'createdBy', select: 'name email' }, { path: 'updatedBy', select: 'name email' }]);

    return {
      code: 200,
      success: true,
      message: `Stock ${adjustment > 0 ? 'increased' : 'decreased'} successfully`,
      data: inventory
    };
  }

  static async deleteInventory(context: any, _: any, args: any) {
    if (!context.user) throw new Error('Authentication required');

    const { id } = args;
    const role = context.user.role;

    if (role !== 'SUPER_ADMIN' && role !== 'ADMIN') {
      throw new Error('Unauthorized');
    }

    await Inventory.findByIdAndDelete(id);
    return {
      code: 200,
      success: true,
      message: "Inventory deleted successfully",
      data: null
    };
  }
}
