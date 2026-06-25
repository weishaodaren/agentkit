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
  ThoughtChain,
} from "@agentkit/ui/adaptor/react";
import { Markdown } from "@agentkit/ui/adaptor/react-plugins";
import type {
  PromptsItem,
  ActionsItem,
  ConversationItem,
  SuggestionItem,
  NotificationOptions,
  AttachmentFile,
  ThoughtChainItem,
} from "@agentkit/ui";
import {
  streamAgentMessage,
  listAgents,
  listWorkflows,
  runWorkflow,
  type ToolCallEvent,
  type ToolResultEvent,
  type StepFinishEvent,
} from "~/lib/chat";

// ─── Types ───────────────────────────────────────────────────────

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  thinking?: string;
  toolCalls: ToolCallEvent[];
  toolResults: ToolResultEvent[];
  usage?: StepFinishEvent["usage"];
  status: "loading" | "streaming" | "done" | "error";
}

// ─── Static Data ─────────────────────────────────────────────────

const DEFAULT_CONVERSATIONS: ConversationItem[] = [
  { key: "5", label: "新的对话", group: "今天" },
  { key: "4", label: "查询北京天气", group: "今天" },
  { key: "3", label: "如何快速安装组件？", group: "昨天" },
];

const MOCK_SUGGESTIONS: SuggestionItem[] = [
  { key: "weather", label: "查天气", value: "weather" },
  { key: "report", label: "写一份报告", value: "report" },
  {
    key: "knowledge",
    label: "查阅知识",
    value: "knowledge",
    children: [
      { key: "react", label: "关于 React", value: "react" },
      { key: "antd", label: "关于 Ant Design", value: "antd" },
    ],
  },
];

const PROMPT_QUESTIONS = [
  "北京今天天气怎么样？",
  "帮我规划一下周末活动",
  "AgentKit UI 有哪些组件？",
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

/** Build ThoughtChainItems from a ChatMessage */
function buildThoughtChain(msg: ChatMessage): ThoughtChainItem[] {
  const items: ThoughtChainItem[] = [];
  let idx = 0;

  // Reasoning step
  if (msg.thinking) {
    items.push({
      key: `reason-${idx++}`,
      title: "深度推理",
      description: msg.thinking,
      status:
        msg.status === "loading" || msg.status === "streaming"
          ? "running"
          : "success",
      collapsible: true,
      content: "",
    });
  }

  // Tool calls
  for (const tc of msg.toolCalls) {
    const result = msg.toolResults.find((r) => r.toolCallId === tc.toolCallId);
    items.push({
      key: `tool-${idx++}`,
      title: `调用工具: ${tc.toolName}`,
      description:
        tc.args !== null && tc.args !== undefined
          ? `参数: ${JSON.stringify(tc.args, null, 0)}`
          : undefined,
      status: result
        ? result.isError
          ? "error"
          : "success"
        : msg.status === "done"
          ? "success"
          : "running",
      collapsible: !!result,
      content: result ? `结果: ${JSON.stringify(result.result, null, 2)}` : "",
    });
  }

  // Response generation step
  if (msg.content || msg.status === "streaming") {
    items.push({
      key: `gen-${idx++}`,
      title: "生成回复",
      status:
        msg.status === "streaming"
          ? "running"
          : msg.status === "done"
            ? "success"
            : "pending",
    });
  }

  // Finish
  if (msg.status === "done") {
    const usageText = msg.usage
      ? `Tokens: ${msg.usage.promptTokens ?? "?"} in / ${msg.usage.completionTokens ?? "?"} out`
      : undefined;
    items.push({
      key: `finish-${idx++}`,
      title: "完成",
      status: "success",
      description: usageText,
    });
  }

  return items;
}

// ─── Styles ──────────────────────────────────────────────────────

const styles = {
  wrapper: {
    width: "100%",
    height: "100vh",
    display: "flex",
    fontFamily: "system-ui, sans-serif",
  } as React.CSSProperties,
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
  chatSend: { padding: 16, flexShrink: 0 } as React.CSSProperties,
  quickBtnRow: {
    display: "flex",
    gap: 12,
    alignItems: "center",
  } as React.CSSProperties,
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
  agentSelector: {
    fontSize: 12,
    padding: "2px 6px",
    borderRadius: 6,
    border: "1px solid #e5e7eb",
    background: "#f9fafb",
    color: "#374151",
    cursor: "pointer",
    outline: "none",
    maxWidth: 160,
  } as React.CSSProperties,
  thoughtChainWrap: {
    marginBottom: 8,
    padding: "8px 12px",
    borderRadius: 12,
    backgroundColor: "#fafafa",
    border: "1px solid #f0f0f0",
  } as React.CSSProperties,
  workflowBar: {
    display: "flex",
    gap: 8,
    alignItems: "center",
    padding: "8px 16px",
    borderTop: "1px solid #e5e7eb",
    background: "#f9fafb",
    flexShrink: 0,
  } as React.CSSProperties,
  workflowInput: {
    flex: 1,
    fontSize: 13,
    padding: "4px 8px",
    borderRadius: 6,
    border: "1px solid #d1d5db",
    outline: "none",
  } as React.CSSProperties,
  workflowBtn: {
    fontSize: 12,
    padding: "4px 12px",
    borderRadius: 6,
    border: "1px solid #d1d5db",
    background: "#fff",
    cursor: "pointer",
    color: "#374151",
    whiteSpace: "nowrap",
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
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [showSuggestion, setShowSuggestion] = useState(false);
  const [showConvPopover, setShowConvPopover] = useState(false);
  const [isRequesting, setIsRequesting] = useState(false);
  const [attachmentsOpen, setAttachmentsOpen] = useState(false);
  const [files, setFiles] = useState<AttachmentFile[]>([]);
  const [liked, setLiked] = useState(false);

  // Agent & Workflow discovery
  const [agentIds, setAgentIds] = useState<string[]>([]);
  const [selectedAgent, setSelectedAgent] = useState("weatherAgent");
  const [workflowIds, setWorkflowIds] = useState<string[]>([]);
  const [workflowCity, setWorkflowCity] = useState("Tokyo");
  const [workflowRunning, setWorkflowRunning] = useState(false);

  // Refs
  const notifRef = useRef<HTMLElement>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const abortRef = useRef<AbortController | null>(null);
  const messagesRef = useRef<ChatMessage[]>(messages);
  messagesRef.current = messages;

  // ── Discovery: load agents & workflows on mount ──
  useEffect(() => {
    listAgents()
      .then((agents) => {
        const ids = Object.keys(agents);
        setAgentIds(ids);
        if (ids.length > 0 && !ids.includes(selectedAgent)) {
          setSelectedAgent(ids[0]);
        }
      })
      .catch(() => {});
    listWorkflows()
      .then((wfs) => setWorkflowIds(Object.keys(wfs)))
      .catch(() => {});
  }, []);

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
        setMessages([]);
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
        toolCalls: [],
        toolResults: [],
        status: "done",
      };
      const aId = genId();
      const assistantMsg: ChatMessage = {
        id: aId,
        role: "assistant",
        content: "",
        thinking: "",
        toolCalls: [],
        toolResults: [],
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

      // Build API messages
      const apiMessages = [
        ...messagesRef.current
          .filter((m) => m.role === "user" || m.content)
          .map((m) => ({
            role: m.role as "user" | "assistant",
            content: m.content,
          })),
        { role: "user" as const, content: text },
      ];

      // Abort previous request
      abortRef.current?.abort();
      const controller = new AbortController();
      abortRef.current = controller;

      streamAgentMessage(
        selectedAgent,
        apiMessages,
        {
          onTextDelta(delta) {
            setMessages((prev) =>
              prev.map((m) =>
                m.id === aId
                  ? {
                      ...m,
                      content: m.content + delta,
                      status: m.status === "loading" ? "streaming" : m.status,
                    }
                  : m,
              ),
            );
          },
          onReasoningDelta(delta) {
            setMessages((prev) =>
              prev.map((m) =>
                m.id === aId
                  ? { ...m, thinking: (m.thinking || "") + delta }
                  : m,
              ),
            );
          },
          onToolCall(event) {
            setMessages((prev) =>
              prev.map((m) =>
                m.id === aId ? { ...m, toolCalls: [...m.toolCalls, event] } : m,
              ),
            );
          },
          onToolResult(event) {
            setMessages((prev) =>
              prev.map((m) =>
                m.id === aId
                  ? { ...m, toolResults: [...m.toolResults, event] }
                  : m,
              ),
            );
          },
          onStepFinish(event) {
            setMessages((prev) =>
              prev.map((m) =>
                m.id === aId ? { ...m, usage: event.usage } : m,
              ),
            );
          },
          onFinish() {
            setMessages((prev) =>
              prev.map((m) => (m.id === aId ? { ...m, status: "done" } : m)),
            );
            setIsRequesting(false);
            abortRef.current = null;
          },
          onError(err) {
            console.error("Agent stream error:", err);
            setMessages((prev) =>
              prev.map((m) =>
                m.id === aId
                  ? {
                      ...m,
                      content: m.content || "抱歉，服务暂时不可用。",
                      status: "error" as const,
                    }
                  : m,
              ),
            );
            setIsRequesting(false);
            abortRef.current = null;
          },
        },
        controller.signal,
      ).catch((err) => {
        // agent.stream() 在流开始前就抛异常（网络不可达、agent ID 无效等）
        console.error("Agent stream failed:", err);
        setMessages((prev) =>
          prev.map((m) =>
            m.id === aId && (m.status === "loading" || m.status === "streaming")
              ? {
                  ...m,
                  content: m.content || "抱歉，服务暂时不可用。",
                  status: "error" as const,
                }
              : m,
          ),
        );
        setIsRequesting(false);
        abortRef.current = null;
      });
    },
    [activeKey, isRequesting, selectedAgent],
  );

  // ── Workflow execution ──
  const handleRunWorkflow = useCallback(async () => {
    if (!workflowCity.trim() || workflowRunning) return;
    const wfId = workflowIds[0];
    if (!wfId) {
      notify(notifRef, { title: "没有可用的 workflow", type: "info" });
      return;
    }
    setWorkflowRunning(true);

    // Show a system-like message
    const userMsg: ChatMessage = {
      id: genId(),
      role: "user",
      content: `[Workflow] ${wfId} → city: ${workflowCity}`,
      toolCalls: [],
      toolResults: [],
      status: "done",
    };
    const aId = genId();
    const assistantMsg: ChatMessage = {
      id: aId,
      role: "assistant",
      content: "",
      toolCalls: [],
      toolResults: [],
      status: "loading",
    };
    setMessages((prev) => [...prev, userMsg, assistantMsg]);

    try {
      const result = await runWorkflow(wfId, { city: workflowCity });
      const output = JSON.stringify(result, null, 2);
      setMessages((prev) =>
        prev.map((m) =>
          m.id === aId
            ? {
                ...m,
                content: `Workflow 执行完成:\n\n\`\`\`json\n${output}\n\`\`\``,
                status: "done",
              }
            : m,
        ),
      );
    } catch (err) {
      console.error("Workflow error:", err);
      setMessages((prev) =>
        prev.map((m) =>
          m.id === aId
            ? { ...m, content: "Workflow 执行失败", status: "error" }
            : m,
        ),
      );
    } finally {
      setWorkflowRunning(false);
    }
  }, [workflowCity, workflowRunning, workflowIds]);

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
    abortRef.current?.abort();
    abortRef.current = null;
    setIsRequesting(false);
    // 将正在流式传输的消息标记为完成（保留已接收的部分内容）
    setMessages((prev) =>
      prev.map((m) =>
        m.status === "loading" || m.status === "streaming"
          ? { ...m, status: "done" as const }
          : m,
      ),
    );
  }, []);

  const handleSuggestionSelect = useCallback(
    (e: Event) => {
      const detail = (e as CustomEvent).detail;
      const value = detail?.value as string;
      if (value === "weather") {
        handleSubmit("北京今天天气怎么样？");
      } else if (value === "report") {
        handleSubmit("帮我写一份项目报告");
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
            AgentKit
          </div>
          {!copilotOpen && (
            <button
              style={styles.copilotButton}
              onClick={() => setCopilotOpen(true)}
              onMouseEnter={(e) =>
                ((e.target as HTMLElement).style.opacity = "0.8")
              }
              onMouseLeave={(e) =>
                ((e.target as HTMLElement).style.opacity = "1")
              }
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
            <div style={{ padding: 8, lineHeight: 1.7, color: "#374151" }}>
              <h4 style={{ marginBottom: 8 }}>AgentKit — AI Agent 平台</h4>
              <p style={{ marginBottom: 12 }}>
                基于 <strong>Mastra</strong> + <strong>Hono</strong> 构建的全栈
                AI Agent 平台。右侧面板可与 Agent
                实时对话，支持工具调用、深度推理、Workflow 编排。
              </p>
              <h5>已注册的 Agents</h5>
              <ul style={{ paddingLeft: 20, marginBottom: 12 }}>
                {agentIds.map((id) => (
                  <li key={id}>
                    <code>{id}</code>
                  </li>
                ))}
              </ul>
              <h5>已注册的 Workflows</h5>
              <ul style={{ paddingLeft: 20 }}>
                {workflowIds.map((id) => (
                  <li key={id}>
                    <code>{id}</code>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* ═══ Right Copilot Panel ═══ */}
      <div style={{ ...styles.copilotChat, width: copilotOpen ? 420 : 0 }}>
        {/* Chat Header */}
        <div style={styles.chatHeader}>
          <span style={styles.chatHeaderTitle}>✨ AI Copilot</span>
          <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
            {/* Agent selector */}
            <select
              style={styles.agentSelector}
              value={selectedAgent}
              onChange={(e) => setSelectedAgent(e.target.value)}
            >
              {agentIds.map((id) => (
                <option key={id} value={id}>
                  {id}
                </option>
              ))}
            </select>
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
                  description="支持工具调用、深度推理、Workflow 编排。试试问我天气或规划活动吧！"
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

              // Build thought chain
              const chain = buildThoughtChain(msg);

              return (
                <div key={msg.id} style={{ marginBottom: 16 }}>
                  {/* Thinking block — original Think component for reasoning */}
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

                  {/* ThoughtChain — tool calls + steps (only when there are tools or steps) */}
                  {(msg.toolCalls.length > 0 ||
                    msg.toolResults.length > 0 ||
                    (msg.status === "done" && chain.length > 0)) && (
                    <div style={styles.thoughtChainWrap}>
                      <ThoughtChain
                        items={chain.filter(
                          (item) =>
                            item.key.startsWith("tool-") ||
                            item.key.startsWith("gen-") ||
                            item.key.startsWith("finish-"),
                        )}
                        collapsible
                        lineStyle="dashed"
                        typingSpeed={15}
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

        {/* Workflow Bar */}
        {workflowIds.length > 0 && (
          <div style={styles.workflowBar}>
            <span
              style={{ fontSize: 12, color: "#6b7280", whiteSpace: "nowrap" }}
            >
              Workflow
            </span>
            <input
              style={styles.workflowInput}
              placeholder="输入城市名..."
              value={workflowCity}
              onChange={(e) => setWorkflowCity(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleRunWorkflow()}
            />
            <button
              style={{
                ...styles.workflowBtn,
                opacity: workflowRunning ? 0.5 : 1,
              }}
              onClick={handleRunWorkflow}
              disabled={workflowRunning}
            >
              {workflowRunning ? "执行中..." : "▶ 执行"}
            </button>
          </div>
        )}

        {/* Sender Area */}
        <div style={styles.chatSend}>
          {/* Quick action buttons */}
          <div style={{ ...styles.quickBtnRow, marginBottom: 12 }}>
            <Button
              variant="outline"
              onClick={() => handleSubmit("北京今天天气怎么样？")}
            >
              🌤️ 天气
            </Button>
            <Button
              variant="outline"
              onClick={() => handleSubmit("帮我规划一下东京的周末活动")}
            >
              📋 活动规划
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
