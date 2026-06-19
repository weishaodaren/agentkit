/**
 * @agentkit/sdk
 *
 * AI 对话数据流管理 SDK
 * 对标 @ant-design/x-sdk
 *
 * 核心模块:
 * - XRequest: 流式请求管理器 (SSE + JSON)
 * - useXChat: 对话状态管理器 (框架无关)
 */

export { XRequest } from "./x-request";
export type {
  XRequestConfig,
  XRequestCallbacks,
  SSEOutput,
  JSONOutput,
} from "./x-request";

export { useXChat } from "./use-x-chat";
export type {
  ChatMessage,
  MessageStatus,
  UseXChatConfig,
  UseXChatReturn,
} from "./use-x-chat";
