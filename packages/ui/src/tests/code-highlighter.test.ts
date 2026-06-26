import { page, userEvent } from "vitest/browser";
import "@vitest/browser/matchers";
import { render } from "vitest-browser-lit";
import { html } from "lit";
import "@/code-highlighter.ts";
import { AkCodeHighlighter } from "@/code-highlighter.ts";

describe("AkCodeHighlighter", () => {
  it("renders language label", async () => {
    render(
      html`<ak-code-highlighter
        .code=${"const x = 1;"}
        language="typescript"
      ></ak-code-highlighter>`,
    );
    await expect.element(page.getByText("typescript")).toBeInTheDocument();
  });

  it("shows text when no language is specified", async () => {
    render(html`<ak-code-highlighter .code=${"hello"}></ak-code-highlighter>`);
    await expect
      .element(page.getByText("text", { exact: true }))
      .toBeInTheDocument();
  });

  it("renders code content", async () => {
    render(
      html`<ak-code-highlighter
        .code=${"console.log(1)"}
        language="js"
      ></ak-code-highlighter>`,
    );
    await expect
      .element(page.getByCSS(".ak-code-highlighter-pre"))
      .toBeInTheDocument();
  });

  it("applies hljs class to code element", async () => {
    render(
      html`<ak-code-highlighter
        .code=${"const x = 1;"}
        language="js"
      ></ak-code-highlighter>`,
    );
    await expect.element(page.getByCSS("code.hljs")).toBeInTheDocument();
  });

  it("highlights keywords with hljs-keyword class", async () => {
    render(
      html`<ak-code-highlighter
        .code=${"const x = 1;"}
        language="js"
      ></ak-code-highlighter>`,
    );
    await expect.element(page.getByCSS(".hljs-keyword")).toBeInTheDocument();
  });

  it("does not render line numbers by default", async () => {
    render(
      html`<ak-code-highlighter
        .code=${"line1\nline2"}
        language="js"
      ></ak-code-highlighter>`,
    );
    await expect
      .element(page.getByCSS(".ak-code-highlighter-line-num"))
      .not.toBeInTheDocument();
  });

  it("renders line numbers when showLineNumbers is true", async () => {
    render(
      html`<ak-code-highlighter
        .code=${"line1\nline2\nline3"}
        language="js"
        ?show-line-numbers=${true}
      ></ak-code-highlighter>`,
    );
    const lineNumEl = await page
      .getByCSS(
        ".ak-code-highlighter-line:first-child .ak-code-highlighter-line-num",
      )
      .findElement();
    expect(lineNumEl?.textContent).toBe("1");
  });

  it("renders correct number of line elements", async () => {
    render(
      html`<ak-code-highlighter
        .code=${"a\nb\nc"}
        language="js"
        ?show-line-numbers=${true}
      ></ak-code-highlighter>`,
    );
    const el = (await page
      .getByCSS("ak-code-highlighter")
      .findElement()) as AkCodeHighlighter;
    await el.updateComplete;
    const lines = el.shadowRoot?.querySelectorAll(".ak-code-highlighter-line");
    expect(lines?.length).toBe(3);
  });

  it("shows copy button with 复制 text", async () => {
    render(
      html`<ak-code-highlighter
        .code=${"hi"}
        language="js"
      ></ak-code-highlighter>`,
    );
    await expect.element(page.getByText("复制")).toBeInTheDocument();
  });

  it("dispatches copy event on copy button click", async () => {
    let copiedCode = "";
    render(
      html`<ak-code-highlighter
        .code=${"console.log(1)"}
        language="js"
        @copy=${(e: Event) => {
          copiedCode = (e as CustomEvent).detail.code;
        }}
      ></ak-code-highlighter>`,
    );
    await userEvent.click(page.getByText("复制"));
    expect(copiedCode).toBe("console.log(1)");
  });

  it("shows 已复制 feedback after click", async () => {
    render(
      html`<ak-code-highlighter
        .code=${"hi"}
        language="js"
      ></ak-code-highlighter>`,
    );
    await userEvent.click(page.getByText("复制"));
    await expect.element(page.getByText("已复制")).toBeInTheDocument();
  });

  it("applies copied class after click", async () => {
    render(
      html`<ak-code-highlighter
        .code=${"hi"}
        language="js"
      ></ak-code-highlighter>`,
    );
    await userEvent.click(page.getByText("复制"));
    await expect
      .element(page.getByCSS(".ak-code-highlighter-copy-copied"))
      .toBeInTheDocument();
  });

  it("resets copied state after 2 seconds", async () => {
    render(
      html`<ak-code-highlighter
        .code=${"hi"}
        language="js"
      ></ak-code-highlighter>`,
    );
    await userEvent.click(page.getByText("复制"));
    await expect.element(page.getByText("已复制")).toBeInTheDocument();
    // Wait for 2s reset task
    await new Promise((r) => setTimeout(r, 2200));
    await expect.element(page.getByText("复制")).toBeInTheDocument();
  });
});
