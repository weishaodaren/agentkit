/**
 * @agentkit/sdk - 记忆/线程 API
 */

import type { MastraClient } from "@mastra/client-js";
import type { SdkClientInstance } from "./client";

export interface MemoryApiInstance {
  /** 列出记忆线程 */
  listThreads: (
    params?: Parameters<MastraClient["listMemoryThreads"]>[0],
  ) => Promise<Awaited<ReturnType<MastraClient["listMemoryThreads"]>>>;
  /** 创建新线程 */
  createThread: (
    params: Parameters<MastraClient["createMemoryThread"]>[0],
  ) => Promise<Awaited<ReturnType<MastraClient["createMemoryThread"]>>>;
  /** 获取线程实例 */
  getThread: (
    threadId: string,
    agentId?: string,
  ) => ReturnType<MastraClient["getMemoryThread"]>;
  /** 获取线程消息 */
  listThreadMessages: (
    threadId: string,
    opts?: Parameters<MastraClient["listThreadMessages"]>[1],
  ) => Promise<Awaited<ReturnType<MastraClient["listThreadMessages"]>>>;
  /** 删除线程 */
  deleteThread: (
    threadId: string,
    opts: Parameters<MastraClient["deleteThread"]>[1],
  ) => Promise<Awaited<ReturnType<MastraClient["deleteThread"]>>>;
  /** 保存消息到记忆 */
  saveMessages: (
    params: Parameters<MastraClient["saveMessageToMemory"]>[0],
  ) => Promise<Awaited<ReturnType<MastraClient["saveMessageToMemory"]>>>;
  /** 获取内存配置 */
  getMemoryConfig: (
    params: Parameters<MastraClient["getMemoryConfig"]>[0],
  ) => Promise<Awaited<ReturnType<MastraClient["getMemoryConfig"]>>>;
  /** 获取内存状态 */
  getMemoryStatus: (
    agentId: Parameters<MastraClient["getMemoryStatus"]>[0],
    opts?: Parameters<MastraClient["getMemoryStatus"]>[2] & {
      requestContext?: Parameters<MastraClient["getMemoryStatus"]>[1];
    },
  ) => Promise<Awaited<ReturnType<MastraClient["getMemoryStatus"]>>>;
  /** 获取观测记忆 */
  getObservationalMemory: (
    params: Parameters<MastraClient["getObservationalMemory"]>[0],
  ) => Promise<Awaited<ReturnType<MastraClient["getObservationalMemory"]>>>;
  /** 等待缓冲状态 */
  awaitBufferStatus: (
    params: Parameters<MastraClient["awaitBufferStatus"]>[0],
  ) => Promise<Awaited<ReturnType<MastraClient["awaitBufferStatus"]>>>;
  /** 获取工作记忆 */
  getWorkingMemory: (
    params: Parameters<MastraClient["getWorkingMemory"]>[0],
  ) => Promise<Awaited<ReturnType<MastraClient["getWorkingMemory"]>>>;
  /** 更新工作记忆 */
  updateWorkingMemory: (
    params: Parameters<MastraClient["updateWorkingMemory"]>[0],
  ) => Promise<Awaited<ReturnType<MastraClient["updateWorkingMemory"]>>>;
  /** 搜索记忆 */
  searchMemory: (
    params: Parameters<MastraClient["searchMemory"]>[0],
  ) => Promise<Awaited<ReturnType<MastraClient["searchMemory"]>>>;
}

/**
 * 创建记忆 API 实例
 */
export const createMemoryApi = (
  sdkClient: SdkClientInstance,
): MemoryApiInstance => {
  const client = sdkClient.getClient();

  return {
    listThreads: (params) =>
      sdkClient.call(() => client.listMemoryThreads(params)),

    createThread: (params) =>
      sdkClient.call(() => client.createMemoryThread(params)),

    getThread: (threadId, agentId) =>
      client.getMemoryThread({ threadId, agentId }),

    listThreadMessages: (threadId, opts) =>
      sdkClient.call(() => client.listThreadMessages(threadId, opts)),

    deleteThread: (threadId, opts) =>
      sdkClient.call(() => client.deleteThread(threadId, opts)),

    saveMessages: (params) =>
      sdkClient.call(() => client.saveMessageToMemory(params)),

    getMemoryConfig: (params) =>
      sdkClient.call(() => client.getMemoryConfig(params)),

    getMemoryStatus: (agentId, opts) =>
      sdkClient.call(() =>
        client.getMemoryStatus(agentId, opts?.requestContext, opts),
      ),

    getObservationalMemory: (params) =>
      sdkClient.call(() => client.getObservationalMemory(params)),

    awaitBufferStatus: (params) =>
      sdkClient.call(() => client.awaitBufferStatus(params)),

    getWorkingMemory: (params) =>
      sdkClient.call(() => client.getWorkingMemory(params)),

    updateWorkingMemory: (params) =>
      sdkClient.call(() => client.updateWorkingMemory(params)),

    searchMemory: (params) => sdkClient.call(() => client.searchMemory(params)),
  };
};
