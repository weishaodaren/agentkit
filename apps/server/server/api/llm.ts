import { defineHandler } from "nitro";
import { createEventStream } from "nitro/h3";

import { agent } from "~/agent";

export default defineHandler(async (event) => {
  const stream = createEventStream(event);

  const result = await agent.invoke({
    messages: [{ role: "user", content: "What is langgraph?" }],
  });

  const content = result.messages[result.messages.length - 1].content as string;

  const interval = setInterval(async () => {
    await stream.push(content);
  }, 1000);

  stream.onClosed(() => {
    clearInterval(interval);
  });

  return stream.send();
});
