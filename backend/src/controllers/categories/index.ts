import { Category } from "../../models/categories";
import { generateSlug } from "../../helpers/generateSlug";


export class CategoryController {
  static async getAllCategories() {
    try {
      const categories = await Category.find()
        .populate('parentCategory')
        .sort({ createdAt: -1 });
      return {
        code: 200,
        success: true,
        message: "Categories fetched successfully",
        data: categories
      };
    } catch (error: any) {
      return {
        code: 500,
        success: false,
        message: error.message || "Failed to fetch categories",
        data: null
      };
    }
  }

  static async getActiveCategories() {
    try {
      const categories = await Category.find({ isActive: true })
        .populate('parentCategory')
        .sort({ name: 1 });
      return {
        code: 200,
        success: true,
        message: "Active categories fetched successfully",
        data: categories
      };
    } catch (error: any) {
      return {
        code: 500,
        success: false,
        message: error.message || "Failed to fetch active categories",
        data: null
      };
    }
  }

  static async getCategoryById(id: string) {
    try {
      const category = await Category.findById(id).populate('parentCategory');
      if (!category) {
        return {
          code: 404,
          success: false,
          message: "Category not found",
          data: null
        };
      }
      return {
        code: 200,
        success: true,
        message: "Category fetched successfully",
        data: category
      };
    } catch (error: any) {
      return {
        code: 500,
        success: false,
        message: error.message || "Failed to fetch category",
        data: null
      };
    }
  }

  static async getCategoryBySlug(slug: string) {
    try {
      const category = await Category.findOne({ slug, isActive: true }).populate('parentCategory');
      if (!category) {
        return {
          code: 404,
          success: false,
          message: "Category not found",
          data: null
        };
      }
      return {
        code: 200,
        success: true,
        message: "Category fetched successfully",
        data: category
      };
    } catch (error: any) {
      return {
        code: 500,
        success: false,
        message: error.message || "Failed to fetch category",
        data: null
      };
    }
  }

  static async createCategory(context: any, _: any, args: any) {
    try {
      const { name, description, image, parentCategory } = args.input;
      const role = context.user?.role;

      if (role !== 'SUPER_ADMIN' && role !== 'ADMIN') {
        return {
          code: 403,
          success: false,
          message: "Unauthorized: Admin access required",
          data: null
        };
      }

      // Check if category with same name exists
      const existingCategory = await Category.findOne({ name: { $regex: new RegExp(`^${name}$`, 'i') } });
      if (existingCategory) {
        return {
          code: 400,
          success: false,
          message: "Category with this name already exists",
          data: null
        };
      }

      const slug = generateSlug(name);

      // Check if slug already exists
      let uniqueSlug = slug;
      let counter = 1;
      while (await Category.findOne({ slug: uniqueSlug })) {
        uniqueSlug = `${slug}-${counter}`;
        counter++;
      }

      const category = await Category.create({
        name,
        description,
        slug: uniqueSlug,
        image,
        parentCategory: parentCategory || null,
        isActive: true
      });

      await category.populate('parentCategory');

      return {
        code: 201,
        success: true,
        message: "Category created successfully",
        data: category
      };
    } catch (error: any) {
      return {
        code: 500,
        success: false,
        message: error.message || "Failed to create category",
        data: null
      };
    }
  }

  static async updateCategory(context: any, _: any, args: any) {
    try {
      const { id, input } = args;
      const { name, description, image, isActive, parentCategory } = input;
      const role = context.user?.role;

      if (role !== 'SUPER_ADMIN' && role !== 'ADMIN') {
        return {
          code: 403,
          success: false,
          message: "Unauthorized: Admin access required",
          data: null
        };
      }

      const existingCategory = await Category.findById(id);
      if (!existingCategory) {
        return {
          code: 404,
          success: false,
          message: "Category not found",
          data: null
        };
      }

      // If name is being updated, check for duplicates and update slug
      const updateData: any = {};
      
      if (name && name !== existingCategory.name) {
        const duplicateCategory = await Category.findOne({ 
          name: { $regex: new RegExp(`^${name}$`, 'i') },
          _id: { $ne: id }
        });
        if (duplicateCategory) {
          return {
            code: 400,
            success: false,
            message: "Category with this name already exists",
            data: null
          };
        }
        updateData.name = name;
        updateData.slug = generateSlug(name);
      }

      if (description !== undefined) updateData.description = description;
      if (image !== undefined) updateData.image = image;
      if (isActive !== undefined) updateData.isActive = isActive;
      if (parentCategory !== undefined) updateData.parentCategory = parentCategory || null;

      const category = await Category.findByIdAndUpdate(
        id,
        updateData,
        { new: true }
      ).populate('parentCategory');

      return {
        code: 200,
        success: true,
        message: "Category updated successfully",
        data: category
      };
    } catch (error: any) {
      return {
        code: 500,
        success: false,
        message: error.message || "Failed to update category",
        data: null
      };
    }
  }

  static async deleteCategory(context: any, _: any, args: any) {
    try {
      const { id } = args;
      const role = context.user?.role;

      if (role !== 'SUPER_ADMIN' && role !== 'ADMIN') {
        return {
          code: 403,
          success: false,
          message: "Unauthorized: Admin access required",
          data: null
        };
      }

      const category = await Category.findById(id);
      if (!category) {
        return {
          code: 404,
          success: false,
          message: "Category not found",
          data: null
        };
      }


      const childCategories = await Category.find({ parentCategory: id });
      if (childCategories.length > 0) {
        return {
          code: 400,
          success: false,
          message: "Cannot delete category with child categories. Delete child categories first.",
          data: null
        };
      }

      await Category.findByIdAndDelete(id);

      return {
        code: 200,
        success: true,
        message: "Category deleted successfully",
        data: null
      };
    } catch (error: any) {
      return {
        code: 500,
        success: false,
        message: error.message || "Failed to delete category",
        data: null
      };
    }
  }
}
