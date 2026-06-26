import { zhCN, type Locale } from "@/locale/zh-CN";
import { enUS } from "@/locale/en-US";

/** Recursively collect all leaf paths from an object (e.g. "think.thinking") */
function getLeafPaths(obj: Record<string, unknown>, prefix = ""): string[] {
  const paths: string[] = [];
  for (const [key, val] of Object.entries(obj)) {
    const path = prefix ? `${prefix}.${key}` : key;
    if (val && typeof val === "object" && !Array.isArray(val)) {
      paths.push(...getLeafPaths(val as Record<string, unknown>, path));
    } else {
      paths.push(path);
    }
  }
  return paths.sort();
}

describe("locale structure", () => {
  it("zhCN has all expected top-level namespaces", () => {
    const expected = [
      "think",
      "sender",
      "senderHeader",
      "attachments",
      "conversations",
      "sources",
      "prompts",
      "suggestion",
      "welcome",
      "notification",
      "actions",
      "fileCard",
      "mermaid",
      "folder",
      "codeHighlighter",
    ];
    for (const ns of expected) {
      expect(zhCN).toHaveProperty(ns);
    }
  });

  it("enUS has the same keys as zhCN (structural parity)", () => {
    const zhPaths = getLeafPaths(zhCN);
    const enPaths = getLeafPaths(enUS);
    expect(enPaths).toEqual(zhPaths);
  });

  it("enUS is typed as Locale (type-safe)", () => {
    // This is a compile-time check — if enUS didn't match Locale,
    // the import would fail at type-check time
    const _: Locale = enUS;
    expect(_).toBe(enUS);
  });

  it("zhCN values are Chinese strings", () => {
    expect(zhCN.think.thinking).toBe("深度思考中...");
    expect(zhCN.sender.placeholder).toBe("输入消息...");
    expect(zhCN.welcome.defaultTitle).toBe("你好");
  });

  it("enUS values are English strings", () => {
    expect(enUS.think.thinking).toBe("Thinking...");
    expect(enUS.sender.placeholder).toBe("Type a message...");
    expect(enUS.welcome.defaultTitle).toBe("Hello");
  });

  it("no locale value is empty string", () => {
    for (const path of getLeafPaths(zhCN)) {
      const parts = path.split(".");
      let val: unknown = zhCN;
      for (const p of parts) val = (val as Record<string, unknown>)[p];
      expect(val).toBeTruthy();
    }
  });
});
