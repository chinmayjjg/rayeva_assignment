import mongoose, { Schema, Document, Model } from "mongoose";

export interface IAILog extends Document {
  module: "categorize" | "impact-report";
  prompt: string;
  response: string;
  parsedOutput: object;
  modelName: string;
  durationMs: number;
  success: boolean;
  error?: string;
  createdAt: Date;
}

const AILogSchema = new Schema<IAILog>(
  {
    module: {
      type: String,
      enum: ["categorize", "impact-report"],
      required: true,
    },
    prompt: { type: String, required: true },
    response: { type: String, required: true },
    parsedOutput: { type: Schema.Types.Mixed, default: {} },
    modelName: { type: String, required: true },
    durationMs: { type: Number, required: true },
    success: { type: Boolean, required: true },
    error: { type: String },
  },
  { timestamps: true }
);

const AILog: Model<IAILog> =
  mongoose.models.AILog ?? mongoose.model<IAILog>("AILog", AILogSchema);

export default AILog;
