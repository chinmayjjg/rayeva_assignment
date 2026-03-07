import OpenAI from "openai";

if (!process.env.NVIDIA_API_KEY) {
  throw new Error("Missing NVIDIA_API_KEY in environment variables");
}

if (!process.env.NVIDIA_BASE_URL) {
  throw new Error("Missing NVIDIA_BASE_URL in environment variables");
}


const nvidiaClient = new OpenAI({
  apiKey: process.env.NVIDIA_API_KEY,
  baseURL: process.env.NVIDIA_BASE_URL,
});

export const NVIDIA_MODEL =
  process.env.NVIDIA_MODEL ?? "meta/llama-3.1-70b-instruct";

export default nvidiaClient;