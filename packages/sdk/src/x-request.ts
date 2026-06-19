/**
 * @agentkit/sdk - XRequest
 *
 * antd-x XRequest 对标实现
 * 管理 AI 对话流式请求
 *
 * 特性:
 * - SSE (Server-Sent Events) 流式支持
 * - 普通 JSON 请求支持
 * - 请求/响应中间件
 * - 超时控制 (整体超时 + 流式超时)
 * - 自定义 fetch
 * - 请求取消 (AbortController)
 */

export type SSEOutput = string;
export type JSONOutput = Record<string, unknown>;

export interface XRequestCallbacks<Output> {
  /** 请求成功回调 */
  onSuccess: (chunks: Output[], headers: Headers) => void;
  /** 请求失败回调 */
  onError: (error: Error, headers?: Headers) => void;
  /** 流式更新回调 (每次收到新 chunk) */
  onUpdate?: (chunk: Output, headers: Headers) => void;
}

export interface XRequestConfig<
  Input = Record<string, unknown>,
  Output = SSEOutput,
> {
  /** 请求 URL */
  baseURL: string;
  /** 请求方法 */
  method?: "GET" | "POST" | "PUT" | "DELETE";
  /** 请求参数 (JSON body) */
  params?: Partial<Input>;
  /** 自定义请求头 */
  headers?: Record<string, string>;
  /** 整体超时 (ms) */
  timeout?: number;
  /** 流式超时 (ms, 无新数据则中止) */
  streamTimeout?: number;
  /** 是否启用 SSE 流式模式 */
  stream?: boolean;
  /** 回调函数 */
  callbacks?: XRequestCallbacks<Output>;
  /** 自定义 fetch 函数 */
  fetch?: typeof globalThis.fetch;
  /** SSE 数据解析器 */
  transformStream?: (chunk: string) => Output;
}

/**
 * Parse SSE event data from a text chunk.
 * Handles "data: ..." lines from Server-Sent Events.
 */
function parseSSEData(raw: string): string[] {
  const lines = raw.split("\n");
  const results: string[] = [];
  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed.startsWith("data:")) {
      const data = trimmed.slice(5).trim();
      if (data && data !== "[DONE]") {
        results.push(data);
      }
    }
  }
  return results;
}

export class XRequest<Input = Record<string, unknown>, Output = SSEOutput> {
  private _config: XRequestConfig<Input, Output>;
  private _abortController: AbortController | null = null;

  constructor(config: XRequestConfig<Input, Output>) {
    this._config = {
      method: "POST",
      stream: true,
      timeout: 30000,
      ...config,
    };
  }

  /** 发起请求 */
  async run(
    params?: Partial<Input>,
    callbacks?: XRequestCallbacks<Output>,
  ): Promise<void> {
    const cb = callbacks || this._config.callbacks;
    if (!cb) {
      throw new Error("XRequest: callbacks are required");
    }

    // Cancel any previous in-flight request
    this._abortController?.abort();
    this._abortController = new AbortController();
    const { signal } = this._abortController;

    const fetchFn = this._config.fetch || globalThis.fetch;
    const mergedParams = { ...this._config.params, ...params };
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      ...this._config.headers,
    };

    // Set up timeout
    let timeoutId: number | undefined;
    if (this._config.timeout) {
      timeoutId = window.setTimeout(() => {
        this._abortController?.abort();
        cb.onError(new Error("XRequest: Request timeout"));
      }, this._config.timeout);
    }

    try {
      const response = await fetchFn(this._config.baseURL, {
        method: this._config.method,
        headers,
        body:
          this._config.method !== "GET"
            ? JSON.stringify(mergedParams)
            : undefined,
        signal,
      });

      if (timeoutId) clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(
          `XRequest: HTTP ${response.status} ${response.statusText}`,
        );
      }

      if (this._config.stream && response.body) {
        await this._handleStream(response, cb);
      } else {
        await this._handleJSON(response, cb);
      }
    } catch (error) {
      if (timeoutId) clearTimeout(timeoutId);
      if ((error as Error).name !== "AbortError") {
        cb.onError(error as Error);
      }
    } finally {
      this._abortController = null;
    }
  }

  /** 取消请求 */
  cancel(): void {
    this._abortController?.abort();
    this._abortController = null;
  }

  private async _handleStream(
    response: Response,
    cb: XRequestCallbacks<Output>,
  ): Promise<void> {
    const reader = response.body!.getReader();
    const decoder = new TextDecoder();
    const chunks: Output[] = [];
    const responseHeaders = response.headers;
    let errored = false;

    let streamTimeoutId: number | undefined;
    const resetStreamTimeout = () => {
      if (streamTimeoutId) clearTimeout(streamTimeoutId);
      if (this._config.streamTimeout) {
        streamTimeoutId = window.setTimeout(() => {
          errored = true;
          reader.cancel();
          cb.onError(new Error("XRequest: Stream timeout"), responseHeaders);
        }, this._config.streamTimeout);
      }
    };

    try {
      resetStreamTimeout();
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        resetStreamTimeout();
        const text = decoder.decode(value, { stream: true });

        if (this._config.transformStream) {
          const output = this._config.transformStream(text);
          chunks.push(output);
          cb.onUpdate?.(output, responseHeaders);
        } else {
          const dataItems = parseSSEData(text);
          for (const data of dataItems) {
            const output = data as unknown as Output;
            chunks.push(output);
            cb.onUpdate?.(output, responseHeaders);
          }
        }
      }

      if (streamTimeoutId) clearTimeout(streamTimeoutId);
      // Only call onSuccess if no error occurred (e.g., stream timeout)
      if (!errored) {
        cb.onSuccess(chunks, responseHeaders);
      }
    } catch (error) {
      if (streamTimeoutId) clearTimeout(streamTimeoutId);
      if (!errored && (error as Error).name !== "AbortError") {
        cb.onError(error as Error, responseHeaders);
      }
    }
  }

  private async _handleJSON(
    response: Response,
    cb: XRequestCallbacks<Output>,
  ): Promise<void> {
    const responseHeaders = response.headers;
    const data = await response.json();
    const output = data as unknown as Output;
    cb.onSuccess([output], responseHeaders);
  }
}
