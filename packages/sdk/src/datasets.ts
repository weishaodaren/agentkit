/**
 * @agentkit/sdk - 数据集 API
 */

import type { SdkClientInstance } from "./client";

export interface DatasetsApiInstance {
  /** 列出数据集 */
  listDatasets(params?: Record<string, unknown>): Promise<unknown>;
  /** 获取数据集 */
  getDataset(datasetId: string): Promise<unknown>;
  /** 创建数据集 */
  createDataset(params: Record<string, unknown>): Promise<unknown>;
  /** 更新数据集 */
  updateDataset(
    datasetId: string,
    params: Record<string, unknown>,
  ): Promise<unknown>;
  /** 删除数据集 */
  deleteDataset(datasetId: string): Promise<unknown>;
  /** 列出数据集项 */
  listDatasetItems(
    datasetId: string,
    params?: Record<string, unknown>,
  ): Promise<unknown>;
  /** 添加数据集项 */
  addItem(params: Record<string, unknown>): Promise<unknown>;
  /** 触发实验 */
  triggerExperiment(params: Record<string, unknown>): Promise<unknown>;
}

/**
 * 创建数据集 API 实例。
 */
export function createDatasetsApi(
  sdkClient: SdkClientInstance,
): DatasetsApiInstance {
  return {
    async listDatasets(params) {
      return sdkClient.call(async () => {
        return sdkClient.getClient().listDatasets(params as any);
      });
    },

    async getDataset(datasetId) {
      return sdkClient.call(async () => {
        return sdkClient.getClient().getDataset(datasetId);
      });
    },

    async createDataset(params) {
      return sdkClient.call(async () => {
        return sdkClient.getClient().createDataset(params as any);
      });
    },

    async updateDataset(datasetId, params) {
      return sdkClient.call(async () => {
        return sdkClient
          .getClient()
          .updateDataset({ datasetId, ...params } as any);
      });
    },

    async deleteDataset(datasetId) {
      return sdkClient.call(async () => {
        return sdkClient.getClient().deleteDataset(datasetId);
      });
    },

    async listDatasetItems(datasetId, params) {
      return sdkClient.call(async () => {
        return sdkClient.getClient().listDatasetItems(datasetId, params as any);
      });
    },

    async addItem(params) {
      return sdkClient.call(async () => {
        return sdkClient.getClient().addDatasetItem(params as any);
      });
    },

    async triggerExperiment(params) {
      return sdkClient.call(async () => {
        return sdkClient.getClient().triggerDatasetExperiment(params as any);
      });
    },
  };
}
