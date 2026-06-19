/**
 * @agentkit/sdk - useXChat
 *
 * antd-x useXChat 对标实现
 * 管理 AI 对话消息状态流
 *
 * 消息状态: local → loading → updating → success / error / abort
 *
 * 这是一个框架无关的状态管理器，
 * 可以在 React/Vue/Lit 或任何框架中使用。
 */

export type MessageStatus =
  | "local"
  | "loading"
  | "updating"
  | "success"
  | "error"
  | "abort";

export interface ChatMessage<Message = string> {
  id: string | number;
  message: Message;
  status: MessageStatus;
  role?: "user" | "assistant" | "system";
  extra?: Record<string, unknown>;
}

export interface UseXChatConfig<Message = string> {
  /** 默认消息列表 */
  defaultMessages?: ChatMessage[];
  /** 将原始消息转换为显示消息 */
  parser?: (raw: Message) => Message | Message[];
  /** 请求占位消息 (loading 时显示) */
  requestPlaceholder?: Message | ((params: Record<string, unknown>) => Message);
  /** 请求失败回退消息 */
  requestFallback?:
    | Message
    | ((error: Error, params: Record<string, unknown>) => Message);
}

export interface UseXChatReturn<Message = string> {
  /** 当前消息列表 */
  messages: ChatMessage<Message>[];
  /** 添加用户消息并触发请求 */
  onRequest: (params: Record<string, unknown>, message: Message) => string;
  /** 更新指定消息 */
  onUpdate: (
    id: string | number,
    updates: Partial<ChatMessage<Message>>,
  ) => void;
  /** 设置消息状态 */
  setStatus: (id: string | number, status: MessageStatus) => void;
  /** 追加内容到指定消息 (用于流式更新) */
  appendToMessage: (id: string | number, chunk: Message) => void;
  /** 删除消息 */
  remove: (id: string | number) => void;
  /** 清空消息 */
  clear: () => void;
  /** 中止指定消息的请求 */
  abort: (id: string | number) => void;
  /** 处理请求错误，应用 requestFallback 配置 */
  handleError: (
    id: string | number,
    error: Error,
    params: Record<string, unknown>,
  ) => void;
  /** 获取当前是否正在请求 */
  isLoading: boolean;
}

let messageIdCounter = 0;
function generateId(): string {
  return `msg-${Date.now()}-${++messageIdCounter}`;
}

/**
 * Create a chat state manager.
 * Framework-agnostic: works with React, Vue, Lit, or vanilla JS.
 *
 * @example
 * ```ts
 * const chat = useXChat({
 *   defaultMessages: [],
 *   requestPlaceholder: "正在思考...",
 * });
 *
 * // User sends a message
 * const assistantId = chat.onRequest({ prompt: "Hello" }, "Hello");
 *
 * // Stream content arrives
 * chat.appendToMessage(assistantId, "Hi there!");
 * chat.appendToMessage(assistantId, " How can I help?");
 *
 * // Request completes
 * chat.setStatus(assistantId, "success");
 * ```
 */
export function useXChat<Message = string>(
  config: UseXChatConfig<Message> = {},
): UseXChatReturn<Message> {
  let messages: ChatMessage<Message>[] = [
    ...((config.defaultMessages ?? []) as ChatMessage<Message>[]),
  ];
  let loadingIds = new Set<string | number>();

  // Simple reactive notification (override with framework-specific setter)
  let onChange: (() => void) | null = null;

  function notify() {
    onChange?.();
  }

  function getMessages(): ChatMessage<Message>[] {
    return messages;
  }

  function onRequest(
    params: Record<string, unknown>,
    userMessage: Message,
  ): string {
    // Add user message
    const userId = generateId();
    messages = [
      ...messages,
      {
        id: userId,
        message: userMessage,
        status: "local",
        role: "user",
      },
    ];

    // Add placeholder assistant message
    const assistantId = generateId();
    let placeholderMsg: Message;
    if (typeof config.requestPlaceholder === "function") {
      placeholderMsg = (
        config.requestPlaceholder as (p: Record<string, unknown>) => Message
      )(params);
    } else {
      placeholderMsg = (config.requestPlaceholder ??
        ("" as unknown)) as Message;
    }

    messages = [
      ...messages,
      {
        id: assistantId,
        message: placeholderMsg,
        status: "loading",
        role: "assistant",
      },
    ];

    loadingIds.add(assistantId);
    notify();
    return assistantId;
  }

  function onUpdate(
    id: string | number,
    updates: Partial<ChatMessage<Message>>,
  ) {
    messages = messages.map((m) => (m.id === id ? { ...m, ...updates } : m));
    notify();
  }

  function setStatus(id: string | number, status: MessageStatus) {
    messages = messages.map((m) => (m.id === id ? { ...m, status } : m));
    if (status !== "loading" && status !== "updating") {
      loadingIds.delete(id);
    }
    notify();
  }

  function appendToMessage(id: string | number, chunk: Message) {
    messages = messages.map((m) => {
      if (m.id !== id) return m;
      // Concatenate string messages
      if (typeof m.message === "string" && typeof chunk === "string") {
        return {
          ...m,
          message: (m.message + chunk) as unknown as Message,
          status:
            m.status === "loading" ? ("updating" as MessageStatus) : m.status,
        };
      }
      return m;
    });
    notify();
  }

  function remove(id: string | number) {
    messages = messages.filter((m) => m.id !== id);
    loadingIds.delete(id);
    notify();
  }

  function clear() {
    messages = [];
    loadingIds.clear();
    notify();
  }

  function abort(id: string | number) {
    setStatus(id, "abort");
    loadingIds.delete(id);
  }

  function handleError(
    id: string | number,
    error: Error,
    params: Record<string, unknown>,
  ) {
    if (config.requestFallback) {
      let fallbackMsg: Message;
      if (typeof config.requestFallback === "function") {
        fallbackMsg = (
          config.requestFallback as (
            e: Error,
            p: Record<string, unknown>,
          ) => Message
        )(error, params);
      } else {
        fallbackMsg = config.requestFallback as Message;
      }
      onUpdate(id, { message: fallbackMsg });
    }
    setStatus(id, "error");
  }

  return {
    get messages() {
      return getMessages();
    },
    onRequest,
    onUpdate,
    setStatus,
    appendToMessage,
    remove,
    clear,
    abort,
    handleError,
    get isLoading() {
      return loadingIds.size > 0;
    },
  };
}
