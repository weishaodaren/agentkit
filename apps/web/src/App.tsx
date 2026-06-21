import { useState, useRef, useCallback, useEffect } from "react";
import {
  Welcome,
  Think,
  Prompts,
  Bubble,
  Sender,
  Actions,
  Conversations,
  Suggestion,
  Button,
  Notification,
} from "@agentkit/ui/adaptor/react";
import { Markdown } from "@agentkit/ui/adaptor/react-plugins";
import type {
  PromptsItem,
  ActionsItem,
  ConversationItem,
  SuggestionItem,
  NotificationOptions,
} from "@agentkit/ui";

// ─── Types ───────────────────────────────────────────────────────
interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  thinking?: string;
  status: "loading" | "streaming" | "done" | "error";
}

interface Conversation {
  key: string;
  label: string;
  messages: ChatMessage[];
}

// ─── Static Data ─────────────────────────────────────────────────
const SUGGESTIONS: SuggestionItem[] = [
  { key: "sg1", label: "/help 获取帮助", value: "/help" },
  { key: "sg2", label: "/clear 清空对话", value: "/clear" },
  { key: "sg3", label: "/settings 设置", value: "/settings" },
  { key: "sg4", label: "/theme 切换主题", value: "/theme" },
];

const PROMPT_ITEMS: PromptsItem[] = [
  {
    key: "p1",
    label: "什么是 AgentKit UI？",
    description: "了解组件库的核心设计理念",
  },
  {
    key: "p2",
    label: "如何集成到 React 项目？",
    description: "快速上手指南",
  },
  {
    key: "p3",
    label: "支持哪些组件？",
    description: "查看完整的组件列表",
  },
];

const MOCK_RESPONSE = `## AgentKit UI 组件库

AgentKit UI 是一个基于 **Lit** + **Tailwind CSS v4** 构建的 Web Components 组件库。

### 核心特性

- 🎯 **框架无关** — 可在 React、Vue、Angular 或原生 HTML 中使用
- 🎨 **Tailwind CSS v4** — 原子化 CSS，Shadow DOM 内嵌样式
- 📦 **插件化分包** — Markdown 和代码高亮作为可选插件
- ⚡ **流式渲染** — 支持 AI 对话中逐字输出

### 快速开始

\`\`\`bash
pnpm add @agentkit/ui
\`\`\`

### 使用示例

\`\`\`tsx
import { Bubble, Sender } from "@agentkit/ui/adaptor/react";
import { Markdown } from "@agentkit/ui/adaptor/react-plugins";

function Chat() {
  return (
    <div>
      <Bubble content="Hello!" placement="start" />
      <Markdown content={response} streamStatus="loading" />
      <Sender onSubmit={handleSend} />
    </div>
  );
}
\`\`\`

> 💡 **提示**: 使用 \`streamStatus="loading"\` 可以启用打字光标效果`;

const MOCK_THINKING = `用户询问关于 AgentKit UI 组件库的信息。我需要：
1. 介绍组件库的核心技术栈（Lit + Tailwind CSS v4）
2. 列出主要特性
3. 提供快速上手的代码示例
4. 说明插件化分包策略`;

const DEFAULT_CONVERSATIONS: Conversation[] = [
  { key: "c1", label: "新的对话", messages: [] },
  {
    key: "c2",
    label: "AgentKit UI 入门指南",
    messages: [
      {
        id: "m1",
        role: "user",
        content: "什么是 AgentKit UI？",
        status: "done",
      },
      {
        id: "m2",
        role: "assistant",
        content: MOCK_RESPONSE,
        thinking: MOCK_THINKING,
        status: "done",
      },
    ],
  },
  {
    key: "c3",
    label: "React 集成方案讨论",
    messages: [
      {
        id: "m3",
        role: "user",
        content: "如何在 React 项目中使用？",
        status: "done",
      },
      {
        id: "m4",
        role: "assistant",
        content:
          "通过 `@agentkit/ui/adaptor/react` 适配器，可以直接在 React 中使用所有组件。\n\n```tsx\nimport { Bubble, Sender } from '@agentkit/ui/adaptor/react';\nimport { Markdown } from '@agentkit/ui/adaptor/react-plugins';\n```",
        status: "done",
      },
    ],
  },
];

// ─── Helpers ─────────────────────────────────────────────────────
let msgIdCounter = 100;
function genId() {
  return `msg-${++msgIdCounter}`;
}

function notify(
  ref: React.RefObject<HTMLElement | null>,
  opts: NotificationOptions,
) {
  if (ref.current) (ref.current as any).open(opts);
}

// ─── CSS-in-JS Styles ──────────────────────────────────────────
const styles = {
  // Layout
  wrapper: {
    width: "100%",
    height: "100vh",
    display: "flex",
    fontFamily: "system-ui, sans-serif",
  } as React.CSSProperties,

  // Left workarea
  workarea: {
    flex: 1,
    background: "#f5f5f5",
    display: "flex",
    flexDirection: "column",
    minWidth: 0,
  } as React.CSSProperties,
  workareaHeader: {
    boxSizing: "border-box",
    height: 52,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "0 48px 0 28px",
    borderBottom: "1px solid #e5e7eb",
    background: "#fff",
  } as React.CSSProperties,
  headerTitle: {
    fontWeight: 600,
    fontSize: 15,
    display: "flex",
    alignItems: "center",
    gap: 8,
  } as React.CSSProperties,
  copilotButton: {
    backgroundImage: "linear-gradient(78deg, #8054f2 7%, #3895da 95%)",
    borderRadius: 12,
    height: 24,
    width: 93,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#fff",
    cursor: "pointer",
    fontSize: 12,
    fontWeight: 600,
    transition: "all 0.3s",
    border: "none",
  } as React.CSSProperties,
  workareaBody: {
    flex: 1,
    padding: 16,
    background: "#fff",
    borderRadius: 8,
    margin: 16,
    overflow: "auto",
    minHeight: 0,
  } as React.CSSProperties,

  // Right copilot panel
  copilotChat: {
    display: "flex",
    flexDirection: "column",
    background: "#fff",
    color: "#1f2937",
    borderLeft: "1px solid #e5e7eb",
    transition: "width 0.3s",
    overflow: "hidden",
  } as React.CSSProperties,
  chatHeader: {
    height: 52,
    boxSizing: "border-box",
    borderBottom: "1px solid #e5e7eb",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "0 10px 0 16px",
    flexShrink: 0,
  } as React.CSSProperties,
  chatHeaderTitle: {
    fontWeight: 600,
    fontSize: 15,
  } as React.CSSProperties,
  headerBtn: {
    background: "none",
    border: "none",
    cursor: "pointer",
    fontSize: 18,
    color: "#6b7280",
    padding: "4px 8px",
    borderRadius: 6,
    lineHeight: 1,
  } as React.CSSProperties,

  // Chat list
  chatList: {
    flex: 1,
    overflowY: "auto",
    padding: "16px 16px 0",
    display: "flex",
    flexDirection: "column",
  } as React.CSSProperties,
  chatWelcome: {
    margin: "0 16px",
    padding: "12px 16px",
    borderRadius: 12,
    background: "#f3f4f6",
    marginBottom: 16,
  } as React.CSSProperties,

  // Sender area
  chatSend: {
    padding: 16,
    flexShrink: 0,
  } as React.CSSProperties,
  quickButtons: {
    display: "flex",
    gap: 8,
    marginBottom: 12,
    flexWrap: "wrap",
  } as React.CSSProperties,

  // Message styles
  loadingMessage: {
    backgroundImage:
      "linear-gradient(90deg, #ff6b23 0%, #af3cb8 31%, #53b6ff 89%)",
    backgroundSize: "100% 2px",
    backgroundRepeat: "no-repeat",
    backgroundPosition: "bottom",
  } as React.CSSProperties,
  assistantContent: {
    padding: "12px 16px",
    borderRadius: 12,
    backgroundColor: "#f3f4f6",
  } as React.CSSProperties,
  assistantFooter: {
    display: "flex",
    marginTop: 4,
    gap: 2,
  } as React.CSSProperties,

  // Conversations popover
  popover: {
    position: "absolute",
    top: 52,
    right: 0,
    width: 300,
    maxHeight: 500,
    overflowY: "auto",
    background: "#fff",
    border: "1px solid #e5e7eb",
    borderRadius: 8,
    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
    zIndex: 100,
    padding: "8px 0",
  } as React.CSSProperties,
};

// ─── App ─────────────────────────────────────────────────────────
export function App() {
  // ── State ──
  const [copilotOpen, setCopilotOpen] = useState(true);
  const [conversations, setConversations] = useState<Conversation[]>(
    DEFAULT_CONVERSATIONS,
  );
  const [activeKey, setActiveKey] = useState("c1");
  const [inputValue, setInputValue] = useState("");
  const [showSuggestion, setShowSuggestion] = useState(false);
  const [showConvPopover, setShowConvPopover] = useState(false);
  const [isRequesting, setIsRequesting] = useState(false);

  // Refs
  const notifRef = useRef<HTMLElement>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const streamingIntervals = useRef<number[]>([]);

  // Current conversation
  const activeConv = conversations.find((c) => c.key === activeKey);
  const messages = activeConv?.messages ?? [];

  // Auto-scroll
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // ── Conversation management ──
  const addConversation = useCallback(() => {
    if (messages.length === 0) return; // Don't add empty conversation
    const key = `c${Date.now()}`;
    setConversations((prev) => [
      { key, label: "新的对话", messages: [] },
      ...prev,
    ]);
    setActiveKey(key);
    setShowConvPopover(false);
  }, [messages.length]);

  const switchConversation = useCallback(
    (e: Event) => {
      const detail = (e as CustomEvent).detail;
      const key = detail?.key as string;
      if (key && key !== activeKey) {
        setActiveKey(key);
        setShowConvPopover(false);
      }
    },
    [activeKey],
  );

  const updateMessages = useCallback(
    (key: string, updater: (msgs: ChatMessage[]) => ChatMessage[]) => {
      setConversations((prev) =>
        prev.map((c) =>
          c.key === key ? { ...c, messages: updater(c.messages) } : c,
        ),
      );
    },
    [],
  );

  // ── Send message ──
  const handleSubmit = useCallback(
    (text: string) => {
      if (!text.trim() || isRequesting) return;

      const userMsg: ChatMessage = {
        id: genId(),
        role: "user",
        content: text,
        status: "done",
      };
      const assistantMsg: ChatMessage = {
        id: genId(),
        role: "assistant",
        content: "",
        thinking: "",
        status: "loading",
      };

      updateMessages(activeKey, (msgs) => [...msgs, userMsg, assistantMsg]);
      setIsRequesting(true);
      setInputValue("");
      setShowSuggestion(false);

      // Rename conversation if it's "新的对话"
      setConversations((prev) =>
        prev.map((c) =>
          c.key === activeKey && c.label === "新的对话"
            ? { ...c, label: text.slice(0, 20) }
            : c,
        ),
      );

      // Simulate streaming: separate thinking and content phases
      const thinkText = MOCK_THINKING;
      const respText = MOCK_RESPONSE;
      let thinkIdx = 0;
      let respIdx = 0;
      const aId = assistantMsg.id;

      // Store interval IDs so cancel can clear them
      const thinkInterval = setInterval(() => {
        thinkIdx += 2;
        if (thinkIdx >= thinkText.length) {
          thinkIdx = thinkText.length;
          clearInterval(thinkInterval);

          // Phase 2: Response
          const respInterval = setInterval(() => {
            respIdx += 3;
            if (respIdx >= respText.length) {
              respIdx = respText.length;
              clearInterval(respInterval);
              updateMessages(activeKey, (msgs) =>
                msgs.map((m) =>
                  m.id === aId
                    ? { ...m, content: respText, status: "done" }
                    : m,
                ),
              );
              setIsRequesting(false);
            } else {
              updateMessages(activeKey, (msgs) =>
                msgs.map((m) =>
                  m.id === aId
                    ? {
                        ...m,
                        content: respText.slice(0, respIdx),
                        status: "streaming",
                      }
                    : m,
                ),
              );
            }
          }, 15);
          streamingIntervals.current.push(respInterval);
        }
        updateMessages(activeKey, (msgs) =>
          msgs.map((m) =>
            m.id === aId ? { ...m, thinking: thinkText.slice(0, thinkIdx) } : m,
          ),
        );
      }, 15);
      streamingIntervals.current.push(thinkInterval);
    },
    [activeKey, isRequesting, updateMessages],
  );

  // ── Event handlers ──
  const handleSenderSubmit = useCallback(
    (e: Event) => {
      const detail = (e as CustomEvent).detail;
      const value = detail?.value as string;
      if (value) handleSubmit(value);
    },
    [handleSubmit],
  );

  const handleSenderChange = useCallback((e: Event) => {
    const detail = (e as CustomEvent).detail;
    const value = (detail?.value as string) ?? "";
    setInputValue(value);
    setShowSuggestion(value.startsWith("/"));
  }, []);

  const handleCancel = useCallback(() => {
    // Actually abort all streaming intervals
    streamingIntervals.current.forEach((id) => clearInterval(id));
    streamingIntervals.current = [];
    setIsRequesting(false);
  }, []);

  const handleSuggestionSelect = useCallback(
    (e: Event) => {
      const detail = (e as CustomEvent).detail;
      const value = detail?.value as string;
      if (value === "/clear") {
        updateMessages(activeKey, () => []);
        notify(notifRef, { title: "对话已清空", type: "info" });
      } else if (value === "/help") {
        handleSubmit("如何使用 AgentKit UI？");
      } else {
        setInputValue(value);
      }
      setShowSuggestion(false);
    },
    [activeKey, handleSubmit, updateMessages],
  );

  const handlePromptClick = useCallback(
    (e: Event) => {
      const detail = (e as CustomEvent).detail;
      const item = detail?.item as PromptsItem;
      if (item) handleSubmit(item.label);
    },
    [handleSubmit],
  );

  // ── Actions on assistant messages ──
  const [liked, setLiked] = useState(false);

  const makeActionItems = (msgId: string): ActionsItem[] => [
    { key: "reload", label: "", icon: "refresh-cw" },
    { key: "copy", label: "", icon: "copy" },
    {
      key: "like",
      label: "",
      icon: liked ? "heart" : "heart",
      active: liked,
    },
    { key: "dislike", label: "", icon: "thumbs-down" },
  ];

  const handleActionClick = useCallback((e: Event) => {
    const detail = (e as CustomEvent).detail;
    const key = detail?.key as string;
    if (key === "copy") {
      notify(notifRef, { title: "已复制到剪贴板", type: "success" });
    } else if (key === "like") {
      setLiked((v) => !v);
    } else if (key === "reload") {
      notify(notifRef, { title: "重新生成中...", type: "info" });
    }
  }, []);

  // ── Conversation items ──
  const convItems: ConversationItem[] = conversations.map((c) => ({
    key: c.key,
    label: c.key === activeKey ? `[当前] ${c.label}` : c.label,
    icon: "message-circle",
  }));

  // ═══════════════════════════════════════════════════════════════
  // Render
  // ═══════════════════════════════════════════════════════════════
  return (
    <div style={styles.wrapper}>
      {/* ═══ Left Workarea ═══ */}
      <div style={styles.workarea}>
        {/* Workarea Header */}
        <div style={styles.workareaHeader}>
          <div style={styles.headerTitle}>
            <img
              src="https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*eco6RrQhxbMAAAAAAAAAAAAADgCCAQ/original"
              draggable={false}
              alt="logo"
              width={20}
              height={20}
            />
            AgentKit UI
          </div>
          {!copilotOpen && (
            <button
              style={styles.copilotButton}
              onClick={() => setCopilotOpen(true)}
              onMouseEnter={(e) => {
                (e.target as HTMLElement).style.opacity = "0.8";
              }}
              onMouseLeave={(e) => {
                (e.target as HTMLElement).style.opacity = "1";
              }}
            >
              ✨ AI Copilot
            </button>
          )}
        </div>

        {/* Workarea Body */}
        <div style={styles.workareaBody}>
          <div style={{ padding: 8, color: "#374151", lineHeight: 1.7 }}>
            <h4 style={{ marginBottom: 8 }}>什么是 RICH 设计范式？</h4>
            <p style={{ marginBottom: 12 }}>
              RICH 是一种 AI 界面设计范式，类似于 WIMP 范式之于图形用户界面。
              ACM SIGCHI 2005 定义了人机交互的核心问题可分为三个层次：
            </p>
            <ul style={{ paddingLeft: 20, marginBottom: 12 }}>
              <li>
                <strong>界面范式层</strong>
                ：定义人机交互界面的设计要素，引导设计师关注核心问题。
              </li>
              <li>
                <strong>用户模型层</strong>
                ：构建界面体验评价模型，衡量界面体验质量。
              </li>
              <li>
                <strong>软件框架层</strong>
                ：人机界面的底层支撑算法和数据结构。
              </li>
            </ul>
            <p>
              界面范式是新生交互技术诞生时，设计师最需要关注和定义的方面。
              它定义了设计师应该关注的设计要素，并据此判断什么是好的设计以及如何实现。
            </p>
          </div>
        </div>
      </div>

      {/* ═══ Right Copilot Panel ═══ */}
      <div style={{ ...styles.copilotChat, width: copilotOpen ? 400 : 0 }}>
        {/* Chat Header */}
        <div style={styles.chatHeader}>
          <span style={styles.chatHeaderTitle}>✨ AI Copilot</span>
          <div style={{ display: "flex", gap: 2 }}>
            {/* New conversation */}
            <button
              style={styles.headerBtn}
              onClick={addConversation}
              title="新对话"
            >
              ＋
            </button>
            {/* Conversation list popover */}
            <div style={{ position: "relative" }}>
              <button
                style={styles.headerBtn}
                onClick={() => setShowConvPopover((v) => !v)}
                title="对话列表"
              >
                💬
              </button>
              {showConvPopover && (
                <div style={styles.popover}>
                  <Conversations
                    items={convItems}
                    activeKey={activeKey}
                    onConversationClick={switchConversation}
                  />
                </div>
              )}
            </div>
            {/* Close copilot */}
            <button
              style={styles.headerBtn}
              onClick={() => setCopilotOpen(false)}
              title="关闭"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Chat List */}
        <div style={styles.chatList}>
          {messages.length === 0 ? (
            <>
              {/* Welcome */}
              <div style={styles.chatWelcome}>
                <Welcome
                  title="👋 你好，我是 AgentKit AI"
                  description="基于 Lit + Tailwind CSS v4 构建的 AI 组件库。有什么我可以帮你的吗？"
                  variant="borderless"
                />
              </div>
              {/* Prompts */}
              <Prompts
                title="我可以帮你："
                items={PROMPT_ITEMS}
                vertical
                onItemClick={handlePromptClick}
              />
            </>
          ) : (
            messages.map((msg) => {
              if (msg.role === "user") {
                // ── User bubble ──
                return (
                  <div key={msg.id} style={{ marginBottom: 12 }}>
                    <Bubble placement="end" content={msg.content} />
                  </div>
                );
              }

              // ── Assistant bubble ──
              return (
                <div key={msg.id} style={{ marginBottom: 16 }}>
                  {/* Thinking block — separate Think component */}
                  {msg.thinking && (
                    <div style={{ marginBottom: 8 }}>
                      <Think
                        title={
                          msg.status === "done" ? "思考完成" : "深度思考中..."
                        }
                        defaultExpanded
                        loading={
                          msg.status === "loading" || msg.status === "streaming"
                        }
                        content={msg.thinking}
                      />
                    </div>
                  )}

                  {/* Content with Markdown */}
                  {msg.content ? (
                    <div
                      style={{
                        ...styles.assistantContent,
                        ...(msg.status === "streaming"
                          ? styles.loadingMessage
                          : {}),
                      }}
                    >
                      <Markdown
                        content={msg.content}
                        streamStatus={
                          msg.status === "streaming" ? "loading" : "done"
                        }
                      />
                    </div>
                  ) : msg.status === "loading" ? (
                    <Bubble placement="start" loading />
                  ) : null}

                  {/* Actions footer on completed messages */}
                  {msg.status === "done" && msg.content && (
                    <div style={styles.assistantFooter}>
                      <Actions
                        items={makeActionItems(msg.id)}
                        onActionClick={handleActionClick}
                      />
                    </div>
                  )}
                </div>
              );
            })
          )}
          <div ref={chatEndRef} />
        </div>

        {/* Sender Area — antd-x: Sender always visible, handles loading/stop internally */}
        <div style={styles.chatSend}>
          {/* Quick action buttons */}
          <div style={styles.quickButtons}>
            <Button
              variant="outline"
              onClick={() => handleSubmit("有什么新功能？")}
            >
              📋 更新日志
            </Button>
            <Button
              variant="outline"
              onClick={() => handleSubmit("有哪些组件？")}
            >
              📦 组件列表
            </Button>
            <Button
              variant="outline"
              onClick={() => handleSubmit("如何安装？")}
            >
              📥 安装指南
            </Button>
          </div>

          {/* Suggestion + Sender */}
          <div style={{ position: "relative" }}>
            {showSuggestion && (
              <div
                style={{
                  position: "absolute",
                  bottom: "100%",
                  left: 0,
                  right: 0,
                  zIndex: 10,
                  marginBottom: 4,
                }}
              >
                <Suggestion
                  items={SUGGESTIONS}
                  open={showSuggestion}
                  filterValue={inputValue}
                  onSelect={handleSuggestionSelect}
                />
              </div>
            )}
            <Sender
              placeholder="输入问题或使用 / 技能..."
              loading={isRequesting}
              onSubmit={handleSenderSubmit}
              onChange={handleSenderChange}
              onCancel={handleCancel}
            />
          </div>
        </div>
      </div>

      {/* Global Notification */}
      {/* @ts-expect-error web component ref */}
      <Notification ref={notifRef} placement="top-right" />
    </div>
  );
}
