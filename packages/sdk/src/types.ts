/**
 * @agentkit/sdk - 类型定义
 *
 * 从 @agentkit/shared 导入共享类型和常量，
 * 定义 SDK 专用的配置、聊天、错误等类型。
 */

import type {
  ID,
  Timestamp,
  ApiResponse,
  PaginationParams,
  PaginatedResponse,
} from "@agentkit/shared";
import {
  API_BASE_PATH,
  REQUEST_TIMEOUT,
  ERROR_CODE,
  SSE_EVENT,
} from "@agentkit/shared";

// ─── Re-export shared types and constants ──────────────────────────

export type { ID, Timestamp, ApiResponse, PaginationParams, PaginatedResponse };
export { API_BASE_PATH, REQUEST_TIMEOUT, ERROR_CODE, SSE_EVENT };

// ─── SDK Configuration ─────────────────────────────────────────────

export interface SdkConfig {
  /** 后端服务地址，如 "http://localhost:4000" */
  baseUrl: string;
  /** API 路由前缀，默认 "/api" */
  apiPrefix?: string;
  /** 请求超时（毫秒），默认 30000 */
  timeout?: number;
  /** 自定义请求头 */
  headers?: Record<string, string>;
  /** 自定义 fetch 实现 */
  fetch?: typeof globalThis.fetch;
  /** 重试次数，默认 0（不重试） */
  retries?: number;
  /** 重试延迟基准（毫秒），默认 1000 */
  retryDelay?: number;
  /** 指数退避因子，默认 2 */
  retryBackoff?: number;
  /** 日志记录器，传入 console 开启日志 */
  logger?: Logger;
  /** 凭证模式 */
  credentials?: RequestCredentials;
}

export interface ResolvedConfig extends Omit<SdkConfig, "logger"> {
  logger: Logger | null;
}

// ─── Logger ────────────────────────────────────────────────────────

export interface Logger {
  debug: (...args: unknown[]) => void;
  info: (...args: unknown[]) => void;
  warn: (...args: unknown[]) => void;
  error: (...args: unknown[]) => void;
}

// ─── Chat Types ────────────────────────────────────────────────────

/** 聊天消息角色 */
export type ChatRole = "user" | "assistant" | "system";

/** 聊天消息 */
export interface ChatMessage {
  role: ChatRole;
  content: string;
}

/** 聊天回调 */
export interface ChatCallbacks {
  /** 收到文本片段 */
  onText?: (text: string) => void;
  /** 推理开始 */
  onReasoningStart?: () => void;
  /** 收到推理文本片段 */
  onReasoningDelta?: (text: string) => void;
  /** 推理结束 */
  onReasoningEnd?: () => void;
  /** 工具调用 */
  onToolCall?: (event: ToolCallEvent) => void;
  /** 工具结果 */
  onToolResult?: (event: ToolResultEvent) => void;
  /** 步骤开始 */
  onStepStart?: (event: StepStartEvent) => void;
  /** 步骤结束 */
  onStepFinish?: (event: StepFinishEvent) => void;
  /** 流式完成 */
  onFinish?: () => void;
  /** 发生错误 */
  onError?: (error: Error) => void;
}

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

/** 聊天发送参数 */
export interface SendMessageParams {
  /** 回调函数 */
  callbacks?: ChatCallbacks;
  /** 中止信号 */
  signal?: AbortSignal;
  /** 消息历史（可选，不提供时使用当前对话上下文） */
  messages?: ChatMessage[];
}

// ─── Agent Types ───────────────────────────────────────────────────

export interface AgentInfo {
  id: string;
  name: string;
  description?: string;
  provider: string;
  modelId: string;
}

// ─── Memory / Thread Types ─────────────────────────────────────────

export interface ThreadInfo {
  id: string;
  title?: string;
  resourceId?: string;
  createdAt: string;
  updatedAt: string;
  metadata?: Record<string, unknown>;
}

export interface CreateThreadParams {
  title?: string;
  resourceId?: string;
  metadata?: Record<string, unknown>;
}

export interface SaveMessageParams {
  agentId: string;
  messages: Array<{
    id?: string;
    role: string;
    content: string;
    createdAt?: string;
  }>;
}

// ─── Observation Types ─────────────────────────────────────────────

export interface LogEntry {
  timestamp: string;
  level: string;
  message: string;
  [key: string]: unknown;
}

// ─── Dataset Types ─────────────────────────────────────────────────

export interface DatasetRecord {
  id: string;
  name: string;
  description?: string | null;
  version: number;
  createdAt: string;
  updatedAt: string;
}

export interface DatasetItemRecord {
  id: string;
  datasetId: string;
  input: unknown;
  groundTruth?: unknown;
  metadata?: unknown;
  createdAt: string;
}
