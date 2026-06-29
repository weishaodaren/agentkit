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
   */
  sendMessage(
    agentId: string,
    textOrMessages: string | ChatMessage[],
    params?: SendMessageParams,
  ): Promise<string>;
}

/**
 * 创建聊天 API 实例。
 */
export function createChatApi(sdkClient: SdkClientInstance): ChatApiInstance {
  const config = sdkClient.getConfig();

  return {
    async sendMessage(
      agentId: string,
      textOrMessages: string | ChatMessage[],
      params?: SendMessageParams,
    ): Promise<string> {
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

      try {
        const response = await agent.stream(messages as any);

        await response.processDataStream({
          onChunk: (chunk: any) => {
            const handler = CHUNK_HANDLERS[chunk.type];
            if (handler) {
              handler(chunk.payload, callbacks);
            }
          },
        });

        if (config.logger) {
          config.logger.debug("[Chat.sendMessage]", "stream completed");
        }

        return `assistant-${Date.now()}`;
      } catch (error) {
        const sdkError = normalizeError(error);
        callbacks.onError?.(sdkError);
        throw sdkError;
      }
    },
  };
}

/**
 * 解析消息格式：支持字符串或 ChatMessage[]。
 */
function _parseMessages(
  textOrMessages: string | ChatMessage[],
  history?: ChatMessage[],
): ChatMessage[] {
  if (typeof textOrMessages === "string") {
    const userMsg: ChatMessage = { role: "user", content: textOrMessages };
    return history ? [...history, userMsg] : [userMsg];
  }
  return textOrMessages;
}

export type { ChatCallbacks, ChatMessage, SendMessageParams } from "./types";
