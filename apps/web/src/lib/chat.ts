import { api } from "~/lib/api";

interface ChatRequest {
  messages: Array<{ role: string; content: string }>;
}

interface ChatResponse {
  messages: Array<{ role: string; content: string }>;
}

/**
 * Send a chat message to the backend agent and return the assistant's response.
 *
 * The server endpoint at /api/llm expects a JSON body with a `messages` array
 * and streams back the agent's reply. This function wraps ofetch to handle
 * the request and parse the JSON response.
 */
export async function sendChatMessage(
  request: ChatRequest,
): Promise<ChatResponse> {
  return api<ChatResponse>("llm", {
    method: "POST",
    body: request,
  });
}
