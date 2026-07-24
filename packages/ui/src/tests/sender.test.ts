import { page, userEvent } from "vitest/browser";
import "@vitest/browser/matchers";
import { render } from "vitest-browser-lit";
import { html } from "lit";
import "@/sender.ts";
import { AkSenderHeader } from "@/sender.ts";

describe("AkSender", () => {
  it("renders textarea with default placeholder", async () => {
    render(html`<ak-sender></ak-sender>`);
    await expect
      .element(page.getByPlaceholder("输入消息..."))
      .toBeInTheDocument();
  });

  it("renders custom placeholder", async () => {
    // Use property binding to avoid placeholder attribute on host element
    render(html`<ak-sender .placeholder=${"Type here"}></ak-sender>`);
    await expect
      .element(page.getByPlaceholder("Type here"))
      .toBeInTheDocument();
  });

  it("renders send button by default", async () => {
    render(html`<ak-sender></ak-sender>`);
    await expect
      .element(page.getByCSS(".ak-sender-send-btn"))
      .toBeInTheDocument();
  });

  it("shows cancel button when loading", async () => {
    render(html`<ak-sender ?loading=${true}></ak-sender>`);
    await expect
      .element(page.getByCSS(".ak-sender-cancel-btn"))
      .toBeInTheDocument();
  });

  it("send button has inactive class when no value", async () => {
    render(html`<ak-sender></ak-sender>`);
    await expect
      .element(page.getByCSS(".ak-sender-send-btn-inactive"))
      .toBeInTheDocument();
  });

  it("send button has active class when has value", async () => {
    render(html`<ak-sender .value=${"Hello"}></ak-sender>`);
    await expect
      .element(page.getByCSS(".ak-sender-send-btn-active"))
      .toBeInTheDocument();
  });

  it("dispatches submit on Enter key", async () => {
    let submittedValue = "";
    render(html`<ak-sender
      .value=${"Hello"}
      @submit=${(e: Event) => {
        submittedValue = (e as CustomEvent).detail.value;
      }}
    ></ak-sender>`);
    const textarea = (await page
      .getByPlaceholder("输入消息...")
      .findElement()) as HTMLTextAreaElement;
    textarea.dispatchEvent(
      new KeyboardEvent("keydown", { key: "Enter", bubbles: true }),
    );
    expect(submittedValue).toBe("Hello");
  });

  it("does not submit on Shift+Enter (default submitType)", async () => {
    const handler = vi.fn();
    render(html`<ak-sender
      .value=${"Hello"}
      @submit=${(e: Event) => handler(e)}
    ></ak-sender>`);
    const textarea = (await page
      .getByPlaceholder("输入消息...")
      .findElement()) as HTMLTextAreaElement;
    textarea.dispatchEvent(
      new KeyboardEvent("keydown", {
        key: "Enter",
        shiftKey: true,
        bubbles: true,
      }),
    );
    expect(handler).not.toHaveBeenCalled();
  });

  it("dispatches submit on Shift+Enter when submitType is shiftEnter", async () => {
    let submittedValue = "";
    render(html`<ak-sender
      .value=${"Hello"}
      submit-type="shiftEnter"
      @submit=${(e: Event) => {
        submittedValue = (e as CustomEvent).detail.value;
      }}
    ></ak-sender>`);
    const textarea = (await page
      .getByPlaceholder("输入消息...")
      .findElement()) as HTMLTextAreaElement;
    // Plain Enter should NOT submit when submitType=shiftEnter
    textarea.dispatchEvent(
      new KeyboardEvent("keydown", { key: "Enter", bubbles: true }),
    );
    expect(submittedValue).toBe("");
    // Shift+Enter SHOULD submit
    textarea.dispatchEvent(
      new KeyboardEvent("keydown", {
        key: "Enter",
        shiftKey: true,
        bubbles: true,
      }),
    );
    expect(submittedValue).toBe("Hello");
  });

  it("dispatches change event on input", async () => {
    let changeValue = "";
    render(html`<ak-sender
      @change=${(e: Event) => {
        changeValue = (e as CustomEvent).detail.value;
      }}
    ></ak-sender>`);
    await userEvent.type(page.getByPlaceholder("输入消息..."), "Hi");
    expect(changeValue).toBe("Hi");
  });

  it("dispatches submit on send button click", async () => {
    let submittedValue = "";
    render(html`<ak-sender
      .value=${"Hello"}
      @submit=${(e: Event) => {
        submittedValue = (e as CustomEvent).detail.value;
      }}
    ></ak-sender>`);
    await userEvent.click(page.getByCSS(".ak-sender-send-btn"));
    expect(submittedValue).toBe("Hello");
  });

  it("does not submit when disabled", async () => {
    const handler = vi.fn();
    render(html`<ak-sender
      .value=${"Hello"}
      ?disabled=${true}
      @submit=${(e: Event) => handler(e)}
    ></ak-sender>`);
    // Button is disabled, use findElement + direct click to bypass actionability check
    const el = await page.getByCSS(".ak-sender-send-btn").findElement();
    (el as HTMLElement).click();
    expect(handler).not.toHaveBeenCalled();
  });

  it("does not submit when loading", async () => {
    const handler = vi.fn();
    render(html`<ak-sender
      .value=${"Hello"}
      ?loading=${true}
      @submit=${(e: Event) => handler(e)}
    ></ak-sender>`);
    // When loading, cancel button is shown instead of send button
    await expect
      .element(page.getByCSS(".ak-sender-cancel-btn"))
      .toBeInTheDocument();
    expect(handler).not.toHaveBeenCalled();
  });

  it("dispatches sender-cancel on cancel button click", async () => {
    let canceled = false;
    render(html`<ak-sender
      ?loading=${true}
      @sender-cancel=${() => {
        canceled = true;
      }}
    ></ak-sender>`);
    await userEvent.click(page.getByCSS(".ak-sender-cancel-btn"));
    expect(canceled).toBe(true);
  });

  it("applies disabled class when disabled", async () => {
    render(html`<ak-sender ?disabled=${true}></ak-sender>`);
    await expect
      .element(page.getByCSS(".ak-sender-disabled"))
      .toBeInTheDocument();
  });

  it("renders prefix slot content", async () => {
    render(html`<ak-sender><span slot="prefix">PrefixBtn</span></ak-sender>`);
    await expect.element(page.getByText("PrefixBtn")).toBeInTheDocument();
  });

  it("renders suffix slot content", async () => {
    render(html`<ak-sender><span slot="suffix">SuffixBtn</span></ak-sender>`);
    await expect.element(page.getByText("SuffixBtn")).toBeInTheDocument();
  });

  it("does not submit when value is whitespace only", async () => {
    const handler = vi.fn();
    render(html`<ak-sender
      .value=${"   "}
      @submit=${(e: Event) => handler(e)}
    ></ak-sender>`);
    const textarea = (await page
      .getByPlaceholder("输入消息...")
      .findElement()) as HTMLTextAreaElement;
    textarea.dispatchEvent(
      new KeyboardEvent("keydown", { key: "Enter", bubbles: true }),
    );
    expect(handler).not.toHaveBeenCalled();
  });
});

describe("AkSenderHeader", () => {
  it("renders title", async () => {
    render(html`<ak-sender-header title="Header Title"></ak-sender-header>`);
    await expect.element(page.getByText("Header Title")).toBeInTheDocument();
  });

  it("is collapsed by default", async () => {
    render(html`<ak-sender-header title="T"></ak-sender-header>`);
    await expect
      .element(page.getByCSS(".ak-sender-header-closed"))
      .toBeInTheDocument();
  });

  it("is open when open attribute is set", async () => {
    render(html`<ak-sender-header title="T" ?open=${true}></ak-sender-header>`);
    await expect
      .element(page.getByCSS(".ak-sender-header-open"))
      .toBeInTheDocument();
  });

  it("toggles open on click", async () => {
    render(html`<ak-sender-header title="Toggle"></ak-sender-header>`);
    await userEvent.click(page.getByText("Toggle"));
    await expect
      .element(page.getByCSS(".ak-sender-header-open"))
      .toBeInTheDocument();
  });

  it("dispatches open-change event on toggle", async () => {
    let openState = false;
    render(html`<ak-sender-header
      title="Event"
      @open-change=${(e: Event) => {
        openState = (e as CustomEvent).detail.open;
      }}
    ></ak-sender-header>`);
    await userEvent.click(page.getByText("Event"));
    expect(openState).toBe(true);
  });

  it("reflects open property as attribute", async () => {
    render(html`<ak-sender-header title="Reflect"></ak-sender-header>`);
    const el = (await page
      .getByCSS("ak-sender-header")
      .findElement()) as AkSenderHeader;
    expect(el.open).toBe(false);
    el.open = true;
    await el.updateComplete;
    expect(el.open).toBe(true);
    expect(el.hasAttribute("open")).toBe(true);
  });
});
