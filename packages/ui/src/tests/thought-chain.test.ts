import { page, userEvent } from "vitest/browser";
import "@vitest/browser/matchers";
import { render } from "vitest-browser-lit";
import { html } from "lit";
import "@/thought-chain.ts";
import type { ThoughtChainItem } from "@/thought-chain.ts";

const items: ThoughtChainItem[] = [
  { key: "1", title: "Step One", description: "First step description" },
  { key: "2", title: "Step Two", description: "Second step description" },
];

describe("AkThoughtChain", () => {
  it("renders nothing when items is empty", async () => {
    render(html`<ak-thought-chain .items=${[]}></ak-thought-chain>`);
    await expect
      .element(page.getByCSS(".ak-thought-chain"))
      .not.toBeInTheDocument();
  });

  it("renders all item titles", async () => {
    render(
      html`<ak-thought-chain
        .items=${items}
        .typingSpeed=${0}
      ></ak-thought-chain>`,
    );
    await expect.element(page.getByText("Step One")).toBeInTheDocument();
    await expect.element(page.getByText("Step Two")).toBeInTheDocument();
  });

  it("renders item descriptions when typingSpeed is 0", async () => {
    render(
      html`<ak-thought-chain
        .items=${items}
        .typingSpeed=${0}
      ></ak-thought-chain>`,
    );
    await expect
      .element(page.getByText("First step description"))
      .toBeInTheDocument();
    await expect
      .element(page.getByText("Second step description"))
      .toBeInTheDocument();
  });

  it("renders index number icon by default", async () => {
    render(
      html`<ak-thought-chain
        .items=${items}
        .typingSpeed=${0}
      ></ak-thought-chain>`,
    );
    await expect.element(page.getByText("1")).toBeInTheDocument();
    await expect.element(page.getByText("2")).toBeInTheDocument();
  });

  it("applies success status class", async () => {
    render(
      html`<ak-thought-chain
        .items=${[{ key: "1", title: "Done", status: "success" as const }]}
        .typingSpeed=${0}
      ></ak-thought-chain>`,
    );
    await expect
      .element(page.getByCSS(".ak-thought-chain-status-success"))
      .toBeInTheDocument();
  });

  it("applies error status class", async () => {
    render(
      html`<ak-thought-chain
        .items=${[{ key: "1", title: "Failed", status: "error" as const }]}
        .typingSpeed=${0}
      ></ak-thought-chain>`,
    );
    await expect
      .element(page.getByCSS(".ak-thought-chain-status-error"))
      .toBeInTheDocument();
  });

  it("applies loading status class with spin", async () => {
    render(
      html`<ak-thought-chain
        .items=${[{ key: "1", title: "Loading", status: "loading" as const }]}
        .typingSpeed=${0}
      ></ak-thought-chain>`,
    );
    await expect
      .element(page.getByCSS(".ak-thought-chain-status-loading"))
      .toBeInTheDocument();
    await expect
      .element(page.getByCSS(".ak-thought-chain-spin"))
      .toBeInTheDocument();
  });

  it("applies collapsible class to title", async () => {
    render(
      html`<ak-thought-chain
        .items=${[
          {
            key: "1",
            title: "Collapsible",
            collapsible: true,
            content: "Hidden",
          },
        ]}
        .typingSpeed=${0}
      ></ak-thought-chain>`,
    );
    await expect
      .element(page.getByCSS(".ak-thought-chain-node-collapsible"))
      .toBeInTheDocument();
  });

  it("shows content expanded by default", async () => {
    render(
      html`<ak-thought-chain
        .items=${[
          {
            key: "1",
            title: "Item",
            collapsible: true,
            content: "Content here",
          },
        ]}
        .typingSpeed=${0}
      ></ak-thought-chain>`,
    );
    await expect.element(page.getByText("Content here")).toBeInTheDocument();
    await expect
      .element(page.getByCSS(".ak-thought-chain-node-content-expanded"))
      .toBeInTheDocument();
  });

  it("collapses content on title click", async () => {
    render(
      html`<ak-thought-chain
        .items=${[
          {
            key: "1",
            title: "Item",
            collapsible: true,
            content: "Content here",
          },
        ]}
        .typingSpeed=${0}
      ></ak-thought-chain>`,
    );
    await userEvent.click(page.getByText("Item"));
    await expect
      .element(page.getByCSS(".ak-thought-chain-node-content-collapsed"))
      .toBeInTheDocument();
  });

  it("dispatches expand event on title click", async () => {
    let expandKey = "";
    let expanded = false;
    render(
      html`<ak-thought-chain
        .items=${[
          { key: "1", title: "Item", collapsible: true, content: "Content" },
        ]}
        .typingSpeed=${0}
        @expand=${(e: Event) => {
          const detail = (e as CustomEvent).detail;
          expandKey = detail.key;
          expanded = detail.expanded;
        }}
      ></ak-thought-chain>`,
    );
    await userEvent.click(page.getByText("Item"));
    expect(expandKey).toBe("1");
    expect(expanded).toBe(false);
  });

  it("renders footer", async () => {
    render(
      html`<ak-thought-chain
        .items=${[{ key: "1", title: "Item", footer: "Footer text" }]}
        .typingSpeed=${0}
      ></ak-thought-chain>`,
    );
    await expect.element(page.getByText("Footer text")).toBeInTheDocument();
  });

  it("shows global toggle button when collapsible is true", async () => {
    render(
      html`<ak-thought-chain
        .items=${items}
        ?collapsible=${true}
        .typingSpeed=${0}
      ></ak-thought-chain>`,
    );
    await expect
      .element(page.getByCSS(".ak-thought-chain-toggle"))
      .toBeInTheDocument();
  });

  it("dispatches toggle event on global toggle click", async () => {
    let collapsed = false;
    render(
      html`<ak-thought-chain
        .items=${items}
        ?collapsible=${true}
        .typingSpeed=${0}
        @toggle=${(e: Event) => {
          collapsed = (e as CustomEvent).detail.collapsed;
        }}
      ></ak-thought-chain>`,
    );
    await userEvent.click(page.getByCSS(".ak-thought-chain-toggle"));
    expect(collapsed).toBe(true);
  });

  it("hides nodes when globally collapsed", async () => {
    render(
      html`<ak-thought-chain
        .items=${items}
        ?collapsible=${true}
        .typingSpeed=${0}
      ></ak-thought-chain>`,
    );
    await userEvent.click(page.getByCSS(".ak-thought-chain-toggle"));
    await expect.element(page.getByText("Step One")).not.toBeInTheDocument();
  });

  it("applies blink class when item.blink is true", async () => {
    render(
      html`<ak-thought-chain
        .items=${[{ key: "1", title: "Blinking", blink: true }]}
        .typingSpeed=${0}
      ></ak-thought-chain>`,
    );
    await expect
      .element(page.getByCSS(".ak-thought-chain-motion-blink"))
      .toBeInTheDocument();
  });
});
