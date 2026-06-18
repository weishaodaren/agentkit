import "@agentkit/ui";
import { useState, useRef, useEffect } from "react";
import type { AkPrompts, AkSender } from "@agentkit/ui";

export function App() {
  const [messages, setMessages] = useState<
    { role: "user" | "ai"; content: string }[]
  >([]);
  const [loading, setLoading] = useState(false);
  const promptsRef = useRef<AkPrompts>(null);
  const senderRef = useRef<AkSender>(null);

  const handleSend = (e: CustomEvent) => {
    const value = e.detail.value as string;
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

  useEffect(() => {
    const prompts = promptsRef.current;
    if (prompts) {
      prompts.items = [
        { key: "1", label: "解释概念", description: "用简单语言解释" },
        { key: "2", label: "写代码", description: "生成代码片段" },
        { key: "3", label: "翻译文本", description: "多语言翻译" },
        { key: "4", label: "总结要点", description: "提取关键信息" },
      ];
    }

    const sender = senderRef.current;
    if (sender) {
      sender.addEventListener("submit", handleSend as EventListener);
    }
    return () => {
      sender?.removeEventListener("submit", handleSend as EventListener);
    };
  }, []);

  return (
    <div style={{ maxWidth: 640, margin: "0 auto", padding: "2rem" }}>
      {/* Welcome */}
      <ak-welcome
        title="AgentKit AI"
        description="基于 Lit + Tailwind CSS v4 构建的 AI 组件库"
        variant="filled"
      />

      {/* Think */}
      <div style={{ marginTop: "1.5rem" }}>
        <ak-think title="推理过程" expanded>
          <p>分析用户输入，匹配最佳回复策略...</p>
        </ak-think>
      </div>

      {/* Prompts */}
      <div style={{ marginTop: "1.5rem" }}>
        <ak-prompts ref={promptsRef} title="快捷提问" columns="2" />
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
          <ak-bubble
            key={i}
            placement={msg.role === "user" ? "end" : "start"}
            content={msg.content}
          />
        ))}
        {loading && <ak-bubble placement="start" loading />}
      </div>

      {/* Sender */}
      <div style={{ marginTop: "1.5rem" }}>
        <ak-sender
          ref={senderRef}
          placeholder="输入消息，Enter 发送..."
          loading={loading}
        />
      </div>
    </div>
  );
}
