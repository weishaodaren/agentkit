/**
 * @agentkit/sdk - datasets 测试
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { createDatasetsApi } from "../datasets";
import type { SdkClientInstance } from "../client";

describe("createDatasetsApi", () => {
  let mockSdkClient: SdkClientInstance;
  let mockClient: any;

  beforeEach(() => {
    mockClient = {
      listDatasets: vi.fn().mockResolvedValue({ datasets: [] }),
      getDataset: vi.fn().mockResolvedValue({ id: "ds-1" }),
      createDataset: vi.fn().mockResolvedValue({ id: "ds-1" }),
      updateDataset: vi.fn().mockResolvedValue({ id: "ds-1" }),
      deleteDataset: vi.fn().mockResolvedValue({ success: true }),
      listDatasetItems: vi.fn().mockResolvedValue({ items: [] }),
      getDatasetItem: vi.fn().mockResolvedValue({ id: "item-1" }),
      addDatasetItem: vi.fn().mockResolvedValue({ id: "item-1" }),
      updateDatasetItem: vi.fn().mockResolvedValue({ id: "item-1" }),
      deleteDatasetItem: vi.fn().mockResolvedValue({ success: true }),
      batchInsertDatasetItems: vi.fn().mockResolvedValue({ items: [] }),
      batchDeleteDatasetItems: vi.fn().mockResolvedValue({ success: true }),
      generateDatasetItems: vi.fn().mockResolvedValue({ items: [] }),
      clusterFailures: vi.fn().mockResolvedValue({ clusters: [] }),
      getItemHistory: vi.fn().mockResolvedValue({ history: [] }),
      getDatasetItemVersion: vi.fn().mockResolvedValue({}),
      listDatasetVersions: vi.fn().mockResolvedValue({ versions: [] }),
      listExperiments: vi.fn().mockResolvedValue({ experiments: [] }),
      getExperimentReviewSummary: vi.fn().mockResolvedValue({ counts: [] }),
      listDatasetExperiments: vi.fn().mockResolvedValue({ experiments: [] }),
      getDatasetExperiment: vi.fn().mockResolvedValue({ id: "exp-1" }),
      listDatasetExperimentResults: vi.fn().mockResolvedValue({ results: [] }),
      updateDatasetExperimentResult: vi.fn().mockResolvedValue({}),
      triggerDatasetExperiment: vi.fn().mockResolvedValue({}),
      updateExperimentResult: vi.fn().mockResolvedValue({}),
      compareExperiments: vi.fn().mockResolvedValue({}),
    };

    mockSdkClient = {
      getClient: vi.fn().mockReturnValue(mockClient),
      getConfig: vi.fn().mockReturnValue({ logger: null }),
      call: vi.fn().mockImplementation((fn) => fn()),
      createScopedClient: vi.fn().mockReturnValue(mockClient),
    };
  });

  it("should return an api instance with all methods", () => {
    const api = createDatasetsApi(mockSdkClient);
    const methods = [
      "listDatasets",
      "getDataset",
      "createDataset",
      "updateDataset",
      "deleteDataset",
      "listDatasetItems",
      "getDatasetItem",
      "addDatasetItem",
      "updateDatasetItem",
      "deleteDatasetItem",
      "batchInsertDatasetItems",
      "batchDeleteDatasetItems",
      "generateDatasetItems",
      "clusterFailures",
      "getItemHistory",
      "getDatasetItemVersion",
      "listDatasetVersions",
      "listExperiments",
      "getExperimentReviewSummary",
      "listDatasetExperiments",
      "getDatasetExperiment",
      "listDatasetExperimentResults",
      "updateDatasetExperimentResult",
      "triggerDatasetExperiment",
      "updateExperimentResult",
      "compareExperiments",
    ];
    for (const method of methods) {
      expect(typeof api[method as keyof typeof api]).toBe("function");
    }
  });

  it("should call listDatasets", async () => {
    const api = createDatasetsApi(mockSdkClient);
    await api.listDatasets();
    expect(mockClient.listDatasets).toHaveBeenCalled();
  });

  it("should call getDataset", async () => {
    const api = createDatasetsApi(mockSdkClient);
    await api.getDataset("ds-1");
    expect(mockClient.getDataset).toHaveBeenCalledWith("ds-1");
  });

  it("should call createDataset", async () => {
    const api = createDatasetsApi(mockSdkClient);
    await api.createDataset({ name: "test" });
    expect(mockClient.createDataset).toHaveBeenCalledWith({ name: "test" });
  });

  it("should call updateDataset", async () => {
    const api = createDatasetsApi(mockSdkClient);
    await api.updateDataset({ datasetId: "ds-1", name: "updated" });
    expect(mockClient.updateDataset).toHaveBeenCalledWith({
      datasetId: "ds-1",
      name: "updated",
    });
  });

  it("should call deleteDataset", async () => {
    const api = createDatasetsApi(mockSdkClient);
    await api.deleteDataset("ds-1");
    expect(mockClient.deleteDataset).toHaveBeenCalledWith("ds-1");
  });

  it("should call listDatasetItems", async () => {
    const api = createDatasetsApi(mockSdkClient);
    await api.listDatasetItems("ds-1");
    expect(mockClient.listDatasetItems).toHaveBeenCalledWith("ds-1");
  });

  it("should call addDatasetItem", async () => {
    const api = createDatasetsApi(mockSdkClient);
    await api.addDatasetItem({ datasetId: "ds-1", input: {} });
    expect(mockClient.addDatasetItem).toHaveBeenCalledWith({
      datasetId: "ds-1",
      input: {},
    });
  });

  it("should call triggerDatasetExperiment", async () => {
    const api = createDatasetsApi(mockSdkClient);
    await api.triggerDatasetExperiment({
      datasetId: "ds-1",
      targetId: "agent-1",
      targetType: "agent",
    });
    expect(mockClient.triggerDatasetExperiment).toHaveBeenCalledWith({
      datasetId: "ds-1",
      targetId: "agent-1",
      targetType: "agent",
    });
  });
});
