import { z } from "zod";

export const orderItemSchema = z.object({
  productName: z.string().min(2).max(120),
  category: z.string().min(2).max(80),
  quantityKg: z.number().positive().max(5000),
  isLocallySourced: z.boolean(),
  packaging: z.enum(["plastic", "compostable", "recycled", "none"]),
});

export const impactRequestSchema = z.object({
  orderId: z.string().min(3).max(60),
  customerName: z.string().min(2).max(120),
  items: z.array(orderItemSchema).min(1).max(100),
});

export const impactNarrativeSchema = z.object({
  impactStatement: z.string().min(12).max(280),
  headline: z.string().min(3).max(80),
});

export type ImpactRequest = z.infer<typeof impactRequestSchema>;
