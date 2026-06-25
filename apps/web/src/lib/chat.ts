import { MastraClient } from "@mastra/client-js";

/** Base URL — 开发环境走 Vite proxy，生产环境走 VITE_API_BASE_URL */
const BASE_URL = import.meta.env.VITE_API_BASE_URL || "";
const API_PREFIX = "/api";

/** 全局客户端实例（无 abortSignal，用于 list* 类 API） */
const client = new MastraClient({ baseUrl: BASE_URL, apiPrefix: API_PREFIX });

// ─── Agent / Workflow / Tool 列表 API ────────────────────────────

/** 获取所有已注册的 agent */
export async function listAgents() {
  return client.listAgents();
}

/** 获取所有已注册的 workflow */
export async function listWorkflows() {
  return client.listWorkflows();
}

/** 获取所有已注册的 tool */
export async function listTools() {
  return client.listTools();
}

/** 获取 agent 详情 */
export async function getAgentDetails(agentId: string) {
  return client.getAgent(agentId).details();
}

/** 触发 workflow 执行 */
export async function runWorkflow(
  workflowId: string,
  input: Record<string, unknown>,
) {
  const wf = client.getWorkflow(workflowId);
  const run = await wf.createRun();
  return run.startAsync({ inputData: input });
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
 */
export async function streamAgentMessage(
  agentId: string,
  messages: SimpleMessage[],
  callbacks: StreamCallbacks,
  signal?: AbortSignal,
): Promise<void> {
  const requestClient = new MastraClient({
    baseUrl: BASE_URL,
    apiPrefix: API_PREFIX,
    abortSignal: signal,
  });

  const agent = requestClient.getAgent(agentId);
  const response = await agent.stream(messages as any);

  await response.processDataStream({
    onChunk(chunk) {
      switch (chunk.type) {
        case "text-delta":
          callbacks.onTextDelta?.(chunk.payload.text);
          break;
        case "reasoning-start":
          callbacks.onReasoningStart?.();
          break;
        case "reasoning-delta":
          callbacks.onReasoningDelta?.(chunk.payload.text);
          break;
        case "reasoning-end":
          callbacks.onReasoningEnd?.();
          break;
        case "tool-call":
          callbacks.onToolCall?.({
            toolCallId: chunk.payload.toolCallId,
            toolName: chunk.payload.toolName,
            args: chunk.payload.args,
          });
          break;
        case "tool-result":
          callbacks.onToolResult?.({
            toolCallId: chunk.payload.toolCallId,
            toolName: chunk.payload.toolName,
            result: chunk.payload.result,
            isError: chunk.payload.isError,
          });
          break;
        case "step-start":
          callbacks.onStepStart?.({
            messageId: (chunk.payload as any).messageId,
            request: (chunk.payload as any).request,
          });
          break;
        case "step-finish":
          callbacks.onStepFinish?.({
            usage: (chunk.payload as any).output?.usage,
            reason: (chunk.payload as any).stepResult?.reason,
          });
          break;
        case "finish":
          callbacks.onFinish?.();
          break;
        case "error":
          callbacks.onError?.(chunk.payload.error);
          break;
      }
    },
  });
}
