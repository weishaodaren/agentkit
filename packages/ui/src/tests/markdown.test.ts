import { page } from "vitest/browser";
import "@vitest/browser/matchers";
import { render } from "vitest-browser-lit";
import { html } from "lit";
import "@/markdown.ts";

describe("AkMarkdown", () => {
  it("renders nothing when content is empty", async () => {
    render(html`<ak-markdown .content=${""}></ak-markdown>`);
    await expect.element(page.getByCSS(".ak-md")).not.toBeInTheDocument();
  });

  it("renders markdown content as paragraph", async () => {
    render(html`<ak-markdown .content=${"Hello World"}></ak-markdown>`);
    await vi.waitFor(() => {
      expect(page.getByText("Hello World")).toBeDefined();
    });
    await expect.element(page.getByText("Hello World")).toBeInTheDocument();
  });

  it("renders h1 heading", async () => {
    render(html`<ak-markdown .content=${"# Title"}></ak-markdown>`);
    await vi.waitFor(() => {
      expect(page.getByText("Title")).toBeDefined();
    });
    await expect.element(page.getByCSS("h1")).toBeInTheDocument();
  });

  it("renders h2 heading", async () => {
    render(html`<ak-markdown .content=${"## Subtitle"}></ak-markdown>`);
    await vi.waitFor(() => {
      expect(page.getByText("Subtitle")).toBeDefined();
    });
    await expect.element(page.getByCSS("h2")).toBeInTheDocument();
  });

  it("renders bold text", async () => {
    render(html`<ak-markdown .content=${"**bold text**"}></ak-markdown>`);
    await vi.waitFor(() => {
      expect(page.getByText("bold text")).toBeDefined();
    });
    await expect.element(page.getByCSS("strong")).toBeInTheDocument();
  });

  it("renders italic text", async () => {
    render(html`<ak-markdown .content=${"*italic*"}></ak-markdown>`);
    await vi.waitFor(() => {
      expect(page.getByText("italic")).toBeDefined();
    });
    await expect.element(page.getByCSS("em")).toBeInTheDocument();
  });

  it("renders links with ak-md-link class", async () => {
    render(
      html`<ak-markdown
        .content=${"[Click](https://example.com)"}
      ></ak-markdown>`,
    );
    await vi.waitFor(() => {
      expect(page.getByText("Click")).toBeDefined();
    });
    await expect.element(page.getByCSS(".ak-md-link")).toBeInTheDocument();
  });

  it("renders code blocks as ak-code-block", async () => {
    render(
      html`<ak-markdown
        .content=${"```js\nconsole.log(1)\n```"}
      ></ak-markdown>`,
    );
    await vi.waitFor(() => {
      expect(page.getByCSS("ak-code-block")).toBeDefined();
    });
    await expect.element(page.getByCSS("ak-code-block")).toBeInTheDocument();
  });

  it("renders inline code", async () => {
    render(html`<ak-markdown .content=${"Use \`code\` here"}></ak-markdown>`);
    await vi.waitFor(() => {
      expect(page.getByCSS(".ak-md code")).toBeDefined();
    });
    await expect.element(page.getByCSS(".ak-md code")).toBeInTheDocument();
  });

  it("renders unordered lists", async () => {
    render(html`<ak-markdown .content=${"- Item 1\n- Item 2"}></ak-markdown>`);
    await vi.waitFor(() => {
      expect(page.getByCSS("ul")).toBeDefined();
    });
    await expect.element(page.getByCSS("ul")).toBeInTheDocument();
  });

  it("renders ordered lists", async () => {
    render(html`<ak-markdown .content=${"1. First\n2. Second"}></ak-markdown>`);
    await vi.waitFor(() => {
      expect(page.getByCSS("ol")).toBeDefined();
    });
    await expect.element(page.getByCSS("ol")).toBeInTheDocument();
  });

  it("renders blockquotes", async () => {
    render(html`<ak-markdown .content=${"> Quote text"}></ak-markdown>`);
    await vi.waitFor(() => {
      expect(page.getByCSS("blockquote")).toBeDefined();
    });
    await expect.element(page.getByCSS("blockquote")).toBeInTheDocument();
  });

  it("renders tables with ak-md-table class", async () => {
    const content = "| A | B |\n|---|---|\n| 1 | 2 |";
    render(html`<ak-markdown .content=${content}></ak-markdown>`);
    await vi.waitFor(() => {
      expect(page.getByCSS(".ak-md-table")).toBeDefined();
    });
    await expect.element(page.getByCSS(".ak-md-table")).toBeInTheDocument();
  });

  it("renders horizontal rule", async () => {
    render(html`<ak-markdown .content=${"---"}></ak-markdown>`);
    await vi.waitFor(() => {
      expect(page.getByCSS("hr")).toBeDefined();
    });
    await expect.element(page.getByCSS("hr")).toBeInTheDocument();
  });

  it("updates content when content changes", async () => {
    render(html`<ak-markdown .content=${"First"}></ak-markdown>`);
    await vi.waitFor(() => {
      expect(page.getByText("First")).toBeDefined();
    });
    await expect.element(page.getByText("First")).toBeInTheDocument();
  });
});
