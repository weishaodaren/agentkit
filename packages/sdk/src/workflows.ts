/**
 * @agentkit/sdk - 工作流 API
 */

import type { SdkClientInstance } from "./client";

export interface WorkflowsApiInstance {
  /** 列出所有已注册的工作流 */
  listWorkflows(): Promise<Record<string, unknown>>;
  /** 执行工作流 */
  runWorkflow(
    workflowId: string,
    input: Record<string, unknown>,
  ): Promise<unknown>;
}

/**
 * 创建工作流 API 实例。
 */
export function createWorkflowsApi(
  sdkClient: SdkClientInstance,
): WorkflowsApiInstance {
  return {
    async listWorkflows() {
      return sdkClient.call(async () => {
        return sdkClient.getClient().listWorkflows();
      });
    },

    async runWorkflow(workflowId: string, input: Record<string, unknown>) {
      return sdkClient.call(async () => {
        const wf = sdkClient.getClient().getWorkflow(workflowId);
        const run = await wf.createRun();
        return run.startAsync({ inputData: input });
      });
    },
  };
}
