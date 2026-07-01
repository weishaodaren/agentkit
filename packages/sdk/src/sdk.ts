/**
 * @agentkit/sdk - 工厂函数
 *
 * createAgentSdk(config) → 返回完整的 SDK 实例，
 * 严格对齐 Mastra Client SDK 官方文档侧边栏。
 */

import type { MastraClient } from "@mastra/client-js";
import type { SdkConfig } from "./client";
import { createSdkClient } from "./client";
import { createChatApi } from "./chat";
import { createAgentsApi } from "./agents";
import { createWorkflowsApi } from "./workflows";
import { createToolsApi } from "./tools";
import { createMemoryApi } from "./memory";
import { createTelemetryApi } from "./telemetry";
import { createDatasetsApi } from "./datasets";
import { createResponsesApi } from "./responses";
import { createConversationsApi } from "./conversations";
import { createLogsApi } from "./logs";
import { createVectorsApi } from "./vectors";
import { createMcpApi } from "./mcp";
import { createProcessorsApi } from "./processors";
import { createStoredApi } from "./stored";
import { createWorkspaceApi } from "./workspace";
import { createScorersApi } from "./scorers";
import { createBuilderApi } from "./builder";

/** Agent SDK 完整接口 */
export interface AgentSdk {
  /** 流式聊天（Agents API 的 stream/generate 封装） */
  chat: ReturnType<typeof createChatApi>;
  /** Agent 发现 */
  agents: ReturnType<typeof createAgentsApi>;
  /** 工作流 */
  workflows: ReturnType<typeof createWorkflowsApi>;
  /** 工具 */
  tools: ReturnType<typeof createToolsApi>;
  /** 记忆/线程 */
  memory: ReturnType<typeof createMemoryApi>;
  /** Telemetry（追踪/span/分支/打分）+ Observability（评分/反馈/指标/实体） */
  telemetry: ReturnType<typeof createTelemetryApi>;
  /** 日志 */
  logs: ReturnType<typeof createLogsApi>;
  /** 向量/嵌入 */
  vectors: ReturnType<typeof createVectorsApi>;
  /** 数据集 */
  datasets: ReturnType<typeof createDatasetsApi>;
  /** Responses API（实验性） */
  responses: ReturnType<typeof createResponsesApi>;
  /** Conversations API（实验性） */
  conversations: ReturnType<typeof createConversationsApi>;
  /** MCP Server 管理 */
  mcp: ReturnType<typeof createMcpApi>;
  /** Processors（处理器与提供者） */
  processors: ReturnType<typeof createProcessorsApi>;
  /** Stored Resources（Agents/PromptBlocks/Scorers/MCP Clients/Skills） */
  stored: ReturnType<typeof createStoredApi>;
  /** Workspaces（工作空间） */
  workspace: ReturnType<typeof createWorkspaceApi>;
  /** Scorers Legacy（旧版评分器 API） */
  scorers: ReturnType<typeof createScorersApi>;
  /** Builder & System（Agent Builder/Controllers/System/Editor） */
  builder: ReturnType<typeof createBuilderApi>;
  /** 底层 MastraClient（高级用法） */
  getClient: () => MastraClient;
}

/**
 * 创建 Agent SDK 实例。
 *
 * @example
 * ```ts
 * const sdk = createAgentSdk({
 *   baseUrl: "http://localhost:4000",
 *   retries: 3,
 *   logger: console,
 * });
 *
 * // 聊天
 * await sdk.chat.sendMessage("weather-agent", "今天天气？", {
 *   onText: (t) => console.log(t),
 *   onFinish: () => console.log("done"),
 * });
 *
 * // 发现
 * const agents = await sdk.agents.listAgents();
 * const workflows = await sdk.workflows.listWorkflows();
 *
 * // 记忆
 * const threads = await sdk.memory.listThreads({ agentId: "weather-agent" });
 *
 * // Telemetry
 * const traces = await sdk.telemetry.listTraces();
 * const trace = await sdk.telemetry.getTrace(traceId);
 *
 * // Vectors
 * const vectors = await sdk.vectors.listVectors();
 * const vector = sdk.vectors.getVector('my-vector');
 * ```
 */
export const createAgentSdk = (config: SdkConfig): AgentSdk => {
  const sdkClient = createSdkClient(config);

  return {
    chat: createChatApi(sdkClient),
    agents: createAgentsApi(sdkClient),
    workflows: createWorkflowsApi(sdkClient),
    tools: createToolsApi(sdkClient),
    memory: createMemoryApi(sdkClient),
    telemetry: createTelemetryApi(sdkClient),
    logs: createLogsApi(sdkClient),
    vectors: createVectorsApi(sdkClient),
    datasets: createDatasetsApi(sdkClient),
    responses: createResponsesApi(sdkClient),
    conversations: createConversationsApi(sdkClient),
    mcp: createMcpApi(sdkClient),
    processors: createProcessorsApi(sdkClient),
    stored: createStoredApi(sdkClient),
    workspace: createWorkspaceApi(sdkClient),
    scorers: createScorersApi(sdkClient),
    builder: createBuilderApi(sdkClient),
    getClient: sdkClient.getClient,
  };
};

export type { SdkConfig } from "./client";
