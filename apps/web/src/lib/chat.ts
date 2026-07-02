/**
 * @agentkit/sdk - Web 应用适配层
 *
 * 直接使用 @agentkit/sdk 提供的 createAgentSdk，
 * 封装流式调用与列表查询。
 */

import { createAgentSdk } from "@agentkit/sdk";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "";

// 全局 SDK 实例 — 单例复用
const sdk = createAgentSdk({
  baseUrl: BASE_URL,
  apiPrefix: "/api",
  logger: import.meta.env.DEV ? console : undefined,
});

export { sdk };

// ─── Agent / Workflow / Tool 列表 ────────────────────────────────

export async function listAgents() {
  return sdk.agents.listAgents();
}

export async function listWorkflows() {
  return sdk.workflows.listWorkflows();
}

export async function listTools() {
  return sdk.tools.listTools();
}

export async function getAgentDetails(agentId: string) {
  return sdk.agents.getAgent(agentId).details();
}

// ─── 流式聊天 ────────────────────────────────────────────────────

export interface StreamCallbacks {
  onTextDelta?: (text: string) => void;
  onReasoningStart?: () => void;
  onReasoningDelta?: (text: string) => void;
  onReasoningEnd?: () => void;
  onToolCall?: (event: {
    toolCallId: string;
    toolName: string;
    args?: unknown;
  }) => void;
  onToolResult?: (event: {
    toolCallId: string;
    toolName: string;
    result: unknown;
    isError?: boolean;
  }) => void;
  onStepStart?: (event: {
    messageId?: string;
    request?: Record<string, unknown>;
  }) => void;
  onStepFinish?: (event: {
    usage?: {
      promptTokens?: number;
      completionTokens?: number;
      totalTokens?: number;
    };
    reason?: string;
  }) => void;
  onFinish?: () => void;
  onError?: (error: unknown) => void;
}

/**
 * 向指定 agent 发送消息并流式接收响应。
 * 内部委托给 sdk.chat.sendMessage，自动处理 chunk 解析。
 */
export async function streamAgentMessage(
  agentId: string,
  messages: Array<{ role: "user" | "assistant" | "system"; content: string }>,
  callbacks: StreamCallbacks,
  signal?: AbortSignal,
): Promise<void> {
  await sdk.chat.sendMessage(agentId, messages, {
    callbacks: {
      onText: callbacks.onTextDelta,
      onReasoningStart: callbacks.onReasoningStart,
      onReasoningDelta: callbacks.onReasoningDelta,
      onReasoningEnd: callbacks.onReasoningEnd,
      onToolCall: callbacks.onToolCall,
      onToolResult: callbacks.onToolResult,
      onStepStart: callbacks.onStepStart,
      onStepFinish: callbacks.onStepFinish,
      onFinish: callbacks.onFinish,
      onError: (err) => callbacks.onError?.(err),
    },
    signal,
  });
}

// ─── Workflow 执行 ───────────────────────────────────────────────

export async function runWorkflow(
  workflowId: string,
  input: Record<string, unknown>,
) {
  return sdk.workflows.runWorkflow(workflowId, input);
}
