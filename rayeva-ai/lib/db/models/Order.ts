import mongoose, { Schema, Document, Model } from "mongoose";

export interface IOrderItem {
  productName: string;
  category: string;
  quantityKg: number;
  isLocallySourced: boolean;
  packaging: "plastic" | "compostable" | "recycled" | "none";
}

export interface IImpactReport {
  plasticSavedGrams: number;
  carbonAvoidedKg: number;
  localSourcingPercent: number;
  localSourcingSummary: string;
  impactStatement: string;
  rawAIOutput: object;
}

export interface IOrder extends Document {
  orderId: string;
  customerName: string;
  items: IOrderItem[];
  impactReport?: IImpactReport;
  createdAt: Date;
  updatedAt: Date;
}

const OrderItemSchema = new Schema<IOrderItem>(
  {
    productName: { type: String, required: true },
    category: { type: String, required: true },
    quantityKg: { type: Number, required: true },
    isLocallySourced: { type: Boolean, default: false },
    packaging: {
      type: String,
      enum: ["plastic", "compostable", "recycled", "none"],
      required: true,
    },
  },
  { _id: false }
);

const ImpactReportSchema = new Schema<IImpactReport>(
  {
    plasticSavedGrams: { type: Number },
    carbonAvoidedKg: { type: Number },
    localSourcingPercent: { type: Number },
    localSourcingSummary: { type: String },
    impactStatement: { type: String },
    rawAIOutput: { type: Schema.Types.Mixed, default: {} },
  },
  { _id: false }
);

const OrderSchema = new Schema<IOrder>(
  {
    orderId: { type: String, required: true, unique: true },
    customerName: { type: String, required: true },
    items: { type: [OrderItemSchema], required: true },
    impactReport: { type: ImpactReportSchema },
  },
  { timestamps: true }
);

const Order: Model<IOrder> =
  mongoose.models.Order ?? mongoose.model<IOrder>("Order", OrderSchema);

export default Order;