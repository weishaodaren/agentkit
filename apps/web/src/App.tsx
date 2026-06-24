import { useState, useRef, useCallback, useEffect } from "react";
import {
  Welcome,
  Think,
  Prompts,
  Bubble,
  Sender,
  SenderHeader,
  Actions,
  Conversations,
  Suggestion,
  Button,
  Notification,
  Attachments,
} from "@agentkit/ui/adaptor/react";
import { Markdown } from "@agentkit/ui/adaptor/react-plugins";
import type {
  PromptsItem,
  ActionsItem,
  ConversationItem,
  SuggestionItem,
  NotificationOptions,
  AttachmentFile,
} from "@agentkit/ui";
import { sendChatMessage } from "~/lib/chat";

// ─── Types ───────────────────────────────────────────────────────
interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  thinking?: string;
  status: "loading" | "streaming" | "done" | "error";
}

// ─── Static Data ─────────────────────────────────────────────────
const DEFAULT_CONVERSATIONS: ConversationItem[] = [
  { key: "5", label: "新的对话", group: "今天" },
  { key: "4", label: "AgentKit UI 有哪些升级？", group: "今天" },
  { key: "3", label: "新的 AGI 混合界面范式", group: "今天" },
  { key: "2", label: "如何快速安装和导入组件？", group: "昨天" },
  { key: "1", label: "什么是 AgentKit UI？", group: "昨天" },
];

const MOCK_SUGGESTIONS: SuggestionItem[] = [
  { key: "report", label: "写一份报告", value: "report" },
  { key: "draw", label: "画一幅画", value: "draw" },
  {
    key: "knowledge",
    label: "查阅一些知识",
    value: "knowledge",
    children: [
      { key: "react", label: "关于 React", value: "react" },
      { key: "antd", label: "关于 Ant Design", value: "antd" },
    ],
  },
];

const PROMPT_QUESTIONS = [
  "AgentKit UI 有哪些升级？",
  "AgentKit UI 有哪些组件？",
  "如何快速安装和导入组件？",
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

// History messages keyed by conversation
const HISTORY_MESSAGES: Record<string, { user: string; assistant: string }> = {
  "5": {
    user: "你好，开始新的对话",
    assistant: "你好！我是 AgentKit AI，很高兴为你服务。有什么我可以帮你的吗？",
  },
  "4": {
    user: "AgentKit UI 有哪些升级？",
    assistant:
      "AgentKit UI 近期升级了以下方面：\n\n1. **CSS-in-JS 样式系统** — 全面采用 CSS Custom Properties\n2. **Lucide 图标** — 统一使用 lucide-static 图标库\n3. **Locale 国际化** — 支持中英文语言包\n4. **Sender.Header** — 新增可折叠面板子组件",
  },
  "3": {
    user: "什么是 AGI 混合界面范式？",
    assistant:
      "AGI 混合界面是一种融合了传统 GUI 和 AI 对话界面的新型交互范式，结合了结构化操作和自然语言交互的优势。",
  },
  "2": {
    user: "如何快速安装和导入组件？",
    assistant:
      "通过 npm 或 pnpm 安装：\n\n```bash\npnpm add @agentkit/ui\n```\n\n然后在 React 中导入：\n\n```tsx\nimport { Bubble, Sender } from '@agentkit/ui/adaptor/react';\nimport { Markdown } from '@agentkit/ui/adaptor/react-plugins';\n```",
  },
  "1": {
    user: "什么是 AgentKit UI？",
    assistant: MOCK_RESPONSE,
  },
};

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

function getHistoryMessages(key: string): ChatMessage[] {
  const h = HISTORY_MESSAGES[key];
  if (!h) return [];
  return [
    { id: `${key}-u`, role: "user", content: h.user, status: "done" },
    {
      id: `${key}-a`,
      role: "assistant",
      content: h.assistant,
      status: "done",
    },
  ];
}

/** Convert the current messages state to the API message format. */
function getHistoryForApi(messages: ChatMessage[]): Array<{ role: string; content: string }> {
  return messages
    .filter((m) => m.role === "user" || m.content)
    .map((m) => ({ role: m.role, content: m.content }));
}

// ─── CSS-in-JS Styles ──────────────────────────────────────────
const styles = {
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
    background: "#fff",
    borderRadius: 8,
    minHeight: 0,
    overflow: "auto",
  } as React.CSSProperties,
  bodyContent: {
    overflow: "auto",
    height: "100%",
    padding: "16px 10px 16px 16px",
  } as React.CSSProperties,
  bodyText: {
    color: "#374151",
    padding: 8,
    lineHeight: 1.7,
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
  quickBtnRow: {
    display: "flex",
    gap: 12,
    alignItems: "center",
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
    maxHeight: 600,
    overflowY: "auto",
    background: "#fff",
    border: "1px solid #e5e7eb",
    borderRadius: 8,
    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
    zIndex: 100,
    padding: 0,
  } as React.CSSProperties,
};

// ─── App ─────────────────────────────────────────────────────────
export function App() {
  // ── State ──
  const [copilotOpen, setCopilotOpen] = useState(true);
  const [conversations, setConversations] = useState<ConversationItem[]>(
    DEFAULT_CONVERSATIONS,
  );
  const [activeKey, setActiveKey] = useState("5");
  const [messages, setMessages] = useState<ChatMessage[]>(
    getHistoryMessages("5"),
  );
  const [inputValue, setInputValue] = useState("");
  const [showSuggestion, setShowSuggestion] = useState(false);
  const [showConvPopover, setShowConvPopover] = useState(false);
  const [isRequesting, setIsRequesting] = useState(false);
  const [attachmentsOpen, setAttachmentsOpen] = useState(false);
  const [files, setFiles] = useState<AttachmentFile[]>([]);
  const [liked, setLiked] = useState(false);

  // Refs
  const notifRef = useRef<HTMLElement>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const streamingIntervals = useRef<number[]>([]);
  const messagesRef = useRef<ChatMessage[]>(messages);
  messagesRef.current = messages;

  // Auto-scroll
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // ── Conversation management ──
  const switchConversation = useCallback(
    (e: Event) => {
      const detail = (e as CustomEvent).detail;
      const key = detail?.key as string;
      if (key && key !== activeKey) {
        setActiveKey(key);
        setMessages(getHistoryMessages(key));
        setShowConvPopover(false);
      }
    },
    [activeKey],
  );

  const addConversation = useCallback(() => {
    if (messages.length === 0) {
      notify(notifRef, { title: "已经是新对话了", type: "info" });
      return;
    }
    const key = `c${Date.now()}`;
    setConversations((prev) => [
      { key, label: "新的对话", group: "今天" },
      ...prev,
    ]);
    setActiveKey(key);
    setMessages([]);
    setShowConvPopover(false);
  }, [messages.length]);

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

      setMessages((prev) => [...prev, userMsg, assistantMsg]);
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

      // Build the message history from state (userMsg was just added)
      const aId = assistantMsg.id;

      // Start streaming: simulate thinking → response phases
      const thinkText = MOCK_THINKING;
      let thinkIdx = 0;
      let respText = "";
      let respIdx = 0;
      let streamDone = false;

      const thinkInterval = setInterval(() => {
        thinkIdx += 2;
        if (thinkIdx >= thinkText.length) {
          thinkIdx = thinkText.length;
          clearInterval(thinkInterval);

          // Now stream the actual API response
          const respInterval = setInterval(() => {
            if (streamDone) {
              clearInterval(respInterval);
              setMessages((prev) =>
                prev.map((m) =>
                  m.id === aId
                    ? { ...m, status: "done" }
                    : m,
                ),
              );
              setIsRequesting(false);
              return;
            }

            respIdx += 3;
            if (respIdx >= respText.length) {
              streamDone = true;
            } else {
              setMessages((prev) =>
                prev.map((m) =>
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
        setMessages((prev) =>
          prev.map((m) =>
            m.id === aId ? { ...m, thinking: thinkText.slice(0, thinkIdx) } : m,
          ),
        );
      }, 15);
      streamingIntervals.current.push(thinkInterval);

      // Fetch response from backend agent
      const fetchResponse = async () => {
        try {
          const allHistory = getHistoryForApi(messagesRef.current);
          const response = await sendChatMessage({ messages: allHistory });
          respText = response.messages[response.messages.length - 1]?.content ?? "(空回复)";
        } catch (err) {
          // eslint-disable-next-line no-console
          console.error("Chat API error:", err);
          respText = "抱歉，后端服务暂时不可用。";
          streamDone = true;
        }
      };
      fetchResponse();
    },
    [activeKey, isRequesting],
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
    streamingIntervals.current.forEach((id) => clearInterval(id));
    streamingIntervals.current = [];
    setIsRequesting(false);
  }, []);

  const handleSuggestionSelect = useCallback(
    (e: Event) => {
      const detail = (e as CustomEvent).detail;
      const value = detail?.value as string;
      if (value === "report") {
        handleSubmit("帮我写一份项目报告");
      } else if (value === "draw") {
        handleSubmit("画一幅关于 AI 的插画");
      } else {
        setInputValue(`[${value}]: `);
      }
      setShowSuggestion(false);
    },
    [handleSubmit],
  );

  const handlePromptClick = useCallback(
    (e: Event) => {
      const detail = (e as CustomEvent).detail;
      const item = detail?.item as PromptsItem;
      if (item) handleSubmit(item.description || item.label);
    },
    [handleSubmit],
  );

  const handleUpload = useCallback((e: Event) => {
    const detail = (e as CustomEvent).detail;
    const uploaded = detail?.files as AttachmentFile[];
    if (uploaded) setFiles((prev) => [...prev, ...uploaded]);
  }, []);

  const handleRemoveFile = useCallback((e: Event) => {
    const detail = (e as CustomEvent).detail;
    const idx = detail?.index as number;
    if (typeof idx === "number")
      setFiles((prev) => prev.filter((_, i) => i !== idx));
  }, []);

  // ── Actions on assistant messages ──
  const makeActionItems = (): ActionsItem[] => [
    { key: "reload", label: "", icon: "refresh-cw" },
    { key: "copy", label: "", icon: "copy" },
    { key: "like", label: "", icon: "heart", active: liked },
    { key: "dislike", label: "", icon: "thumbs-down" },
  ];

  const handleActionClick = useCallback((e: Event) => {
    const detail = (e as CustomEvent).detail;
    const key = detail?.key as string;
    if (key === "copy")
      notify(notifRef, { title: "已复制到剪贴板", type: "success" });
    else if (key === "like") setLiked((v) => !v);
    else if (key === "reload")
      notify(notifRef, { title: "重新生成中...", type: "info" });
  }, []);

  // ── Conversation items for popover ──
  const convItems: ConversationItem[] = conversations.map((c) =>
    c.key === activeKey ? { ...c, label: `[当前] ${c.label}` } : c,
  );

  // ═══════════════════════════════════════════════════════════════
  // Render
  // ═══════════════════════════════════════════════════════════════
  return (
    <div style={styles.wrapper}>
      {/* ═══ Left Workarea ═══ */}
      <div style={styles.workarea}>
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

        <div
          style={{
            ...styles.workareaBody,
            margin: copilotOpen ? 16 : "16px 48px",
          }}
        >
          <div style={styles.bodyContent}>
            <img
              src="https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*48RLR41kwHIAAAAAAAAAAAAADgCCAQ/fmt.webp"
              alt="banner"
              style={{ width: "100%", borderRadius: 8 }}
            />
            <div style={styles.bodyText}>
              <h4 style={{ marginBottom: 8 }}>什么是 RICH 设计范式？</h4>
              <p style={{ marginBottom: 12 }}>
                RICH 是一种 AI 界面设计范式，类似于 WIMP 范式之于图形用户界面。
              </p>
              <p style={{ marginBottom: 12 }}>
                ACM SIGCHI 2005
                （人机交互顶级会议）定义了人机交互的核心问题可分为三个层次：
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
      </div>

      {/* ═══ Right Copilot Panel ═══ */}
      <div style={{ ...styles.copilotChat, width: copilotOpen ? 400 : 0 }}>
        {/* Chat Header */}
        <div style={styles.chatHeader}>
          <span style={styles.chatHeaderTitle}>✨ AI Copilot</span>
          <div style={{ display: "flex", gap: 2 }}>
            <button
              style={styles.headerBtn}
              onClick={addConversation}
              title="新对话"
            >
              ＋
            </button>
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
                    groupable
                    onConversationClick={switchConversation}
                  />
                </div>
              )}
            </div>
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
              <div style={styles.chatWelcome}>
                <Welcome
                  title="👋 你好，我是 AgentKit AI"
                  description="基于 Lit + Tailwind CSS v4 构建的 AI 组件库。有什么我可以帮你的吗？"
                  variant="borderless"
                />
              </div>
              <Prompts
                title="我可以帮你："
                items={PROMPT_QUESTIONS.map((q) => ({
                  key: q,
                  label: q,
                  description: q,
                }))}
                vertical
                onItemClick={handlePromptClick}
              />
            </>
          ) : (
            messages.map((msg) => {
              if (msg.role === "user") {
                return (
                  <div key={msg.id} style={{ marginBottom: 12 }}>
                    <Bubble placement="end" content={msg.content} />
                  </div>
                );
              }

              return (
                <div key={msg.id} style={{ marginBottom: 16 }}>
                  {/* Thinking block */}
                  {msg.thinking && (
                    <div style={{ marginBottom: 8 }}>
                      <Think
                        blink
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

                  {/* Actions footer */}
                  {msg.status === "done" && msg.content && (
                    <div style={styles.assistantFooter}>
                      <Actions
                        items={makeActionItems()}
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

        {/* Sender Area */}
        <div style={styles.chatSend}>
          {/* Quick action buttons */}
          <div style={{ ...styles.quickBtnRow, marginBottom: 12 }}>
            <Button
              variant="outline"
              onClick={() => handleSubmit("AgentKit UI 有哪些升级？")}
            >
              📋 升级内容
            </Button>
            <Button
              variant="outline"
              onClick={() => handleSubmit("AgentKit UI 有哪些组件？")}
            >
              📦 组件列表
            </Button>
            <Button variant="outline">⊞ 更多</Button>
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
                  items={MOCK_SUGGESTIONS}
                  open={showSuggestion}
                  filterValue={inputValue}
                  onSelect={handleSuggestionSelect}
                />
              </div>
            )}
            <Sender
              placeholder="输入问题或使用 / 技能..."
              loading={isRequesting}
              value={inputValue}
              onSubmit={handleSenderSubmit}
              onChange={handleSenderChange}
              onCancel={handleCancel}
            >
              {/* Header: Attachments panel */}
              <SenderHeader
                slot="header"
                title="上传文件"
                open={attachmentsOpen}
                onOpenChange={(e: Event) => {
                  const detail = (e as CustomEvent).detail;
                  setAttachmentsOpen(detail?.open ?? false);
                }}
              >
                <Attachments
                  files={files}
                  placeholder="拖拽文件到此处，或点击上传"
                  onUpload={handleUpload}
                  onRemove={handleRemoveFile}
                />
              </SenderHeader>

              {/* Prefix: paperclip toggle */}
              <button
                slot="prefix"
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  fontSize: 18,
                  color: "#6b7280",
                  padding: "2px 4px",
                }}
                onClick={() => setAttachmentsOpen((v) => !v)}
                title="附件"
              >
                📎
              </button>
            </Sender>
          </div>
        </div>
      </div>

      {/* Global Notification */}
      {/* @ts-expect-error web component ref */}
      <Notification ref={notifRef} placement="top-right" />
    </div>
  );
}
