import { useState } from "react";
import {
  Welcome,
  Think,
  Prompts,
  Bubble,
  Sender,
} from "@agentkit/ui/adaptor/react";
import type { PromptsItem } from "@agentkit/ui";

export function App() {
  const [messages, setMessages] = useState<
    { role: "user" | "ai"; content: string }[]
  >([]);
  const [loading, setLoading] = useState(false);

  const prompts: PromptsItem[] = [
    { key: "1", label: "解释概念", description: "用简单语言解释" },
    { key: "2", label: "写代码", description: "生成代码片段" },
    { key: "3", label: "翻译文本", description: "多语言翻译" },
    { key: "4", label: "总结要点", description: "提取关键信息" },
  ];

  const handleSend = (e: Event) => {
    const detail = (e as CustomEvent).detail;
    const value = detail?.value as string;
    if (!value) return;
    setMessages((prev) => [...prev, { role: "user", content: value }]);
    setLoading(true);

    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        { role: "ai", content: `收到：${value}` },
      ]);
      setLoading(false);
    }, 1500);
  };

  return (
    <div style={{ maxWidth: 640, margin: "0 auto", padding: "2rem" }}>
      {/* Welcome */}
      <Welcome
        title="AgentKit AI"
        description="基于 Lit + Tailwind CSS v4 构建的 AI 组件库"
        variant="filled"
      />

      {/* Think */}
      <div style={{ marginTop: "1.5rem" }}>
        <Think title="推理过程" expanded>
          <p>分析用户输入，匹配最佳回复策略...</p>
        </Think>
      </div>

      {/* Prompts */}
      <div style={{ marginTop: "1.5rem" }}>
        <Prompts title="快捷提问" columns="2" items={prompts} />
      </div>

      {/* Chat bubbles */}
      <div
        style={{
          marginTop: "1.5rem",
          display: "flex",
          flexDirection: "column",
          gap: "1rem",
        }}
      >
        {messages.map((msg, i) => (
          <Bubble
            key={i}
            placement={msg.role === "user" ? "end" : "start"}
            content={msg.content}
          />
        ))}
        {loading && <Bubble placement="start" loading />}
      </div>

      {/* Sender */}
      <div style={{ marginTop: "1.5rem" }}>
        <Sender
          placeholder="输入消息，Enter 发送..."
          loading={loading}
          onSubmit={handleSend}
        />
      </div>
    </div>
  );
}
