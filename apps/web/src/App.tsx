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
  type StreamCallbacks,
} from "~/lib/chat";

// ─── Types ───────────────────────────────────────────────────────

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  thinking?: string;
  toolCalls: { toolCallId: string; toolName: string; args?: unknown }[];
  toolResults: {
    toolCallId: string;
    toolName: string;
    result: unknown;
    isError?: boolean;
  }[];
  usage?: {
    promptTokens?: number;
    completionTokens?: number;
    totalTokens?: number;
  };
  status: "loading" | "streaming" | "done" | "error";
}

// ─── Static Data ─────────────────────────────────────────────────

const DEFAULT_CONVERSATIONS: ConversationItem[] = [
  { key: "1", label: "新的对话", group: "今天" },
];

const MOCK_SUGGESTIONS: SuggestionItem[] = [
  { key: "weather", label: "查天气", value: "北京今天天气怎么样？" },
  { key: "plan", label: "规划活动", value: "帮我规划一下周末活动" },
  {
    key: "learn",
    label: "学习知识",
    value: "AgentKit 是什么？",
    children: [
      { key: "react", label: "关于 React", value: "React 19 有什么新特性？" },
      { key: "lit", label: "关于 Lit", value: "Lit Web Components 怎么用？" },
    ],
  },
];

const QUICK_PROMPTS: PromptsItem[] = [
  { key: "q1", label: "北京今天天气怎么样？", icon: "sun" },
  { key: "q2", label: "帮我规划周末活动", icon: "calendar" },
  { key: "q3", label: "AgentKit 架构是怎样的？", icon: "cpu" },
];

// ─── Helpers ─────────────────────────────────────────────────────

let msgIdCounter = 100;
function genId() {
  return `msg-${++msgIdCounter}`;
}

function buildThoughtChain(msg: ChatMessage): ThoughtChainItem[] {
  const items: ThoughtChainItem[] = [];
  let idx = 0;

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

  for (const tc of msg.toolCalls) {
    const result = msg.toolResults.find((r) => r.toolCallId === tc.toolCallId);
    items.push({
      key: `tool-${idx++}`,
      title: `调用工具: ${tc.toolName}`,
      description:
        tc.args !== undefined ? `参数: ${JSON.stringify(tc.args)}` : undefined,
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

const S = {
  wrapper: {
    width: "100%",
    height: "100dvh",
    display: "flex",
    fontFamily:
      'system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    background: "linear-gradient(135deg, #f5f7fa 0%, #e8ecf1 100%)",
    color: "#1f2937",
  } as React.CSSProperties,

  sidebar: {
    width: 320,
    background: "#fff",
    borderRight: "1px solid #e5e7eb",
    display: "flex",
    flexDirection: "column",
    flexShrink: 0,
  } as React.CSSProperties,

  sidebarHeader: {
    padding: "20px 20px 16px",
    borderBottom: "1px solid #f3f4f6",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  } as React.CSSProperties,

  sidebarTitle: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    fontWeight: 700,
    fontSize: 17,
    color: "#111827",
  } as React.CSSProperties,

  sidebarBody: {
    flex: 1,
    overflow: "auto",
    padding: "12px 12px 20px",
  } as React.CSSProperties,

  main: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    minWidth: 0,
    position: "relative",
  } as React.CSSProperties,

  mainHeader: {
    padding: "14px 24px",
    borderBottom: "1px solid #e5e7eb",
    background: "rgba(255,255,255,0.8)",
    backdropFilter: "blur(12px)",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    flexShrink: 0,
  } as React.CSSProperties,

  chatList: {
    flex: 1,
    overflowY: "auto",
    padding: "24px 0",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    minHeight: 0,
  } as React.CSSProperties,

  chatInner: {
    width: "100%",
    maxWidth: 720,
    padding: "0 24px",
  } as React.CSSProperties,

  inputArea: {
    padding: "16px 24px 24px",
    borderTop: "1px solid #e5e7eb",
    background: "rgba(255,255,255,0.8)",
    backdropFilter: "blur(12px)",
    flexShrink: 0,
  } as React.CSSProperties,

  workflowBar: {
    display: "flex",
    gap: 8,
    alignItems: "center",
    padding: "10px 24px 16px",
    borderTop: "1px solid #f3f4f6",
    background: "rgba(249,250,251,0.6)",
    flexShrink: 0,
  } as React.CSSProperties,

  msgBubble: {
    marginBottom: 20,
    width: "100%",
  } as React.CSSProperties,

  thoughtChainWrap: {
    marginBottom: 8,
    padding: "8px 12px",
    borderRadius: 12,
    backgroundColor: "#fafbfc",
    border: "1px solid #f0f1f3",
  } as React.CSSProperties,

  assistantContent: {
    padding: "12px 16px",
    borderRadius: 12,
    backgroundColor: "#f9fafb",
    border: "1px solid #f0f1f3",
  } as React.CSSProperties,

  assistantFooter: {
    display: "flex",
    marginTop: 6,
  } as React.CSSProperties,

  welcomeCard: {
    margin: "40px 0",
    padding: "0 24px",
  } as React.CSSProperties,

  popover: {
    position: "absolute",
    top: 56,
    left: 0,
    width: 280,
    maxHeight: 400,
    overflowY: "auto",
    background: "#fff",
    border: "1px solid #e5e7eb",
    borderRadius: 10,
    boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
    zIndex: 50,
    padding: 8,
  } as React.CSSProperties,

  agentBadge: {
    fontSize: 12,
    padding: "3px 10px",
    borderRadius: 20,
    border: "1px solid #e5e7eb",
    background: "linear-gradient(135deg, #f0f0ff 0%, #e8f0fe 100%)",
    color: "#4f46e5",
    cursor: "pointer",
    outline: "none",
    fontWeight: 500,
  } as React.CSSProperties,
} as const;

// ─── App ─────────────────────────────────────────────────────────

export function App() {
  // State
  const [conversations, setConversations] = useState<ConversationItem[]>(
    DEFAULT_CONVERSATIONS,
  );
  const [activeKey, setActiveKey] = useState("1");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [showSuggestion, setShowSuggestion] = useState(false);
  const [showConvPopover, setShowConvPopover] = useState(false);
  const [isRequesting, setIsRequesting] = useState(false);
  const [attachmentsOpen, setAttachmentsOpen] = useState(false);
  const [files, setFiles] = useState<AttachmentFile[]>([]);
  const [liked, setLiked] = useState(false);

  // Agent & Workflow
  const [agentIds, setAgentIds] = useState<string[]>([]);
  const [selectedAgent, setSelectedAgent] = useState("weather-agent");
  const [workflowIds, setWorkflowIds] = useState<string[]>([]);
  const [workflowCity, setWorkflowCity] = useState("Tokyo");
  const [workflowRunning, setWorkflowRunning] = useState(false);

  // Refs
  const notifRef = useRef<HTMLElement>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const abortRef = useRef<AbortController | null>(null);
  const messagesRef = useRef<ChatMessage[]>(messages);
  messagesRef.current = messages;

  // ── Discovery ──
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
    const key = `c${Date.now()}`;
    setConversations((prev) => [
      { key, label: "新的对话", group: "今天" },
      ...prev,
    ]);
    setActiveKey(key);
    setMessages([]);
    setShowConvPopover(false);
  }, []);

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

      // Rename conversation
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

      streamAgentMessage(selectedAgent, apiMessages, {
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
              m.id === aId ? { ...m, thinking: (m.thinking || "") + delta } : m,
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
            prev.map((m) => (m.id === aId ? { ...m, usage: event.usage } : m)),
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
      }).catch((err) => {
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
      if (value) handleSubmit(value);
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
    { key: "copy", label: "复制", icon: "copy" },
    {
      key: "like",
      label: liked ? "已赞" : "点赞",
      icon: "heart",
      active: liked,
    },
    { key: "regenerate", label: "重新生成", icon: "refresh-cw" },
  ];

  const handleActionClick = useCallback((e: Event) => {
    const detail = (e as CustomEvent).detail;
    const key = detail?.key as string;
    if (key === "copy")
      notify(notifRef, { title: "已复制到剪贴板", type: "success" });
    else if (key === "like") setLiked((v) => !v);
    else if (key === "regenerate")
      notify(notifRef, { title: "重新生成中...", type: "info" });
  }, []);

  const convItems: ConversationItem[] = conversations.map((c) =>
    c.key === activeKey ? { ...c, label: `[当前] ${c.label}` } : c,
  );

  // ── Render ──
  return (
    <div style={S.wrapper}>
      {/* ═══ Sidebar ═══ */}
      <div style={S.sidebar}>
        <div style={S.sidebarHeader}>
          <div style={S.sidebarTitle}>
            <span style={{ fontSize: 20 }}>🤖</span>
            AgentKit
          </div>
          <Button
            size="sm"
            variant="ghost"
            onClick={addConversation}
            title="新建对话"
          >
            ＋ 新对话
          </Button>
        </div>

        <div style={S.sidebarBody}>
          <Conversations
            items={convItems}
            activeKey={activeKey}
            groupable
            onConversationClick={switchConversation}
          />
        </div>
      </div>

      {/* ═══ Main Chat Area ═══ */}
      <div style={S.main}>
        {/* Header */}
        <div style={S.mainHeader}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ fontSize: 13, color: "#6b7280" }}>当前 Agent:</span>
            <select
              style={S.agentBadge}
              value={selectedAgent}
              onChange={(e) => setSelectedAgent(e.target.value)}
            >
              {agentIds.length === 0 ? (
                <option value="weather-agent">weather-agent (demo)</option>
              ) : (
                agentIds.map((id) => (
                  <option key={id} value={id}>
                    {id}
                  </option>
                ))
              )}
            </select>
          </div>
        </div>

        {/* Chat List */}
        <div style={S.chatList}>
          {messages.length === 0 ? (
            <div style={S.welcomeCard}>
              <Welcome
                title="👋 你好，我是 AgentKit AI"
                description="支持工具调用、深度推理、Workflow 编排。试试下面的快捷问题吧！"
                variant="borderless"
              />
              <div style={{ marginTop: 32 }}>
                <Prompts
                  title="快捷问题"
                  items={QUICK_PROMPTS}
                  vertical
                  onItemClick={handlePromptClick}
                />
              </div>
            </div>
          ) : (
            <div style={S.chatInner}>
              {messages.map((msg) => {
                if (msg.role === "user") {
                  return (
                    <div key={msg.id} style={S.msgBubble}>
                      <Bubble placement="end" content={msg.content} />
                    </div>
                  );
                }

                const chain = buildThoughtChain(msg);

                return (
                  <div key={msg.id} style={S.msgBubble}>
                    {/* Thinking */}
                    {msg.thinking && (
                      <div style={{ marginBottom: 8 }}>
                        <Think
                          blink
                          title={
                            msg.status === "done" ? "思考完成" : "深度思考中..."
                          }
                          defaultExpanded
                          loading={
                            msg.status === "loading" ||
                            msg.status === "streaming"
                          }
                          content={msg.thinking}
                        />
                      </div>
                    )}

                    {/* ThoughtChain */}
                    {(msg.toolCalls.length > 0 ||
                      msg.toolResults.length > 0 ||
                      (msg.status === "done" && chain.length > 0)) && (
                      <div style={S.thoughtChainWrap}>
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

                    {/* Content */}
                    {msg.content ? (
                      <div
                        style={{
                          ...S.assistantContent,
                          ...(msg.status === "streaming"
                            ? {
                                backgroundImage:
                                  "linear-gradient(90deg, #ff6b23 0%, #af3cb8 31%, #53b6ff 89%)",
                                backgroundSize: "100% 2px",
                                backgroundRepeat: "no-repeat",
                                backgroundPosition: "bottom",
                              }
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

                    {/* Actions */}
                    {msg.status === "done" && msg.content && (
                      <div style={S.assistantFooter}>
                        <Actions
                          items={makeActionItems()}
                          onActionClick={handleActionClick}
                        />
                      </div>
                    )}
                  </div>
                );
              })}
              <div ref={chatEndRef} />
            </div>
          )}
        </div>

        {/* Workflow Bar */}
        {workflowIds.length > 0 && (
          <div style={S.workflowBar}>
            <span
              style={{ fontSize: 12, color: "#6b7280", whiteSpace: "nowrap" }}
            >
              Workflow
            </span>
            <input
              style={{
                flex: 1,
                fontSize: 13,
                padding: "6px 10px",
                borderRadius: 6,
                border: "1px solid #d1d5db",
                outline: "none",
              }}
              placeholder="输入城市名..."
              value={workflowCity}
              onChange={(e) => setWorkflowCity(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleRunWorkflow()}
            />
            <Button
              size="sm"
              variant="outline"
              onClick={handleRunWorkflow}
              disabled={workflowRunning}
            >
              {workflowRunning ? "执行中..." : "▶ 执行"}
            </Button>
          </div>
        )}

        {/* Input Area */}
        <div style={S.inputArea}>
          {/* Quick buttons */}
          {messages.length === 0 && (
            <div
              style={{
                display: "flex",
                gap: 8,
                marginBottom: 12,
                flexWrap: "wrap",
              }}
            >
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleSubmit("北京今天天气怎么样？")}
              >
                🌤️ 天气
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleSubmit("帮我规划一下东京的周末活动")}
              >
                📋 活动规划
              </Button>
            </div>
          )}

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

function notify(
  ref: React.RefObject<HTMLElement | null>,
  opts: NotificationOptions,
) {
  if (ref.current) (ref.current as any).open(opts);
}
