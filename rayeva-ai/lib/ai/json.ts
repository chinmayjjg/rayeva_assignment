export function extractJsonObject(value: string): string {
  const trimmed = value.trim();

  if (trimmed.startsWith("{") && trimmed.endsWith("}")) {
    return trimmed;
  }

  const match = trimmed.match(/\{[\s\S]*\}/);

  if (!match) {
    throw new Error("Model response did not contain a JSON object");
  }

  return match[0];
}

export function parseJsonObject<T>(value: string): T {
  return JSON.parse(extractJsonObject(value)) as T;
}
