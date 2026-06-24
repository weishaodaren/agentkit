import { ChatOpenAI } from "@langchain/openai";
import { createDeepAgent } from "deepagents";
import { useRuntimeConfig } from "nitro/runtime-config";
import internetSearch from "~/tools/internetSearch";

// System prompt to steer the agent to be an expert researcher
const researchInstructions = `You are an expert researcher. Your job is to conduct thorough research and then write a polished report.

You have access to an internet search tool as your primary means of gathering information.

## \`internet_search\`

Use this to run an internet search for a given query. You can specify the max number of results to return, the topic, and whether raw content should be included.
`;

export const agent = createDeepAgent({
  model: new ChatOpenAI({
    model: "agnes-2.0-flash",
    apiKey: useRuntimeConfig().AGNES_API_KEY,
    temperature: 0,
    configuration: {
      baseURL: "https://apihub.agnes-ai.com/v1",
    },
  }),
  tools: [internetSearch],
  systemPrompt: researchInstructions,
});
