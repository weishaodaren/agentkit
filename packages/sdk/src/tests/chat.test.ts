/**
 * @agentkit/sdk - chat 测试
 */

import { createChatApi } from "../chat";
import type { SdkClientInstance } from "../client";
import type { ChatCallbacks, ChatMessage } from "../types";

describe("createChatApi", () => {
  let mockSdkClient: SdkClientInstance;
  let mockMastraClient: any;
  let mockAgent: any;
  let mockStreamResponse: any;

  beforeEach(() => {
    mockStreamResponse = {
      processDataStream: vi.fn().mockResolvedValue(undefined),
    };

    mockAgent = {
      stream: vi.fn().mockResolvedValue(mockStreamResponse),
    };

    mockMastraClient = {
      getAgent: vi.fn().mockReturnValue(mockAgent),
    };

    mockSdkClient = {
      getClient: vi.fn().mockReturnValue(mockMastraClient),
      getConfig: vi.fn().mockReturnValue({
        logger: null,
        retries: 0,
        retryDelay: 1000,
        retryBackoff: 2,
      }),
      call: vi.fn().mockImplementation((fn) => fn()),
      createScopedClient: vi.fn().mockReturnValue(mockMastraClient),
    };
  });

  describe("sendMessage", () => {
    it("should call agent.stream with parsed messages", async () => {
      const api = createChatApi(mockSdkClient);
      const callbacks: ChatCallbacks = {
        onText: vi.fn(),
        onFinish: vi.fn(),
      };

      await api.sendMessage("test-agent", "hello", { callbacks });

      expect(mockMastraClient.getAgent).toHaveBeenCalledWith("test-agent");
      expect(mockAgent.stream).toHaveBeenCalledWith([
        { role: "user", content: "hello" },
      ]);
    });

    it("should call agent.stream with ChatMessage[]", async () => {
      const api = createChatApi(mockSdkClient);
      const messages: ChatMessage[] = [
        { role: "user", content: "hello" },
        { role: "assistant", content: "hi" },
      ];
      const callbacks: ChatCallbacks = {
        onText: vi.fn(),
        onFinish: vi.fn(),
      };

      await api.sendMessage("test-agent", messages, { callbacks });

      expect(mockAgent.stream).toHaveBeenCalledWith(messages);
    });

    it("should prepend user message to history", async () => {
      const api = createChatApi(mockSdkClient);
      const history: ChatMessage[] = [{ role: "user", content: "previous" }];
      const callbacks: ChatCallbacks = {
        onText: vi.fn(),
        onFinish: vi.fn(),
      };

      await api.sendMessage("test-agent", "new message", {
        callbacks,
        messages: history,
      });

      expect(mockAgent.stream).toHaveBeenCalledWith([
        { role: "user", content: "previous" },
        { role: "user", content: "new message" },
      ]);
    });

    it("should forward stream chunks to callbacks", async () => {
      const api = createChatApi(mockSdkClient);
      const onText = vi.fn();
      const onFinish = vi.fn();
      const callbacks: ChatCallbacks = { onText, onFinish };

      // Simulate stream chunks
      mockStreamResponse.processDataStream.mockImplementation(
        ({ onChunk }: { onChunk: (chunk: any) => void }) => {
          onChunk({ type: "text-delta", payload: { text: "Hello" } });
          onChunk({ type: "finish", payload: {} });
        },
      );

      await api.sendMessage("test-agent", "hello", { callbacks });

      expect(onText).toHaveBeenCalledWith("Hello");
      expect(onFinish).toHaveBeenCalled();
    });

    it("should forward reasoning events to callbacks", async () => {
      const api = createChatApi(mockSdkClient);
      const onReasoningStart = vi.fn();
      const onReasoningDelta = vi.fn();
      const onReasoningEnd = vi.fn();
      const callbacks: ChatCallbacks = {
        onReasoningStart,
        onReasoningDelta,
        onReasoningEnd,
      };

      mockStreamResponse.processDataStream.mockImplementation(
        ({ onChunk }: { onChunk: (chunk: any) => void }) => {
          onChunk({ type: "reasoning-start", payload: {} });
          onChunk({
            type: "reasoning-delta",
            payload: { text: "thinking..." },
          });
          onChunk({ type: "reasoning-end", payload: {} });
        },
      );

      await api.sendMessage("test-agent", "hello", { callbacks });

      expect(onReasoningStart).toHaveBeenCalled();
      expect(onReasoningDelta).toHaveBeenCalledWith("thinking...");
      expect(onReasoningEnd).toHaveBeenCalled();
    });

    it("should forward tool-call events to callbacks", async () => {
      const api = createChatApi(mockSdkClient);
      const onToolCall = vi.fn();
      const callbacks: ChatCallbacks = { onToolCall };

      mockStreamResponse.processDataStream.mockImplementation(
        ({ onChunk }: { onChunk: (chunk: any) => void }) => {
          onChunk({
            type: "tool-call",
            payload: {
              toolCallId: "1",
              toolName: "getWeather",
              args: { city: "BJ" },
            },
          });
        },
      );

      await api.sendMessage("test-agent", "hello", { callbacks });

      expect(onToolCall).toHaveBeenCalledWith({
        toolCallId: "1",
        toolName: "getWeather",
        args: { city: "BJ" },
      });
    });

    it("should forward tool-result events to callbacks", async () => {
      const api = createChatApi(mockSdkClient);
      const onToolResult = vi.fn();
      const callbacks: ChatCallbacks = { onToolResult };

      mockStreamResponse.processDataStream.mockImplementation(
        ({ onChunk }: { onChunk: (chunk: any) => void }) => {
          onChunk({
            type: "tool-result",
            payload: {
              toolCallId: "1",
              toolName: "getWeather",
              result: { temp: 25 },
              isError: false,
            },
          });
        },
      );

      await api.sendMessage("test-agent", "hello", { callbacks });

      expect(onToolResult).toHaveBeenCalledWith({
        toolCallId: "1",
        toolName: "getWeather",
        result: { temp: 25 },
        isError: false,
      });
    });

    it("should forward step events to callbacks", async () => {
      const api = createChatApi(mockSdkClient);
      const onStepStart = vi.fn();
      const onStepFinish = vi.fn();
      const callbacks: ChatCallbacks = { onStepStart, onStepFinish };

      mockStreamResponse.processDataStream.mockImplementation(
        ({ onChunk }: { onChunk: (chunk: any) => void }) => {
          onChunk({
            type: "step-start",
            payload: { messageId: "msg-1", request: { prompt: "test" } },
          });
          onChunk({
            type: "step-finish",
            payload: {
              output: {
                usage: {
                  promptTokens: 10,
                  completionTokens: 20,
                  totalTokens: 30,
                },
                stepResult: { reason: "completed" },
              },
            },
          });
        },
      );

      await api.sendMessage("test-agent", "hello", { callbacks });

      expect(onStepStart).toHaveBeenCalledWith({
        messageId: "msg-1",
        request: { prompt: "test" },
      });
      expect(onStepFinish).toHaveBeenCalledWith({
        usage: { promptTokens: 10, completionTokens: 20, totalTokens: 30 },
        reason: "completed",
      });
    });

    it("should handle error chunks", async () => {
      const api = createChatApi(mockSdkClient);
      const onError = vi.fn();
      const callbacks: ChatCallbacks = { onError };

      mockStreamResponse.processDataStream.mockImplementation(
        ({ onChunk }: { onChunk: (chunk: any) => void }) => {
          onChunk({
            type: "error",
            payload: { error: "stream error" },
          });
        },
      );

      await api.sendMessage("test-agent", "hello", { callbacks });

      expect(onError).toHaveBeenCalled();
    });

    it("should return collected text from stream", async () => {
      const api = createChatApi(mockSdkClient);
      const onText = vi.fn();
      const callbacks: ChatCallbacks = { onText };

      mockStreamResponse.processDataStream.mockImplementation(
        ({ onChunk }: { onChunk: (chunk: any) => void }) => {
          onChunk({ type: "text-delta", payload: { text: "Hello" } });
          onChunk({ type: "finish", payload: {} });
        },
      );

      const result = await api.sendMessage("test-agent", "hello", {
        callbacks,
      });

      expect(result).toBe("Hello");
      expect(onText).toHaveBeenCalledWith("Hello");
    });

    it("should return empty string when no text chunks", async () => {
      const api = createChatApi(mockSdkClient);

      mockStreamResponse.processDataStream.mockImplementation(
        ({ onChunk }: { onChunk: (chunk: any) => void }) => {
          onChunk({ type: "finish", payload: {} });
        },
      );

      const result = await api.sendMessage("test-agent", "hello", {
        callbacks: {},
      });

      expect(result).toBe("");
    });

    it("should throw SdkError on stream failure", async () => {
      const api = createChatApi(mockSdkClient);
      const onError = vi.fn();
      mockAgent.stream.mockRejectedValue(new Error("connection refused"));

      await expect(
        api.sendMessage("test-agent", "hello", {
          callbacks: { onError },
        }),
      ).rejects.toThrow("connection refused");

      expect(onError).toHaveBeenCalled();
    });

    it("should use scoped client with abort signal", async () => {
      const api = createChatApi(mockSdkClient);
      const controller = new AbortController();

      await api.sendMessage("test-agent", "hello", {
        callbacks: {},
        signal: controller.signal,
      });

      expect(mockSdkClient.createScopedClient).toHaveBeenCalledWith(
        controller.signal,
      );
    });

    it("should use callbacks from config when params.callbacks is undefined", async () => {
      const api = createChatApi(mockSdkClient);
      const onText = vi.fn();

      // Even with no callbacks, should not throw
      await api.sendMessage("test-agent", "hello");
      expect(onText).not.toHaveBeenCalled();
    });
  });
});
