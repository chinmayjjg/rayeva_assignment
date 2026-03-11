import AILog from "../db/models/AILog";

type LogAIExecutionInput = {
  module: "categorize" | "impact-report";
  prompt: string;
  response: string;
  parsedOutput: object;
  modelName: string;
  durationMs: number;
  success: boolean;
  error?: string;
};

export async function logAIExecution(input: LogAIExecutionInput) {
  await AILog.create(input);
}
