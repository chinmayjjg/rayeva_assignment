import {
  PRODUCT_CATEGORIES,
  SUSTAINABILITY_FILTERS,
} from "../constants/catalog";

type CatalogPromptInput = {
  name: string;
  description: string;
  materials?: string[];
  targetAudience?: string;
};

export function buildCatalogPrompt(input: CatalogPromptInput) {
  return `
You are an AI merchandiser for a sustainable commerce platform.
Return only valid JSON. Do not include markdown, commentary, or trailing text.

Primary category must be one of:
${PRODUCT_CATEGORIES.map((category) => `- ${category}`).join("\n")}

Sustainability filters must be chosen only from:
${SUSTAINABILITY_FILTERS.map((filter) => `- ${filter}`).join("\n")}

JSON shape:
{
  "primaryCategory": "string",
  "subCategory": "string",
  "seoTags": ["string", "string", "string", "string", "string"],
  "sustainabilityFilters": ["string"],
  "reasoningSummary": "string"
}

Constraints:
- "seoTags" must contain 5 to 10 concise tags.
- "sustainabilityFilters" can be empty, but must not include unsupported values.
- "subCategory" should be specific and retail-friendly.
- "reasoningSummary" must be one short sentence.

Product input:
${JSON.stringify(input, null, 2)}
`.trim();
}
