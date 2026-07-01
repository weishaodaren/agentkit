/**
 * @agentkit/sdk - 流式聊天
 *
 * 核心功能：向 Mastra Agent 发送消息并流式接收响应。
 * 通过声明式的 chunk-handler 映射表，自动转发 processDataStream 事件。
 *
 * 设计原则：
 * - 新增 chunk 类型只需在 CHUNK_HANDLERS 表中添加一行，无需改 switch
 * - 错误统一归一化为 SdkError
 * - 支持 AbortController 取消
 */

import type { MastraClient } from "@mastra/client-js";
import type {
  ChatCallbacks,
  ChatMessage,
  SendMessageParams,
  ToolCallEvent,
  ToolResultEvent,
  StepStartEvent,
  StepFinishEvent,
} from "./types";
import type { SdkClientInstance } from "./client";
import { normalizeError } from "./error";
import { hasLogger } from "./logger";

// ─── 类型提取 ──────────────────────────────────────────────────────

type MastraAgent = ReturnType<MastraClient["getAgent"]>;
type MastraStreamResponse = Awaited<ReturnType<MastraAgent["stream"]>>;
type MastraGenerateResponse = Awaited<ReturnType<MastraAgent["generate"]>>;

/** Agent stream() 方法接受的消息类型 */
type MastraMessages = Parameters<MastraAgent["stream"]>[0];

/** processDataStream 选项类型 */
type DataStreamOptions = Parameters<
  MastraStreamResponse["processDataStream"]
>[0];

/** processDataStream onChunk 回调的 chunk 类型 */
type DataStreamChunk = Parameters<DataStreamOptions["onChunk"]>[0];

// ─── Chunk Handler 映射表 ──────────────────────────────────────────
// 新增 chunk 类型只需在这里添加一行，无需修改 switch。
// 键名对应 Mastra processDataStream chunk.type 的值。

type ChunkHandler = (payload: unknown, callbacks: ChatCallbacks) => void;

const CHUNK_HANDLERS: Record<string, ChunkHandler> = {
  // 文本
  "text-delta": (payload, callbacks) => {
    const text = (payload as Record<string, unknown>)?.text as
      | string
      | undefined;
    if (text) {
      callbacks.onText?.(text);
    }
  },

  // 推理
  "reasoning-start": (_, callbacks) => {
    callbacks.onReasoningStart?.();
  },
  "reasoning-delta": (payload, callbacks) => {
    const text = (payload as Record<string, unknown>)?.text as
      | string
      | undefined;
    if (text) {
      callbacks.onReasoningDelta?.(text);
    }
  },
  "reasoning-end": (_, callbacks) => {
    callbacks.onReasoningEnd?.();
  },

  // 工具调用
  "tool-call": (payload, callbacks) => {
    const p = payload as Record<string, unknown>;
    callbacks.onToolCall?.({
      toolCallId: (p.toolCallId ?? "") as string,
      toolName: (p.toolName ?? "") as string,
      args: p.args,
    } as ToolCallEvent);
  },
  "tool-result": (payload, callbacks) => {
    const p = payload as Record<string, unknown>;
    callbacks.onToolResult?.({
      toolCallId: (p.toolCallId ?? "") as string,
      toolName: (p.toolName ?? "") as string,
      result: p.result,
      isError: p.isError as boolean | undefined,
    } as ToolResultEvent);
  },

  // 步骤
  "step-start": (payload, callbacks) => {
    const p = payload as Record<string, unknown>;
    callbacks.onStepStart?.({
      messageId: p.messageId as string | undefined,
      request: p.request as Record<string, unknown> | undefined,
    } as StepStartEvent);
  },
  "step-finish": (payload, callbacks) => {
    const p = payload as Record<string, unknown>;
    const output = p.output as Record<string, unknown> | undefined;
    const stepResult = output?.stepResult as
      | Record<string, unknown>
      | undefined;
    callbacks.onStepFinish?.({
      usage: output?.usage as
        | {
            promptTokens?: number;
            completionTokens?: number;
            totalTokens?: number;
          }
        | undefined,
      reason: stepResult?.reason as string | undefined,
    } as StepFinishEvent);
  },

  // 完成 / 错误
  finish: (_, callbacks) => {
    callbacks.onFinish?.();
  },

  error: (payload, callbacks) => {
    const msg =
      (payload as Record<string, unknown>)?.error ??
      (payload as string) ??
      "Stream error";
    callbacks.onError?.(normalizeError(msg));
  },
};

// ─── ChatApi ──────────────────────────────────────────────────────

export interface ChatApiInstance {
  /**
   * 向指定 Agent 发送消息并流式接收响应。
   * 返回 assistant 完整响应文本。
   */
  sendMessage: (
    agentId: string,
    textOrMessages: string | ChatMessage[],
    params?: SendMessageParams,
  ) => Promise<string>;
  /**
   * 向指定 Agent 发送消息并等待完整响应（非流式）。
   * 返回 assistant 完整响应文本。
   */
  generate: (
    agentId: string,
    textOrMessages: string | ChatMessage[],
    params?: SendMessageParams,
  ) => Promise<string>;
  /**
   * 获取 Agent 详情（模型、指令等）。
   */
  getDetails: (
    agentId: string,
  ) => Promise<Awaited<ReturnType<MastraAgent["details"]>>>;
}

/**
 * 创建聊天 API 实例
 */
export const createChatApi = (
  sdkClient: SdkClientInstance,
): ChatApiInstance => {
  const config = sdkClient.getConfig();

  return {
    sendMessage: (
      agentId: string,
      textOrMessages: string | ChatMessage[],
      params?: SendMessageParams,
    ): Promise<string> => {
      const messages = _parseMessages(textOrMessages, params?.messages);
      const callbacks = params?.callbacks ?? {};
      const signal = params?.signal;

      if (hasLogger(config.logger)) {
        config.logger.debug("[Chat.sendMessage]", {
          agentId,
          messageCount: messages.length,
        });
      }

      const client = sdkClient.createScopedClient(signal);
      const agent = client.getAgent(agentId);
      const textBuffer: string[] = [];

      // 包装 callbacks 以同时收集文本
      const wrappedCallbacks: ChatCallbacks = {
        ...callbacks,
        onText: (text: string) => {
          textBuffer.push(text);
          callbacks.onText?.(text);
        },
      };

      return (async () => {
        try {
          const response = await agent.stream(messages as MastraMessages);

          await response.processDataStream({
            onChunk: (chunk: DataStreamChunk) => {
              const handler = CHUNK_HANDLERS[chunk.type];
              if (handler) {
                const payload = (chunk as unknown as Record<string, unknown>)
                  .payload;
                handler(payload, wrappedCallbacks);
              }
            },
          });

          if (config.logger) {
            config.logger.debug("[Chat.sendMessage]", "stream completed");
          }

          return textBuffer.join("");
        } catch (error) {
          const sdkError = normalizeError(error);
          callbacks.onError?.(sdkError);
          throw sdkError;
        }
      })();
    },

    generate: (
      agentId: string,
      textOrMessages: string | ChatMessage[],
      params?: SendMessageParams,
    ): Promise<string> => {
      const messages = _parseMessages(textOrMessages, params?.messages);
      const callbacks = params?.callbacks ?? {};
      const signal = params?.signal;

      if (hasLogger(config.logger)) {
        config.logger.debug("[Chat.generate]", {
          agentId,
          messageCount: messages.length,
        });
      }

      const client = sdkClient.createScopedClient(signal);
      const agent = client.getAgent(agentId);

      return (async () => {
        try {
          const response = (await agent.generate(
            messages as MastraMessages,
          )) as MastraGenerateResponse;
          const text =
            (response as Record<string, unknown>)?.text ??
            (response as Record<string, unknown>)?.content ??
            "";

          if (config.logger) {
            config.logger.debug("[Chat.generate]", "generate completed");
          }

          return typeof text === "string" ? text : String(text);
        } catch (error) {
          const sdkError = normalizeError(error);
          callbacks.onError?.(sdkError);
          throw sdkError;
        }
      })();
    },

    getDetails: (agentId: string) =>
      sdkClient.call(() => sdkClient.getClient().getAgent(agentId).details()),
  };
};

/**
 * 解析消息格式：支持字符串或 ChatMessage[]。
 */
const _parseMessages = (
  textOrMessages: string | ChatMessage[],
  history?: ChatMessage[],
): ChatMessage[] => {
  if (typeof textOrMessages === "string") {
    const userMsg: ChatMessage = { role: "user", content: textOrMessages };
    return history ? [...history, userMsg] : [userMsg];
  }
  return textOrMessages;
};

export type { ChatCallbacks, ChatMessage, SendMessageParams } from "./types";
