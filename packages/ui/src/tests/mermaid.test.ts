import { page, userEvent } from "vitest/browser";
import "@vitest/browser/matchers";
import { render } from "vitest-browser-lit";
import { html } from "lit";
import "@/mermaid.ts";

// Hoist mock functions so they're available in the vi.mock factory
const { mockRender, mockInit } = vi.hoisted(() => ({
  mockRender: vi.fn(),
  mockInit: vi.fn(),
}));

vi.mock("mermaid", () => ({
  default: {
    initialize: mockInit,
    render: mockRender,
  },
}));

describe("AkMermaid", () => {
  beforeEach(() => {
    mockRender.mockClear();
    mockRender.mockResolvedValue({ svg: "<svg>test-diagram</svg>" });
    mockInit.mockClear();
    mockInit.mockImplementation(() => {});
  });

  it("renders toolbar with image/code buttons", async () => {
    render(html`<ak-mermaid code="graph TD; A-->B"></ak-mermaid>`);
    await expect.element(page.getByText("图表")).toBeInTheDocument();
    await expect.element(page.getByText("代码")).toBeInTheDocument();
  });

  it("applies active class to image button by default", async () => {
    render(html`<ak-mermaid code="graph TD; A-->B"></ak-mermaid>`);
    await expect
      .element(page.getByCSS(".ak-mermaid-toolbar-btn-active"))
      .toBeInTheDocument();
  });

  it("switches to code view on code button click", async () => {
    render(html`<ak-mermaid code="graph TD; A-->B"></ak-mermaid>`);
    await userEvent.click(page.getByText("代码"));
    await expect.element(page.getByCSS(".ak-mermaid-code")).toBeInTheDocument();
  });

  it("shows code content in code view", async () => {
    render(html`<ak-mermaid code="graph TD; A-->B"></ak-mermaid>`);
    await userEvent.click(page.getByText("代码"));
    await expect.element(page.getByText("graph TD; A-->B")).toBeInTheDocument();
  });

  it("shows loading state while rendering", async () => {
    // Make render never resolve to keep loading state
    mockRender.mockReturnValue(new Promise(() => {}));
    render(html`<ak-mermaid code="graph TD; A-->B"></ak-mermaid>`);
    await vi.waitFor(() => {
      expect(page.getByText("渲染中...")).toBeDefined();
    });
    await expect.element(page.getByText("渲染中...")).toBeInTheDocument();
  });

  it("shows error on render failure", async () => {
    mockRender.mockRejectedValue(new Error("Parse error"));
    render(html`<ak-mermaid code="invalid"></ak-mermaid>`);
    await vi.waitFor(() => {
      expect(page.getByCSS(".ak-mermaid-error")).toBeDefined();
    });
    await expect
      .element(page.getByCSS(".ak-mermaid-error"))
      .toBeInTheDocument();
  });

  it("renders SVG output in image view", async () => {
    render(html`<ak-mermaid code="graph TD; A-->B"></ak-mermaid>`);
    await vi.waitFor(() => {
      expect(page.getByCSS(".ak-mermaid-output")).toBeDefined();
    });
    await expect
      .element(page.getByCSS(".ak-mermaid-output"))
      .toBeInTheDocument();
  });

  it("shows zoom controls when SVG is rendered", async () => {
    render(html`<ak-mermaid code="graph TD; A-->B"></ak-mermaid>`);
    await vi.waitFor(() => {
      expect(page.getByCSS(".ak-mermaid-zoom-label")).toBeDefined();
    });
    await expect
      .element(page.getByCSS(".ak-mermaid-zoom-label"))
      .toBeInTheDocument();
  });

  it("shows 100% zoom label by default", async () => {
    render(html`<ak-mermaid code="graph TD; A-->B"></ak-mermaid>`);
    await vi.waitFor(() => {
      expect(page.getByText("100%")).toBeDefined();
    });
    await expect.element(page.getByText("100%")).toBeInTheDocument();
  });

  it("shows copy button when SVG is rendered", async () => {
    render(html`<ak-mermaid code="graph TD; A-->B"></ak-mermaid>`);
    await vi.waitFor(() => {
      expect(page.getByText("复制")).toBeDefined();
    });
    await expect.element(page.getByText("复制")).toBeInTheDocument();
  });

  it("shows download button when SVG is rendered", async () => {
    render(html`<ak-mermaid code="graph TD; A-->B"></ak-mermaid>`);
    await vi.waitFor(() => {
      expect(page.getByText("下载")).toBeDefined();
    });
    await expect.element(page.getByText("下载")).toBeInTheDocument();
  });

  it("hides action buttons when all actions are disabled", async () => {
    render(
      html`<ak-mermaid
        code="graph TD; A-->B"
        .actions=${{
          enableZoom: false,
          enableDownload: false,
          enableCopy: false,
        }}
      ></ak-mermaid>`,
    );
    await vi.waitFor(() => {
      expect(page.getByCSS(".ak-mermaid-output")).toBeDefined();
    });
    await expect.element(page.getByText("复制")).not.toBeInTheDocument();
    await expect.element(page.getByText("下载")).not.toBeInTheDocument();
  });

  it("shows 已复制 feedback after copy click", async () => {
    const writeTextSpy = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, "clipboard", {
      value: { writeText: writeTextSpy },
      configurable: true,
    });
    render(html`<ak-mermaid code="graph TD; A-->B"></ak-mermaid>`);
    await vi.waitFor(() => {
      expect(page.getByText("复制")).toBeDefined();
    });
    await userEvent.click(page.getByText("复制"));
    await expect.element(page.getByText("已复制")).toBeInTheDocument();
  });

  it("calls mermaid.initialize with theme", async () => {
    render(html`<ak-mermaid code="graph TD; A-->B" theme="dark"></ak-mermaid>`);
    await vi.waitFor(() => {
      expect(mockInit).toHaveBeenCalledWith({
        startOnLoad: false,
        theme: "dark",
      });
    });
  });

  it("does not render output when code is empty", async () => {
    render(html`<ak-mermaid code=""></ak-mermaid>`);
    await expect
      .element(page.getByCSS(".ak-mermaid-output"))
      .not.toBeInTheDocument();
  });
});
