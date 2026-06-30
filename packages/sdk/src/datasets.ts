/**
 * @agentkit/sdk - 数据集 API
 */

import type { MastraClient } from "@mastra/client-js";
import type { SdkClientInstance } from "./client";

export interface DatasetsApiInstance {
  /** 列出数据集 */
  listDatasets: (
    params?: Parameters<MastraClient["listDatasets"]>[0],
  ) => Promise<Awaited<ReturnType<MastraClient["listDatasets"]>>>;
  /** 获取数据集 */
  getDataset: (
    datasetId: string,
  ) => Promise<Awaited<ReturnType<MastraClient["getDataset"]>>>;
  /** 创建数据集 */
  createDataset: (
    params: Parameters<MastraClient["createDataset"]>[0],
  ) => Promise<Awaited<ReturnType<MastraClient["createDataset"]>>>;
  /** 更新数据集 */
  updateDataset: (
    params: Parameters<MastraClient["updateDataset"]>[0],
  ) => Promise<Awaited<ReturnType<MastraClient["updateDataset"]>>>;
  /** 删除数据集 */
  deleteDataset: (
    datasetId: string,
  ) => Promise<Awaited<ReturnType<MastraClient["deleteDataset"]>>>;
  /** 列出数据集项 */
  listDatasetItems: (
    datasetId: string,
    params?: Parameters<MastraClient["listDatasetItems"]>[1],
  ) => Promise<Awaited<ReturnType<MastraClient["listDatasetItems"]>>>;
  /** 获取数据集项 */
  getDatasetItem: (
    datasetId: string,
    itemId: string,
  ) => Promise<Awaited<ReturnType<MastraClient["getDatasetItem"]>>>;
  /** 添加数据集项 */
  addDatasetItem: (
    params: Parameters<MastraClient["addDatasetItem"]>[0],
  ) => Promise<Awaited<ReturnType<MastraClient["addDatasetItem"]>>>;
  /** 更新数据集项 */
  updateDatasetItem: (
    params: Parameters<MastraClient["updateDatasetItem"]>[0],
  ) => Promise<Awaited<ReturnType<MastraClient["updateDatasetItem"]>>>;
  /** 删除数据集项 */
  deleteDatasetItem: (
    datasetId: string,
    itemId: string,
  ) => Promise<Awaited<ReturnType<MastraClient["deleteDatasetItem"]>>>;
  /** 批量插入数据集项 */
  batchInsertDatasetItems: (
    params: Parameters<MastraClient["batchInsertDatasetItems"]>[0],
  ) => Promise<Awaited<ReturnType<MastraClient["batchInsertDatasetItems"]>>>;
  /** 批量删除数据集项 */
  batchDeleteDatasetItems: (
    params: Parameters<MastraClient["batchDeleteDatasetItems"]>[0],
  ) => Promise<Awaited<ReturnType<MastraClient["batchDeleteDatasetItems"]>>>;
  /** 生成数据集项 */
  generateDatasetItems: (
    params: Parameters<MastraClient["generateDatasetItems"]>[0],
  ) => Promise<Awaited<ReturnType<MastraClient["generateDatasetItems"]>>>;
  /** 聚类失败 */
  clusterFailures: (
    params: Parameters<MastraClient["clusterFailures"]>[0],
  ) => Promise<Awaited<ReturnType<MastraClient["clusterFailures"]>>>;
  /** 获取项历史 */
  getItemHistory: (
    datasetId: string,
    itemId: string,
  ) => Promise<Awaited<ReturnType<MastraClient["getItemHistory"]>>>;
  /** 获取数据集项版本 */
  getDatasetItemVersion: (
    datasetId: string,
    itemId: string,
    version: number,
  ) => Promise<Awaited<ReturnType<MastraClient["getDatasetItemVersion"]>>>;
  /** 列出版本 */
  listDatasetVersions: (
    datasetId: string,
    params?: Parameters<MastraClient["listDatasetVersions"]>[1],
  ) => Promise<Awaited<ReturnType<MastraClient["listDatasetVersions"]>>>;
  /** 列出所有实验 */
  listExperiments: (
    params?: Parameters<MastraClient["listExperiments"]>[0],
  ) => Promise<Awaited<ReturnType<MastraClient["listExperiments"]>>>;
  /** 获取实验评审摘要 */
  getExperimentReviewSummary: () => Promise<
    Awaited<ReturnType<MastraClient["getExperimentReviewSummary"]>>
  >;
  /** 列出数据集实验 */
  listDatasetExperiments: (
    datasetId: string,
    params?: Parameters<MastraClient["listDatasetExperiments"]>[1],
  ) => Promise<Awaited<ReturnType<MastraClient["listDatasetExperiments"]>>>;
  /** 获取实验 */
  getDatasetExperiment: (
    datasetId: string,
    experimentId: string,
  ) => Promise<Awaited<ReturnType<MastraClient["getDatasetExperiment"]>>>;
  /** 列出实验结果 */
  listDatasetExperimentResults: (
    datasetId: string,
    experimentId: string,
    params?: Parameters<MastraClient["listDatasetExperimentResults"]>[2],
  ) => Promise<
    Awaited<ReturnType<MastraClient["listDatasetExperimentResults"]>>
  >;
  /** 更新实验结果 */
  updateDatasetExperimentResult: (
    params: Parameters<MastraClient["updateDatasetExperimentResult"]>[0],
  ) => Promise<
    Awaited<ReturnType<MastraClient["updateDatasetExperimentResult"]>>
  >;
  /** 触发实验 */
  triggerDatasetExperiment: (
    params: Parameters<MastraClient["triggerDatasetExperiment"]>[0],
  ) => Promise<Awaited<ReturnType<MastraClient["triggerDatasetExperiment"]>>>;
  /** 更新实验结果（别名） */
  updateExperimentResult: (
    params: Parameters<MastraClient["updateExperimentResult"]>[0],
  ) => Promise<Awaited<ReturnType<MastraClient["updateExperimentResult"]>>>;
  /** 对比实验 */
  compareExperiments: (
    params: Parameters<MastraClient["compareExperiments"]>[0],
  ) => Promise<Awaited<ReturnType<MastraClient["compareExperiments"]>>>;
}

/**
 * 创建数据集 API 实例
 */
export const createDatasetsApi = (
  sdkClient: SdkClientInstance,
): DatasetsApiInstance => {
  const client = sdkClient.getClient();

  return {
    listDatasets: (params) => sdkClient.call(() => client.listDatasets(params)),

    getDataset: (datasetId) =>
      sdkClient.call(() => client.getDataset(datasetId)),

    createDataset: (params) =>
      sdkClient.call(() => client.createDataset(params)),

    updateDataset: (params) =>
      sdkClient.call(() => client.updateDataset(params)),

    deleteDataset: (datasetId) =>
      sdkClient.call(() => client.deleteDataset(datasetId)),

    listDatasetItems: (datasetId, params) =>
      sdkClient.call(() => client.listDatasetItems(datasetId, params)),

    getDatasetItem: (datasetId, itemId) =>
      sdkClient.call(() => client.getDatasetItem(datasetId, itemId)),

    addDatasetItem: (params) =>
      sdkClient.call(() => client.addDatasetItem(params)),

    updateDatasetItem: (params) =>
      sdkClient.call(() => client.updateDatasetItem(params)),

    deleteDatasetItem: (datasetId, itemId) =>
      sdkClient.call(() => client.deleteDatasetItem(datasetId, itemId)),

    batchInsertDatasetItems: (params) =>
      sdkClient.call(() => client.batchInsertDatasetItems(params)),

    batchDeleteDatasetItems: (params) =>
      sdkClient.call(() => client.batchDeleteDatasetItems(params)),

    generateDatasetItems: (params) =>
      sdkClient.call(() => client.generateDatasetItems(params)),

    clusterFailures: (params) =>
      sdkClient.call(() => client.clusterFailures(params)),

    getItemHistory: (datasetId, itemId) =>
      sdkClient.call(() => client.getItemHistory(datasetId, itemId)),

    getDatasetItemVersion: (datasetId, itemId, version) =>
      sdkClient.call(() =>
        client.getDatasetItemVersion(datasetId, itemId, version),
      ),

    listDatasetVersions: (datasetId, params) =>
      sdkClient.call(() => client.listDatasetVersions(datasetId, params)),

    listExperiments: (params) =>
      sdkClient.call(() => client.listExperiments(params)),

    getExperimentReviewSummary: () =>
      sdkClient.call(() => client.getExperimentReviewSummary()),

    listDatasetExperiments: (datasetId, params) =>
      sdkClient.call(() => client.listDatasetExperiments(datasetId, params)),

    getDatasetExperiment: (datasetId, experimentId) =>
      sdkClient.call(() =>
        client.getDatasetExperiment(datasetId, experimentId),
      ),

    listDatasetExperimentResults: (datasetId, experimentId, params) =>
      sdkClient.call(() =>
        client.listDatasetExperimentResults(datasetId, experimentId, params),
      ),

    updateDatasetExperimentResult: (params) =>
      sdkClient.call(() => client.updateDatasetExperimentResult(params)),

    triggerDatasetExperiment: (params) =>
      sdkClient.call(() => client.triggerDatasetExperiment(params)),

    updateExperimentResult: (params) =>
      sdkClient.call(() => client.updateExperimentResult(params)),

    compareExperiments: (params) =>
      sdkClient.call(() => client.compareExperiments(params)),
  };
};
