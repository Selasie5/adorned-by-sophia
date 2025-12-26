import mongoose, { Document, Schema } from "mongoose";

export interface ICategory extends Document {
  name: string;
  description?: string;
  slug: string;
  image?: string;
  isActive: boolean;
  parentCategory?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const CategorySchema = new Schema<ICategory>(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      trim: true
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true
    },
    image: {
      type: String
    },
    isActive: {
      type: Boolean,
      default: true
    },
    parentCategory: {
      type: Schema.Types.ObjectId,
      ref: 'Category',
      default: null
    }
  },
  {
    timestamps: true
  }
);

// Index for faster queries
CategorySchema.index({ slug: 1 });
CategorySchema.index({ isActive: 1 });
CategorySchema.index({ parentCategory: 1 });

export const Category = mongoose.model<ICategory>("Category", CategorySchema);
