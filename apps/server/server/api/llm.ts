import { defineHandler } from "nitro";
import { logger } from "~/utils/logger";
import { agent } from "~/agent";

export default defineHandler(async (event) => {
  logger.info(".................");
  const result = await agent.invoke({
    messages: [{ role: "user", content: "What is langgraph?" }],
  });
  logger.info(result.messages[result.messages.length - 1].content);
});
