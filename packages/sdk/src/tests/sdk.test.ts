/**
 * @agentkit/sdk - sdk (createAgentSdk) 测试
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { createAgentSdk } from "../sdk";
import type { SdkClientInstance } from "../client";
import * as clientModule from "../client";
import * as chatModule from "../chat";
import * as agentsModule from "../agents";
import * as workflowsModule from "../workflows";
import * as toolsModule from "../tools";
import * as memoryModule from "../memory";
import * as telemetryModule from "../telemetry";
import * as logsModule from "../logs";
import * as vectorsModule from "../vectors";
import * as datasetsModule from "../datasets";
import * as responsesModule from "../responses";
import * as conversationsModule from "../conversations";
import * as mcpModule from "../mcp";
import * as processorsModule from "../processors";
import * as storedModule from "../stored";
import * as workspaceModule from "../workspace";
import * as scorersModule from "../scorers";
import * as builderModule from "../builder";

describe("createAgentSdk", () => {
  let mockSdkClient: SdkClientInstance;

  beforeEach(() => {
    mockSdkClient = {
      getClient: vi.fn().mockReturnValue({}),
      getConfig: vi.fn().mockReturnValue({ logger: null }),
      call: vi.fn().mockImplementation((fn) => fn()),
      createScopedClient: vi.fn().mockReturnValue({}),
    } as unknown as SdkClientInstance;

    vi.spyOn(clientModule, "createSdkClient").mockReturnValue(mockSdkClient);
    vi.spyOn(chatModule, "createChatApi").mockReturnValue({
      sendMessage: vi.fn(),
    } as never);
    vi.spyOn(agentsModule, "createAgentsApi").mockReturnValue({
      listAgents: vi.fn(),
    } as never);
    vi.spyOn(workflowsModule, "createWorkflowsApi").mockReturnValue({
      listWorkflows: vi.fn(),
    } as never);
    vi.spyOn(toolsModule, "createToolsApi").mockReturnValue({
      listTools: vi.fn(),
    } as never);
    vi.spyOn(memoryModule, "createMemoryApi").mockReturnValue({
      listThreads: vi.fn(),
    } as never);
    vi.spyOn(telemetryModule, "createTelemetryApi").mockReturnValue({
      listTraces: vi.fn(),
    } as never);
    vi.spyOn(logsModule, "createLogsApi").mockReturnValue({
      listLogs: vi.fn(),
    } as never);
    vi.spyOn(vectorsModule, "createVectorsApi").mockReturnValue({
      listVectors: vi.fn(),
    } as never);
    vi.spyOn(datasetsModule, "createDatasetsApi").mockReturnValue({
      listDatasets: vi.fn(),
    } as never);
    vi.spyOn(responsesModule, "createResponsesApi").mockReturnValue({
      create: vi.fn(),
    } as never);
    vi.spyOn(conversationsModule, "createConversationsApi").mockReturnValue({
      create: vi.fn(),
    } as never);
    vi.spyOn(mcpModule, "createMcpApi").mockReturnValue({
      listServers: vi.fn(),
    } as never);
    vi.spyOn(processorsModule, "createProcessorsApi").mockReturnValue({
      listProcessors: vi.fn(),
    } as never);
    vi.spyOn(storedModule, "createStoredApi").mockReturnValue({
      listAgents: vi.fn(),
    } as never);
    vi.spyOn(workspaceModule, "createWorkspaceApi").mockReturnValue({
      listWorkspaces: vi.fn(),
    } as never);
    vi.spyOn(scorersModule, "createScorersApi").mockReturnValue({
      listScorers: vi.fn(),
    } as never);
    vi.spyOn(builderModule, "createBuilderApi").mockReturnValue({
      getSettings: vi.fn(),
    } as never);
  });

  it("should create sdk with all modules", () => {
    const sdk = createAgentSdk({ baseUrl: "http://localhost:4000" });

    expect(sdk.chat).toBeDefined();
    expect(sdk.agents).toBeDefined();
    expect(sdk.workflows).toBeDefined();
    expect(sdk.tools).toBeDefined();
    expect(sdk.memory).toBeDefined();
    expect(sdk.telemetry).toBeDefined();
    expect(sdk.logs).toBeDefined();
    expect(sdk.vectors).toBeDefined();
    expect(sdk.datasets).toBeDefined();
    expect(sdk.responses).toBeDefined();
    expect(sdk.conversations).toBeDefined();
    expect(sdk.mcp).toBeDefined();
    expect(sdk.processors).toBeDefined();
    expect(sdk.stored).toBeDefined();
    expect(sdk.workspace).toBeDefined();
    expect(sdk.scorers).toBeDefined();
    expect(sdk.builder).toBeDefined();
    expect(typeof sdk.getClient).toBe("function");
  });

  it("should pass config to sdkClient", () => {
    createAgentSdk({
      baseUrl: "http://example.com",
      retries: 3,
      retryDelay: 500,
      retryBackoff: 3,
    });

    expect(clientModule.createSdkClient).toHaveBeenCalledWith({
      baseUrl: "http://example.com",
      retries: 3,
      retryDelay: 500,
      retryBackoff: 3,
    });
  });
});
