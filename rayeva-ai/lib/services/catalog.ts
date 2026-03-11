import groqClient, { GROQ_MODEL } from "../ai/groq";
import { parseJsonObject } from "../ai/json";
import Product from "../db/models/Product";
import { buildCatalogPrompt } from "../prompts/catalog";
import {
  CatalogRequest,
  CatalogResponse,
  catalogResponseSchema,
} from "../validation/catalog";
import { logAIExecution } from "./ai-log";

export async function generateCatalogMetadata(input: CatalogRequest) {
  const prompt = buildCatalogPrompt(input);
  const startedAt = Date.now();

  try {
    const completion = await groqClient.chat.completions.create({
      model: GROQ_MODEL,
      temperature: 0.2,
      messages: [
        {
          role: "system",
          content:
            "You classify sustainable commerce products and return strict JSON.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      response_format: { type: "json_object" },
    });

    const responseText = completion.choices[0]?.message?.content ?? "{}";
    const parsed = catalogResponseSchema.parse(
      parseJsonObject<CatalogResponse>(responseText)
    );

    const product = await Product.create({
      name: input.name,
      description: input.description,
      primaryCategory: parsed.primaryCategory,
      subCategory: parsed.subCategory,
      seoTags: parsed.seoTags,
      sustainabilityFilters: parsed.sustainabilityFilters,
      rawAIOutput: parsed,
    });

    await logAIExecution({
      module: "categorize",
      prompt,
      response: responseText,
      parsedOutput: parsed,
      modelName: GROQ_MODEL,
      durationMs: Date.now() - startedAt,
      success: true,
    });

    return {
      productId: product._id.toString(),
      ...parsed,
    };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unknown AI catalog error";

    await logAIExecution({
      module: "categorize",
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
