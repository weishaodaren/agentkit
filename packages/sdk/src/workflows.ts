/**
 * @agentkit/sdk - 工作流 API
 */

import type { MastraClient } from "@mastra/client-js";
import type { SdkClientInstance } from "./client";

export interface WorkflowsApiInstance {
  /** 列出所有已注册的工作流 */
  listWorkflows: (
    requestContext?: Parameters<MastraClient["listWorkflows"]>[0],
    partial?: Parameters<MastraClient["listWorkflows"]>[1],
  ) => Promise<Awaited<ReturnType<MastraClient["listWorkflows"]>>>;
  /** 获取工作流实例 */
  getWorkflow: (workflowId: string) => ReturnType<MastraClient["getWorkflow"]>;
  /** 执行工作流（同步） */
  runWorkflow: (
    workflowId: string,
    input: Record<string, unknown>,
  ) => Promise<unknown>;
  /** 列出工作流调度 */
  listSchedules: (
    params?: Parameters<MastraClient["listSchedules"]>[0],
  ) => Promise<Awaited<ReturnType<MastraClient["listSchedules"]>>>;
  /** 获取调度 */
  getSchedule: (
    scheduleId: string,
  ) => Promise<Awaited<ReturnType<MastraClient["getSchedule"]>>>;
  /** 列出调度触发历史 */
  listScheduleTriggers: (
    scheduleId: string,
    params?: Parameters<MastraClient["listScheduleTriggers"]>[1],
  ) => Promise<Awaited<ReturnType<MastraClient["listScheduleTriggers"]>>>;
  /** 暂停调度 */
  pauseSchedule: (
    scheduleId: string,
  ) => Promise<Awaited<ReturnType<MastraClient["pauseSchedule"]>>>;
  /** 恢复调度 */
  resumeSchedule: (
    scheduleId: string,
  ) => Promise<Awaited<ReturnType<MastraClient["resumeSchedule"]>>>;
}

/**
 * 创建工作流 API 实例
 */
export const createWorkflowsApi = (
  sdkClient: SdkClientInstance,
): WorkflowsApiInstance => {
  const client = sdkClient.getClient();

  return {
    listWorkflows: (requestContext, partial) =>
      sdkClient.call(() => client.listWorkflows(requestContext, partial)),

    getWorkflow: (workflowId) => client.getWorkflow(workflowId),

    runWorkflow: (workflowId, input) =>
      sdkClient.call(async () => {
        const wf = client.getWorkflow(workflowId);
        const run = await wf.createRun();
        return run.startAsync({ inputData: input });
      }),

    listSchedules: (params) =>
      sdkClient.call(() => client.listSchedules(params)),

    getSchedule: (scheduleId) =>
      sdkClient.call(() => client.getSchedule(scheduleId)),

    listScheduleTriggers: (scheduleId, params) =>
      sdkClient.call(() => client.listScheduleTriggers(scheduleId, params)),

    pauseSchedule: (scheduleId) =>
      sdkClient.call(() => client.pauseSchedule(scheduleId)),

    resumeSchedule: (scheduleId) =>
      sdkClient.call(() => client.resumeSchedule(scheduleId)),
  };
};
