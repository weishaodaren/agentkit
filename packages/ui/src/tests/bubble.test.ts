import { page } from "vitest/browser";
import "@vitest/browser/matchers";
import { render } from "vitest-browser-lit";
import { html } from "lit";
import "@/bubble.ts";

describe("AkBubble", () => {
  it("renders content text", async () => {
    render(html`<ak-bubble content="Hello World"></ak-bubble>`);
    await expect.element(page.getByText("Hello World")).toBeInTheDocument();
  });

  it("applies placement start class", async () => {
    render(html`<ak-bubble content="Hi" placement="start"></ak-bubble>`);
    await expect
      .element(page.getByCSS(".ak-bubble"))
      .toHaveClass("ak-bubble-start");
  });

  it("applies placement end class", async () => {
    render(html`<ak-bubble content="Hi" placement="end"></ak-bubble>`);
    await expect
      .element(page.getByCSS(".ak-bubble"))
      .toHaveClass("ak-bubble-end");
  });

  it("applies filled variant class", async () => {
    render(html`<ak-bubble content="Hi" variant="filled"></ak-bubble>`);
    await expect
      .element(page.getByCSS(".ak-bubble-content"))
      .toHaveClass("ak-bubble-content-filled");
  });

  it("applies outlined variant class", async () => {
    render(html`<ak-bubble content="Hi" variant="outlined"></ak-bubble>`);
    await expect
      .element(page.getByCSS(".ak-bubble-content"))
      .toHaveClass("ak-bubble-content-outlined");
  });

  it("applies shadow variant class", async () => {
    render(html`<ak-bubble content="Hi" variant="shadow"></ak-bubble>`);
    await expect
      .element(page.getByCSS(".ak-bubble-content"))
      .toHaveClass("ak-bubble-content-shadow");
  });

  it("applies borderless variant class", async () => {
    render(html`<ak-bubble content="Hi" variant="borderless"></ak-bubble>`);
    await expect
      .element(page.getByCSS(".ak-bubble-content"))
      .toHaveClass("ak-bubble-content-borderless");
  });

  it("applies shape default class for non-borderless", async () => {
    render(
      html`<ak-bubble
        content="Hi"
        variant="filled"
        shape="default"
      ></ak-bubble>`,
    );
    await expect
      .element(page.getByCSS(".ak-bubble-content"))
      .toHaveClass("ak-bubble-content-default");
  });

  it("applies shape round class for non-borderless", async () => {
    render(
      html`<ak-bubble content="Hi" variant="filled" shape="round"></ak-bubble>`,
    );
    await expect
      .element(page.getByCSS(".ak-bubble-content"))
      .toHaveClass("ak-bubble-content-round");
  });

  it("does not apply shape class for borderless variant", async () => {
    render(
      html`<ak-bubble
        content="Hi"
        variant="borderless"
        shape="round"
      ></ak-bubble>`,
    );
    const content = page.getByCSS(".ak-bubble-content");
    await expect.element(content).not.toHaveClass("ak-bubble-content-round");
    await expect.element(content).not.toHaveClass("ak-bubble-content-default");
  });

  it("shows loading dots when loading is true", async () => {
    render(html`<ak-bubble ?loading=${true}></ak-bubble>`);
    await expect.element(page.getByCSS(".ak-bubble-dot")).toBeInTheDocument();
  });

  it("does not show loading dots when loading is false", async () => {
    render(html`<ak-bubble content="Hi"></ak-bubble>`);
    await expect
      .element(page.getByCSS(".ak-bubble-dot"))
      .not.toBeInTheDocument();
  });

  it("renders avatar img when avatar is set", async () => {
    render(
      html`<ak-bubble
        content="Hi"
        avatar="https://img.test/a.jpg"
      ></ak-bubble>`,
    );
    await expect.element(page.getByAltText("avatar")).toBeInTheDocument();
  });

  it("renders header slot content", async () => {
    render(html`<ak-bubble content="Hi">
      <span slot="header">Header Text</span>
    </ak-bubble>`);
    await expect.element(page.getByText("Header Text")).toBeInTheDocument();
  });

  it("renders footer slot in outer placement by default", async () => {
    render(html`<ak-bubble content="Hi">
      <span slot="footer">Footer Text</span>
    </ak-bubble>`);
    await expect.element(page.getByText("Footer Text")).toBeInTheDocument();
  });

  it("renders extra slot when not loading", async () => {
    render(html`<ak-bubble content="Hi">
      <span slot="extra">Extra Text</span>
    </ak-bubble>`);
    await expect.element(page.getByText("Extra Text")).toBeInTheDocument();
  });

  it("does not render extra slot container when loading", async () => {
    render(html`<ak-bubble ?loading=${true}>
      <span slot="extra">Extra Text</span>
    </ak-bubble>`);
    // slot content stays in light DOM, but the .ak-bubble-extra container
    // is not rendered in shadow DOM when loading
    await expect
      .element(page.getByCSS(".ak-bubble-extra"))
      .not.toBeInTheDocument();
  });

  it("renders default slot when content is empty", async () => {
    render(html`<ak-bubble>
      <span>Default Content</span>
    </ak-bubble>`);
    await expect.element(page.getByText("Default Content")).toBeInTheDocument();
  });

  it("dispatches typing-complete after typing animation finishes", async () => {
    let completed = false;
    render(html`<ak-bubble
      content="Hi"
      ?typing=${true}
      .typingSpeed=${1}
      @typing-complete=${() => {
        completed = true;
      }}
    ></ak-bubble>`);
    await vi.waitFor(() => {
      expect(completed).toBe(true);
    });
  });

  it("does not dispatch typing-complete when streaming is true", async () => {
    let completed = false;
    render(html`<ak-bubble
      content="Hi"
      ?typing=${true}
      ?streaming=${true}
      .typingSpeed=${1}
      @typing-complete=${() => {
        completed = true;
      }}
    ></ak-bubble>`);
    await new Promise((r) => setTimeout(r, 100));
    expect(completed).toBe(false);
  });
});
