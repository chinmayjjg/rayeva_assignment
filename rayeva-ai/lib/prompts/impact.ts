type ImpactPromptInput = {
  orderId: string;
  customerName: string;
  plasticSavedGrams: number;
  carbonAvoidedKg: number;
  localSourcingPercent: number;
  localSourcingSummary: string;
};

export function buildImpactPrompt(input: ImpactPromptInput) {
  return `
You write concise impact summaries for a B2B sustainable commerce platform.
Return only valid JSON. Do not include markdown or extra text.

JSON shape:
{
  "impactStatement": "string",
  "headline": "string"
}

Constraints:
- "impactStatement" must be 2 sentences max and grounded only in the provided metrics.
- "headline" must be 8 words or fewer.
- Do not invent certifications, percentages, or claims beyond the input.

Impact data:
${JSON.stringify(input, null, 2)}
`.trim();
}
