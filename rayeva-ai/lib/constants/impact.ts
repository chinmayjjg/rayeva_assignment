import { IOrderItem } from "../db/models/Order";

const DEFAULT_PLASTIC_GRAMS_PER_KG = 120;

const CATEGORY_PLASTIC_BASELINE: Record<string, number> = {
  packaging: 180,
  tableware: 140,
  "food service": 160,
  "hospitality supplies": 110,
  "office essentials": 70,
  "personal care": 90,
  "cleaning supplies": 80,
  "lifestyle accessories": 60,
};

const PACKAGING_PLASTIC_REDUCTION: Record<IOrderItem["packaging"], number> = {
  plastic: 0,
  compostable: 0.9,
  recycled: 0.65,
  none: 1,
};

const LOCAL_SOURCE_CO2_SAVINGS_PER_KG = 0.42;
const SUSTAINABLE_PACKAGING_CO2_SAVINGS_PER_KG = 0.18;

export function getPlasticBaseline(category: string): number {
  return (
    CATEGORY_PLASTIC_BASELINE[category.trim().toLowerCase()] ??
    DEFAULT_PLASTIC_GRAMS_PER_KG
  );
}

export function getPackagingReduction(packaging: IOrderItem["packaging"]): number {
  return PACKAGING_PLASTIC_REDUCTION[packaging] ?? 0;
}

export const IMPACT_CONSTANTS = {
  LOCAL_SOURCE_CO2_SAVINGS_PER_KG,
  SUSTAINABLE_PACKAGING_CO2_SAVINGS_PER_KG,
};
