import { Product } from "../../models/products";

export class ProductController {
  static async getAllProducts()
  {
    const products = await Product.find().populate('category').sort({ createdAt: -1 });
    return {
      code:200,
      success:true,
      message:"Products fetched successfully",
      data:products
    };
  }

  static async getProductById(id:string){
    const product = await Product.findById(id).populate('category');
    return {
      code:200,
      success:true,
      message:"Product fetched successfully",
      data:product
    }
  }

  static async createProduct( context:any, _:any, args:any){
   if (!context.user) {
     throw new Error('Authentication required');
   }
   
   const {name, description, images, category, price} = args.input;
   const adminId = context.user._id;
   const role = context.user.role;

   if (role !== 'SUPER_ADMIN' && role !== 'ADMIN') {
    throw new Error('Unauthorized');
   }
  
    const product  = await Product.create({
      name,
      description, 
      images,
      category,
      price,
      createdBy: adminId,
      updatedBy: adminId
    });
    
    // Populate category before returning
    await product.populate('category');
    
    return {
      code:201,
      success:true,
      message:"Product created successfully",
      data:product
    }
  }
  static async updateProduct(context:any, _:any, args:any){
    if (!context.user) {
      throw new Error('Authentication required');
    }
    
    const {id} = args;
    const {name, description, images, category, price} = args.input;
    const adminId = context.user._id;
    const role = context.user.role;
    if (role !== 'SUPER_ADMIN' && role !== 'ADMIN') {
      throw new Error('Unauthorized');
     }  
    const product = await Product.findByIdAndUpdate(id, {
      name,
      description,
      images,
      category,
      price,
      updatedBy: adminId
    }, {new: true}).populate('category');
    return {
      code:200,
      success:true,
      message:"Product updated successfully",
      data:product
    }
  }
  static async deleteProduct(context:any, _:any, args:any){
    if (!context.user) {
      throw new Error('Authentication required');
    }
    
    const {id} = args;
    const role = context.user.role;
    if (role !== 'SUPER_ADMIN' && role !== 'ADMIN') {
      throw new Error('Unauthorized');
     }
    await Product.findByIdAndDelete(id);
    return {
      code:200,
      success:true,
      message:"Product deleted successfully",
      data:null
    }
  }
}
