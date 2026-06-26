import {
  type MastraModelGatewayInterface,
  type ProviderConfig,
} from "@mastra/core/llm";
import { createOpenAICompatible } from "@ai-sdk/openai-compatible";

const baseUrl = process.env.AGNES_BASE_URL!;

export const agnesGateway: MastraModelGatewayInterface = {
  id: "agnes",
  name: "Agnes Gateway",
  async fetchProviders(): Promise<Record<string, ProviderConfig>> {
    return {
      agnes: {
        name: "Agnes",
        models: ["agnes/agnes-2.0-flash"],
        apiKeyEnvVar: "AGNES_API_KEY",
        gateway: "agnes",
        url: baseUrl,
      },
    };
  },
  buildUrl() {
    return baseUrl;
  },
  async getApiKey() {
    return process.env.AGNES_API_KEY ?? "";
  },
  async resolveLanguageModel({ modelId, providerId, apiKey }) {
    return createOpenAICompatible({
      name: providerId,
      apiKey,
      baseURL: baseUrl,
    }).chatModel(modelId);
  },
};
