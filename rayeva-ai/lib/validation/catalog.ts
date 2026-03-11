import { z } from "zod";
import {
  PRODUCT_CATEGORIES,
  SUSTAINABILITY_FILTERS,
} from "../constants/catalog";

export const catalogRequestSchema = z.object({
  name: z.string().min(2).max(120),
  description: z.string().min(20).max(2000),
  materials: z.array(z.string().min(2).max(50)).max(10).optional(),
  targetAudience: z.string().min(2).max(80).optional(),
});

export const catalogResponseSchema = z.object({
  primaryCategory: z.enum(PRODUCT_CATEGORIES),
  subCategory: z.string().min(2).max(80),
  seoTags: z.array(z.string().min(2).max(40)).min(5).max(10),
  sustainabilityFilters: z.array(z.enum(SUSTAINABILITY_FILTERS)).max(10),
  reasoningSummary: z.string().min(5).max(240),
});

export type CatalogRequest = z.infer<typeof catalogRequestSchema>;
export type CatalogResponse = z.infer<typeof catalogResponseSchema>;
