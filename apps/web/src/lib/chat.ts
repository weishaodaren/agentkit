/**
 * @agentkit/sdk - Web 应用适配层
 *
 * 旧版 chat.ts 的替代品，内部使用 createAgentSdk。
 * 对外保持与旧版一致的 API 签名，确保 App.tsx 无需改动。
 */

import { createAgentSdk } from "@agentkit/sdk";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "";

// 全局 SDK 实例
const sdk = createAgentSdk({
  baseUrl: BASE_URL,
  apiPrefix: "/api",
});

// ─── Agent / Workflow / Tool 列表 API ────────────────────────────

export async function listAgents() {
  const agents = await sdk.agents.listAgents();
  // Convert our simplified AgentInfo back to the shape App.tsx expects
  // App.tsx does: Object.keys(agents) — so just return a Record<string, unknown>
  return agents as unknown as Record<string, unknown>;
}

export async function listWorkflows() {
  const workflows = await sdk.workflows.listWorkflows();
  return workflows as Record<string, unknown>;
}

export async function listTools() {
  return sdk.tools.listTools();
}

export async function getAgentDetails(agentId: string) {
  return sdk.agents.getAgentDetails(agentId);
}

export async function runWorkflow(
  workflowId: string,
  input: Record<string, unknown>,
) {
  return sdk.workflows.runWorkflow(workflowId, input);
}

// ─── 流式 Agent 调用 ────────────────────────────────────────────

/** 工具调用事件 */
export interface ToolCallEvent {
  toolCallId: string;
  toolName: string;
  args?: unknown;
}

/** 工具结果事件 */
export interface ToolResultEvent {
  toolCallId: string;
  toolName: string;
  result: unknown;
  isError?: boolean;
}

/** 步骤开始事件 */
export interface StepStartEvent {
  messageId?: string;
  request?: Record<string, unknown>;
}

/** 步骤结束事件 */
export interface StepFinishEvent {
  usage?: {
    promptTokens?: number;
    completionTokens?: number;
    totalTokens?: number;
  };
  reason?: string;
}

/** Agent 流式响应的完整回调 */
export type StreamCallbacks = {
  onTextDelta?: (text: string) => void;
  onReasoningStart?: () => void;
  onReasoningDelta?: (text: string) => void;
  onReasoningEnd?: () => void;
  onToolCall?: (event: ToolCallEvent) => void;
  onToolResult?: (event: ToolResultEvent) => void;
  onStepStart?: (event: StepStartEvent) => void;
  onStepFinish?: (event: StepFinishEvent) => void;
  onFinish?: () => void;
  onError?: (error: unknown) => void;
};

/** 简单消息格式 */
type SimpleMessage = { role: "user" | "assistant" | "system"; content: string };

/**
 * 向指定 agent 发送消息并流式接收全部事件。
 * 签名与旧版保持一致。
 */
export async function streamAgentMessage(
  agentId: string,
  messages: SimpleMessage[],
  callbacks: StreamCallbacks,
  signal?: AbortSignal,
): Promise<void> {
  // Convert SimpleMessage[] to ChatMessage[]
  const chatMessages = messages.map((m) => ({
    role: m.role as "user" | "assistant" | "system",
    content: m.content,
  }));

  await sdk.chat.sendMessage(agentId, chatMessages, {
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
