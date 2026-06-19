import { useState, useRef, useCallback } from "react";
import {
  Welcome,
  Think,
  Prompts,
  Bubble,
  Sender,
  Actions,
  Sources,
  FileCard,
  Notification,
  Conversations,
  ThoughtChain,
  Suggestion,
  CodeHighlighter,
  Button,
  Markdown,
  XCard,
} from "@agentkit/ui/adaptor/react";
import type {
  PromptsItem,
  ActionsItem,
  SourceItem,
  ConversationItem,
  ThoughtChainItem,
  SuggestionItem,
  NotificationOptions,
  XCardItem,
} from "@agentkit/ui";

// ─── Types ───────────────────────────────────────────────────────
interface ChatMessage {
  role: "user" | "ai";
  content: string;
}

// ─── Demo Data ───────────────────────────────────────────────────
const PROMPTS: PromptsItem[] = [
  { key: "1", label: "解释概念", description: "用简单语言解释复杂概念" },
  { key: "2", label: "写代码", description: "生成代码片段" },
  { key: "3", label: "翻译文本", description: "多语言互译" },
  { key: "4", label: "总结要点", description: "提取文章关键信息" },
];

const CONVERSATIONS: ConversationItem[] = [
  {
    key: "c1",
    label: "关于 React 19 新特性",
    timestamp: "今天 14:30",
    icon: "code",
  },
  {
    key: "c2",
    label: "TypeScript 类型体操练习",
    timestamp: "今天 10:15",
    icon: "braces",
  },
  {
    key: "c3",
    label: "Lit Web Components 入门",
    timestamp: "昨天",
    icon: "flask-conical",
  },
  {
    key: "c4",
    label: "Tailwind CSS v4 迁移指南",
    timestamp: "昨天",
    icon: "palette",
  },
];

const THOUGHT_STEPS: ThoughtChainItem[] = [
  {
    key: "t1",
    title: "理解用户意图",
    description: "解析输入并识别关键实体",
    status: "success",
  },
  {
    key: "t2",
    title: "检索知识库",
    description: "在向量数据库中搜索相关内容",
    status: "success",
  },
  {
    key: "t3",
    title: "生成回复",
    description: "基于上下文生成最佳回答",
    status: "running",
  },
  {
    key: "t4",
    title: "质量校验",
    description: "检查回复的准确性和完整性",
    status: "pending",
  },
];

const SOURCES: SourceItem[] = [
  {
    key: "s1",
    title: "Lit 官方文档",
    description: "lit.dev",
    url: "https://lit.dev",
  },
  {
    key: "s2",
    title: "Tailwind CSS v4",
    description: "tailwindcss.com",
    url: "https://tailwindcss.com",
  },
  {
    key: "s3",
    title: "React 适配器",
    description: "@lit/react",
    url: "https://lit.dev/docs/frameworks/react/",
  },
];

const SAMPLE_CODE = `import { html, LitElement } from "lit";
import { customElement, property } from "lit/decorators.js";

@customElement("my-element")
export class MyElement extends LitElement {
  @property() name = "World";

  override render() {
    return html\`<p>Hello, \${this.name}!</p>\`;
  }
}`;

const SUGGESTIONS: SuggestionItem[] = [
  { key: "sg1", label: "/help 获取帮助", value: "/help" },
  { key: "sg2", label: "/clear 清空对话", value: "/clear" },
  { key: "sg3", label: "/settings 设置", value: "/settings" },
  { key: "sg4", label: "/export 导出对话", value: "/export" },
  { key: "sg5", label: "/theme 切换主题", value: "/theme" },
];

const SAMPLE_MARKDOWN = `# AgentKit UI 组件库

## 特性

- **Lit Web Components** — 框架无关，可在 React/Vue/Angular 中使用
- **Tailwind CSS v4** — 原子化 CSS，Shadow DOM 内嵌样式
- **流式 Markdown 渲染** — 支持 AI 对话中逐字输出
- **Lucide 图标** — 1400+ 精美 SVG 图标

## 快速开始

\`\`\`bash
pnpm add @agentkit/ui
\`\`\`

## 使用示例

\`\`\`tsx
import { Bubble, Sender, Markdown } from "@agentkit/ui/adaptor/react";

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

> 💡 **提示**: 使用 \`streamStatus="loading"\` 可以启用打字光标效果

## 对比表格

| 特性 | @agentkit/ui | antd-x |
|------|-------------|--------|
| 框架 | Lit + Tailwind | React + CSS-in-JS |
| 大小 | ~150KB gzip | ~300KB gzip |
| 多框架 | ✅ React/Vue | ❌ 仅 React |

---

*Powered by [Lit](https://lit.dev) and [Tailwind CSS](https://tailwindcss.com)*
`;

const XCARD_ITEMS: XCardItem[] = [
  {
    key: "card1",
    title: "API 文档",
    content: "查看完整的 API 参考文档，了解所有组件的属性和事件。",
    type: "default",
    icon: "file-text",
    closable: true,
  },
  {
    key: "card2",
    title: "快速开始",
    content: "只需 3 步即可将 AgentKit UI 集成到你的项目中。",
    type: "info",
    icon: "zap",
  },
  {
    key: "card3",
    title: "部署成功",
    content: "你的应用已成功部署到生产环境。",
    type: "success",
    icon: "check-circle",
  },
  {
    key: "card4",
    title: "性能警告",
    content: "检测到页面加载时间超过 3 秒，建议优化组件渲染性能。",
    type: "warning",
    icon: "alert-triangle",
    closable: true,
  },
];

// ─── Notification helper ─────────────────────────────────────────
function notify(
  ref: React.RefObject<HTMLElement | null>,
  opts: NotificationOptions,
) {
  if (ref.current) (ref.current as any).open(opts);
}

// ─── Section wrapper ─────────────────────────────────────────────
function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section style={{ marginTop: "2rem" }}>
      <h3
        style={{
          fontSize: 14,
          fontWeight: 600,
          color: "#888",
          marginBottom: "0.75rem",
          letterSpacing: "0.05em",
          textTransform: "uppercase",
        }}
      >
        {title}
      </h3>
      {children}
    </section>
  );
}

// ─── App ─────────────────────────────────────────────────────────
export function App() {
  // Chat state
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);

  // Conversations state
  const [activeConv, setActiveConv] = useState("c1");

  // Actions state
  const [liked, setLiked] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);

  // Suggestion state
  const [inputValue, setInputValue] = useState("");
  const [showSuggestion, setShowSuggestion] = useState(false);

  // Notification ref
  const notifRef = useRef<HTMLElement>(null);

  // ─── Handlers ──────────────────────────────────────────────────
  const handleSend = useCallback((e: Event) => {
    const detail = (e as CustomEvent).detail;
    const value = detail?.value as string;
    if (!value) return;

    setMessages((prev) => [...prev, { role: "user", content: value }]);
    setLoading(true);
    setShowSuggestion(false);
    setInputValue("");

    // Simulate AI response
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          role: "ai",
          content: `收到你的消息：「${value}」\n\n这是基于 Lit + Tailwind CSS v4 构建的 AI 组件库的演示回复。`,
        },
      ]);
      setLoading(false);
    }, 1500);
  }, []);

  const handlePromptClick = useCallback((e: Event) => {
    const detail = (e as CustomEvent).detail;
    const item = detail?.item as PromptsItem;
    if (!item) return;
    setMessages((prev) => [...prev, { role: "user", content: item.label }]);
    setLoading(true);
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          role: "ai",
          content: `你选择了「${item.label}」— ${item.description}`,
        },
      ]);
      setLoading(false);
    }, 1200);
  }, []);

  const handleActionClick = useCallback((e: Event) => {
    const detail = (e as CustomEvent).detail;
    const key = detail?.key as string;
    if (key === "like") setLiked((v) => !v);
    if (key === "bookmark") setBookmarked((v) => !v);
    if (key === "share") {
      notify(notifRef, {
        title: "链接已复制",
        description: "对话链接已复制到剪贴板",
        type: "success",
      });
    }
  }, []);

  const handleInputChange = useCallback((e: Event) => {
    const detail = (e as CustomEvent).detail;
    const value = (detail?.value as string) ?? "";
    setInputValue(value);
    setShowSuggestion(value.startsWith("/"));
  }, []);

  const handleSuggestionSelect = useCallback((e: Event) => {
    const detail = (e as CustomEvent).detail;
    const value = detail?.value as string;
    setInputValue(value);
    setShowSuggestion(false);
    notify(notifRef, {
      title: `执行命令：${value}`,
      type: "info",
    });
  }, []);

  const handleConvClick = useCallback((e: Event) => {
    const detail = (e as CustomEvent).detail;
    const key = detail?.key as string;
    setActiveConv(key);
    notify(notifRef, {
      title: "切换对话",
      description: `已切换到对话 ${key}`,
      type: "info",
    });
  }, []);

  const handleFileRemove = useCallback((e: Event) => {
    const detail = (e as CustomEvent).detail;
    notify(notifRef, {
      title: "文件已移除",
      description: `${detail?.name}`,
      type: "warning",
    });
  }, []);

  // ─── Action items ──────────────────────────────────────────────
  const actionItems: ActionsItem[] = [
    {
      key: "like",
      label: liked ? "已赞" : "点赞",
      icon: liked ? "heart" : "heart",
      active: liked,
    },
    {
      key: "bookmark",
      label: bookmarked ? "已收藏" : "收藏",
      icon: bookmarked ? "bookmark-check" : "bookmark",
      active: bookmarked,
    },
    { key: "share", label: "分享", icon: "share-2" },
    { key: "report", label: "举报", icon: "flag", disabled: true },
  ];

  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        fontFamily: "system-ui, sans-serif",
      }}
    >
      {/* ── Sidebar: Conversations ── */}
      <aside
        style={{ width: 280, borderRight: "1px solid #e5e7eb", flexShrink: 0 }}
      >
        <Conversations
          items={CONVERSATIONS.map((c) => ({
            ...c,
            active: c.key === activeConv,
          }))}
          title="对话历史"
          activeKey={activeConv}
          onConversationClick={handleConvClick}
        />
      </aside>

      {/* ── Main Content ── */}
      <main
        style={{ flex: 1, maxWidth: 720, margin: "0 auto", padding: "2rem" }}
      >
        {/* Welcome */}
        <Welcome
          title="AgentKit AI"
          description="基于 Lit + Tailwind CSS v4 构建的 AI 组件库，支持 React / Vue 适配层"
          variant="filled"
        />

        {/* ThoughtChain */}
        <Section title="ThoughtChain 思考链">
          <ThoughtChain items={THOUGHT_STEPS} collapsible />
        </Section>

        {/* Think */}
        <Section title="Think 折叠思考">
          <Think
            title="推理过程"
            expanded
            content={`1. 解析用户输入，识别意图为「组件演示」
2. 从知识库中匹配最佳回复模板
3. 渲染所有组件的交互示例`}
          />
        </Section>

        {/* Prompts */}
        <Section title="Prompts 快捷提问">
          <Prompts
            title="选择一个快速开始"
            columns="2"
            items={PROMPTS}
            onItemClick={handlePromptClick}
          />
        </Section>

        {/* Chat area */}
        <Section title="Bubble + Sender 对话">
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "1rem",
              marginBottom: "1rem",
            }}
          >
            {messages.map((msg, i) => (
              <div key={i}>
                <Bubble
                  placement={msg.role === "user" ? "end" : "start"}
                  content={msg.content}
                  typing={msg.role === "ai"}
                  typingSpeed={20}
                />
                {/* Actions on AI messages */}
                {msg.role === "ai" && (
                  <div style={{ marginTop: "0.5rem", marginLeft: "2.75rem" }}>
                    <Actions
                      items={actionItems}
                      onActionClick={handleActionClick}
                    />
                  </div>
                )}
              </div>
            ))}
            {loading && <Bubble placement="start" loading />}
          </div>

          {/* Suggestion overlay */}
          <div style={{ position: "relative" }}>
            {showSuggestion && (
              <div
                style={{
                  position: "absolute",
                  bottom: "100%",
                  left: 0,
                  right: 0,
                  zIndex: 10,
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
              placeholder="输入消息或 / 命令，Enter 发送..."
              loading={loading}
              onSubmit={handleSend}
              onChange={handleInputChange}
            />
          </div>
        </Section>

        {/* Sources */}
        <Section title="Sources 参考来源">
          <Sources items={SOURCES} title="引用来源" onSourceClick={() => {}} />
        </Section>

        {/* FileCard */}
        <Section title="FileCard 文件卡片">
          <div
            style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}
          >
            <FileCard
              name="design-mockup.png"
              size={2457600}
              status="done"
              removable
              onRemove={handleFileRemove}
            />
            <FileCard
              name="report-final.pdf"
              size={1048576}
              status="done"
              removable
              onRemove={handleFileRemove}
            />
            <FileCard
              name="dataset.csv"
              size={52428800}
              status="uploading"
              progress={68}
            />
            <FileCard name="broken-file.tmp" size={0} status="error" />
          </div>
        </Section>

        {/* CodeHighlighter */}
        <Section title="CodeHighlighter 代码高亮">
          <CodeHighlighter
            code={SAMPLE_CODE}
            language="typescript"
            showLineNumbers
            onCopy={() => {
              notify(notifRef, {
                title: "代码已复制",
                description: "代码已复制到剪贴板，可直接粘贴使用",
                type: "success",
              });
            }}
          />
        </Section>

        {/* Button variants */}
        <Section title="Button 按钮">
          <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
            <Button variant="default">Default</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="destructive">Destructive</Button>
            <Button variant="link">Link</Button>
          </div>
        </Section>

        {/* Markdown */}
        <Section title="Markdown 流式渲染">
          <Markdown content={SAMPLE_MARKDOWN} />
        </Section>

        {/* XCard */}
        <Section title="XCard 动态卡片">
          <XCard items={XCARD_ITEMS} columns="2" />
        </Section>

        <div style={{ height: "4rem" }} />
      </main>

      {/* ── Notification (global) ── */}
      {/* @ts-expect-error web component ref */}
      <Notification ref={notifRef} placement="top-right" />
    </div>
  );
}
