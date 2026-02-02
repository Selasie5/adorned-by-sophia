import mongoose,  { Schema } from "mongoose"



interface InventoryModel  {
  id:string,
  product: mongoose.Types.ObjectId,
  sizes : string[],
  createdBy: mongoose.Types.ObjectId,
  updatedBy: mongoose.Types.ObjectId,
  quantity: number,
  createdAt: Date,
  updatedAt: Date

}




const IInventorySchema = new Schema<InventoryModel>({
  product: {
    type: Schema.Types.ObjectId,
    ref: "Product",
    required: true
  },
  sizes: {
    type: [Schema.Types.String],
    required: true,
  },
  quantity: {
    type: Schema.Types.Number,
    required: true,
    default: 0
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

export const Inventory = mongoose.model<InventoryModel>("Inventory", IInventorySchema);
