import mongoose, {Schema, Document, ObjectId} from "mongoose";


export interface IProduct extends Document {
  name: string;
  description: string;
  images: string[];
  category: ObjectId;
  price : string;
  createdBy: ObjectId;
  updatedBy: ObjectId;
  createdAt: Date;
  updatedAt: Date;
}


const ProductSchema = new Schema<IProduct>({
  name: {
    type: Schema.Types.String,
    required: true
  },
  description: {
    type: Schema.Types.String,
    required: true,
  },
  images: {
    type: [Schema.Types.String],
    required: true,
  },
  category: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "Category"
  },
  price: {
    type: Schema.Types.String,
    required: true,
  },
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: "Admin",
    required: true
  },
  updatedBy: {
    type: Schema.Types.ObjectId,
    ref: "Admin",
    required: true
  }

}, {
  timestamps: true
})

ProductSchema.index({ name: 'text', description: 'text' });
export const Product = mongoose.model<IProduct>("Product", ProductSchema);
