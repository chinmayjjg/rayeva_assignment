import groqClient, { GROQ_MODEL } from "../ai/groq";
import { parseJsonObject } from "../ai/json";
import {
  IMPACT_CONSTANTS,
  getPackagingReduction,
  getPlasticBaseline,
} from "../constants/impact";
import Order, { IOrderItem } from "../db/models/Order";
import { buildImpactPrompt } from "../prompts/impact";
import { impactNarrativeSchema } from "../validation/impact";
import { logAIExecution } from "./ai-log";

function round(value: number) {
  return Math.round(value * 100) / 100;
}

function calculatePlasticSavedGrams(items: IOrderItem[]) {
  return round(
    items.reduce((total, item) => {
      const baseline = getPlasticBaseline(item.category);
      const reduction = getPackagingReduction(item.packaging);
      return total + baseline * item.quantityKg * reduction;
    }, 0)
  );
}

function calculateCarbonAvoidedKg(items: IOrderItem[]) {
  return round(
    items.reduce((total, item) => {
      const packagingSavings =
        item.packaging === "plastic"
          ? 0
          : item.quantityKg *
            IMPACT_CONSTANTS.SUSTAINABLE_PACKAGING_CO2_SAVINGS_PER_KG;
      const sourcingSavings = item.isLocallySourced
        ? item.quantityKg * IMPACT_CONSTANTS.LOCAL_SOURCE_CO2_SAVINGS_PER_KG
        : 0;

      return total + packagingSavings + sourcingSavings;
    }, 0)
  );
}

function calculateLocalSourcingPercent(items: IOrderItem[]) {
  const totalWeight = items.reduce((sum, item) => sum + item.quantityKg, 0);
  const localWeight = items.reduce(
    (sum, item) => sum + (item.isLocallySourced ? item.quantityKg : 0),
    0
  );

  if (totalWeight === 0) {
    return 0;
  }

  return round((localWeight / totalWeight) * 100);
}

function buildLocalSourcingSummary(localSourcingPercent: number) {
  if (localSourcingPercent >= 75) {
    return "Most of the order is locally sourced, reducing freight intensity.";
  }

  if (localSourcingPercent >= 40) {
    return "A meaningful share of the order is locally sourced, lowering transport impact.";
  }

  if (localSourcingPercent > 0) {
    return "Some of the order is locally sourced, creating a moderate logistics benefit.";
  }

  return "This order currently has no local sourcing contribution.";
}

export async function generateImpactReport(input: {
  orderId: string;
  customerName: string;
  items: IOrderItem[];
}) {
  const plasticSavedGrams = calculatePlasticSavedGrams(input.items);
  const carbonAvoidedKg = calculateCarbonAvoidedKg(input.items);
  const localSourcingPercent = calculateLocalSourcingPercent(input.items);
  const localSourcingSummary = buildLocalSourcingSummary(localSourcingPercent);

  const prompt = buildImpactPrompt({
    orderId: input.orderId,
    customerName: input.customerName,
    plasticSavedGrams,
    carbonAvoidedKg,
    localSourcingPercent,
    localSourcingSummary,
  });
  const startedAt = Date.now();

  try {
    const completion = await groqClient.chat.completions.create({
      model: GROQ_MODEL,
      temperature: 0.3,
      messages: [
        {
          role: "system",
          content:
            "You convert verified sustainability metrics into concise B2B impact language.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      response_format: { type: "json_object" },
    });

    const responseText = completion.choices[0]?.message?.content ?? "{}";
    const narrative = impactNarrativeSchema.parse(parseJsonObject(responseText));

    const order = await Order.findOneAndUpdate(
      { orderId: input.orderId },
      {
        orderId: input.orderId,
        customerName: input.customerName,
        items: input.items,
        impactReport: {
          plasticSavedGrams,
          carbonAvoidedKg,
          localSourcingPercent,
          localSourcingSummary,
          impactStatement: narrative.impactStatement,
          rawAIOutput: narrative,
        },
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    await logAIExecution({
      module: "impact-report",
      prompt,
      response: responseText,
      parsedOutput: narrative,
      modelName: GROQ_MODEL,
      durationMs: Date.now() - startedAt,
      success: true,
    });

    return {
      orderDbId: order._id.toString(),
      orderId: input.orderId,
      plasticSavedGrams,
      carbonAvoidedKg,
      localSourcingPercent,
      localSourcingSummary,
      impactStatement: narrative.impactStatement,
      headline: narrative.headline,
    };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unknown AI impact error";

    await logAIExecution({
      module: "impact-report",
      prompt,
      response: "",
      parsedOutput: {},
      modelName: GROQ_MODEL,
      durationMs: Date.now() - startedAt,
      success: false,
      error: message,
    });

    throw error;
  }
}
