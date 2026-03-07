import mongoose, { Schema, Document, Model } from "mongoose";

export interface IProduct extends Document {
  name: string;
  description: string;
  primaryCategory: string;
  subCategory: string;
  seoTags: string[];
  sustainabilityFilters: string[];
  rawAIOutput: object;
  createdAt: Date;
  updatedAt: Date;
}

const ProductSchema = new Schema<IProduct>(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    primaryCategory: { type: String, required: true },
    subCategory: { type: String, required: true },
    seoTags: { type: [String], default: [] },
    sustainabilityFilters: { type: [String], default: [] },
    rawAIOutput: { type: Schema.Types.Mixed, default: {} },
  },
  { timestamps: true }
);

const Product: Model<IProduct> =
  mongoose.models.Product ?? mongoose.model<IProduct>("Product", ProductSchema);

export default Product;