/**
 * @agentkit/sdk - 工厂函数
 *
 * createAgentSdk(config) → 返回完整的 SDK 实例，
 * 包含 chat、agents、workflows、tools、memory、observability、datasets 等子模块。
 */

import type { SdkConfig } from "./client";
import { createSdkClient } from "./client";
import { createChatApi } from "./chat";
import { createAgentsApi } from "./agents";
import { createWorkflowsApi } from "./workflows";
import { createToolsApi } from "./tools";
import { createMemoryApi } from "./memory";
import { createObservabilityApi } from "./observability";
import { createDatasetsApi } from "./datasets";
import { createMcpApi } from "./mcp";
import { createStorageApi } from "./storage";
import { createBuilderApi } from "./builder";
import { createWorkspaceApi } from "./workspace";
import { createBackgroundApi } from "./background";
import { createProcessorsApi } from "./processors";
import { createStoredApi } from "./stored";
import type { SdkClientInstance } from "./client";

/** Agent SDK 完整接口 */
export interface AgentSdk {
  /** 流式聊天 */
  chat: ReturnType<typeof createChatApi>;
  /** Agent 发现 */
  agents: ReturnType<typeof createAgentsApi>;
  /** 工作流 */
  workflows: ReturnType<typeof createWorkflowsApi>;
  /** 工具 */
  tools: ReturnType<typeof createToolsApi>;
  /** 记忆/线程 */
  memory: ReturnType<typeof createMemoryApi>;
  /** 可观测性 */
  observability: ReturnType<typeof createObservabilityApi>;
  /** 数据集 */
  datasets: ReturnType<typeof createDatasetsApi>;
  /** MCP 服务 */
  mcp: ReturnType<typeof createMcpApi>;
  /** 向量/嵌入存储 */
  storage: ReturnType<typeof createStorageApi>;
  /** Agent Builder */
  builder: ReturnType<typeof createBuilderApi>;
  /** 工作空间 */
  workspace: ReturnType<typeof createWorkspaceApi>;
  /** 后台任务 */
  background: ReturnType<typeof createBackgroundApi>;
  /** 处理器 */
  processors: ReturnType<typeof createProcessorsApi>;
  /** 存储资源（stored agents, skills, scorers 等） */
  stored: ReturnType<typeof createStoredApi>;
  /** 底层 MastraClient（高级用法） */
  getClient(): any;
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
 * // MCP
 * const servers = await sdk.mcp.listServers();
 *
 * // 存储资源
 * const storedAgents = await sdk.stored.listAgents();
 * ```
 */
export function createAgentSdk(config: SdkConfig): AgentSdk {
  const sdkClient = createSdkClient(config);

  return {
    chat: createChatApi(sdkClient),
    agents: createAgentsApi(sdkClient),
    workflows: createWorkflowsApi(sdkClient),
    tools: createToolsApi(sdkClient),
    memory: createMemoryApi(sdkClient),
    observability: createObservabilityApi(sdkClient),
    datasets: createDatasetsApi(sdkClient),
    mcp: createMcpApi(sdkClient),
    storage: createStorageApi(sdkClient),
    builder: createBuilderApi(sdkClient),
    workspace: createWorkspaceApi(sdkClient),
    background: createBackgroundApi(sdkClient),
    processors: createProcessorsApi(sdkClient),
    stored: createStoredApi(sdkClient),
    getClient: sdkClient.getClient,
  };
}

export type { SdkConfig } from "./client";
