/**
 * @agentkit/sdk - types 测试
 */

import { describe, it, expect } from "vitest";
import {
  API_BASE_PATH,
  REQUEST_TIMEOUT,
  ERROR_CODE,
  SSE_EVENT,
} from "../types";

describe("shared constants", () => {
  it("should export API_BASE_PATH", () => {
    expect(API_BASE_PATH).toBe("/api/v1");
  });

  it("should export REQUEST_TIMEOUT", () => {
    expect(REQUEST_TIMEOUT).toBe(30000);
  });

  it("should export ERROR_CODE constants", () => {
    expect(ERROR_CODE.BAD_REQUEST).toBe(400);
    expect(ERROR_CODE.UNAUTHORIZED).toBe(401);
    expect(ERROR_CODE.FORBIDDEN).toBe(403);
    expect(ERROR_CODE.NOT_FOUND).toBe(404);
    expect(ERROR_CODE.INTERNAL_ERROR).toBe(500);
  });

  it("should export SSE_EVENT constants", () => {
    expect(SSE_EVENT.MESSAGE).toBe("message");
    expect(SSE_EVENT.ERROR).toBe("error");
    expect(SSE_EVENT.DONE).toBe("done");
  });
});
