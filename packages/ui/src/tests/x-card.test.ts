import { page, userEvent } from "vitest/browser";
import "@vitest/browser/matchers";
import { render } from "vitest-browser-lit";
import { html } from "lit";
import "@/x-card.ts";
import type { XCardItem, AkXCard } from "@/x-card.ts";

const items: XCardItem[] = [
  { key: "1", title: "First Card", content: "Content one" },
  { key: "2", title: "Second Card", content: "Content two" },
];

describe("AkXCard", () => {
  it("renders all card titles", async () => {
    render(html`<ak-x-card .items=${items}></ak-x-card>`);
    await expect.element(page.getByText("First Card")).toBeInTheDocument();
    await expect.element(page.getByText("Second Card")).toBeInTheDocument();
  });

  it("renders item content", async () => {
    render(html`<ak-x-card .items=${items}></ak-x-card>`);
    await expect.element(page.getByText("Content one")).toBeInTheDocument();
    await expect.element(page.getByText("Content two")).toBeInTheDocument();
  });

  it("shows empty state when items is empty", async () => {
    render(html`<ak-x-card .items=${[]}></ak-x-card>`);
    await expect.element(page.getByText("暂无内容")).toBeInTheDocument();
  });

  it("applies grid-cols-1 class", async () => {
    render(html`<ak-x-card .items=${items} columns="1"></ak-x-card>`);
    await expect.element(page.getByCSS(".grid")).toHaveClass("grid-cols-1");
  });

  it("applies grid-cols-3 class", async () => {
    render(html`<ak-x-card .items=${items} columns="3"></ak-x-card>`);
    await expect.element(page.getByCSS(".grid")).toHaveClass("grid-cols-3");
  });

  it("shows loading state when item loading is true", async () => {
    render(html`<ak-x-card
      .items=${[{ key: "1", title: "Loading Card", loading: true }]}
    ></ak-x-card>`);
    await expect.element(page.getByText("加载中...")).toBeInTheDocument();
  });

  it("dispatches card-close when close button is clicked", async () => {
    let closedKey = "";
    render(html`<ak-x-card
      .items=${[{ key: "1", title: "Closable", closable: true }]}
      @card-close=${(e: Event) => {
        closedKey = (e as CustomEvent).detail.key;
      }}
    ></ak-x-card>`);
    await userEvent.click(page.getByCSS("button.ak-btn-interactive"));
    expect(closedKey).toBe("1");
  });

  it("hides card and shows empty state after close", async () => {
    render(html`<ak-x-card
      .items=${[{ key: "1", title: "Closable", closable: true }]}
    ></ak-x-card>`);
    await userEvent.click(page.getByCSS("button.ak-btn-interactive"));
    await expect.element(page.getByText("暂无内容")).toBeInTheDocument();
  });

  it("clears loading state via setCardContent API", async () => {
    render(html`<ak-x-card
      .items=${[
        { key: "1", title: "Card", content: "Preloaded", loading: true },
      ]}
    ></ak-x-card>`);
    // Initially shows loading
    await expect.element(page.getByText("加载中...")).toBeInTheDocument();
    // setCardContent clears loading and error, revealing item.content
    const el = (await page.getByCSS("ak-x-card").findElement()) as AkXCard;
    el.setCardContent("1", "Dynamic content");
    await vi.waitFor(async () => {
      await expect.element(page.getByText("Preloaded")).toBeInTheDocument();
    });
  });

  it("shows error via setCardError API", async () => {
    render(html`<ak-x-card
      .items=${[{ key: "1", title: "Card" }]}
    ></ak-x-card>`);
    const el = (await page.getByCSS("ak-x-card").findElement()) as AkXCard;
    el.setCardError("1", "Network failed");
    await vi.waitFor(async () => {
      await expect
        .element(page.getByText("Network failed"))
        .toBeInTheDocument();
    });
  });

  it("shows retry button when error and retryCount > 0", async () => {
    render(html`<ak-x-card
      .items=${[{ key: "1", title: "Card" }]}
      .retryCount=${3}
    ></ak-x-card>`);
    const el = (await page.getByCSS("ak-x-card").findElement()) as AkXCard;
    el.setCardError("1", "Error occurred");
    await vi.waitFor(async () => {
      await expect.element(page.getByText("重试 (0/3)")).toBeInTheDocument();
    });
  });

  it("dispatches card-load on retry click", async () => {
    let loadedKey = "";
    render(html`<ak-x-card
      .items=${[{ key: "1", title: "Card" }]}
      @card-load=${(e: Event) => {
        loadedKey = (e as CustomEvent).detail.key;
      }}
    ></ak-x-card>`);
    const el = (await page.getByCSS("ak-x-card").findElement()) as AkXCard;
    // Wait for initial requestAnimationFrame (from updated) to complete,
    // otherwise _initCardStates will clear the error set by setCardError
    await new Promise((r) => setTimeout(r, 50));
    el.setCardError("1", "Error occurred");
    // Use CSS selector for retry button to avoid text whitespace matching issues
    await vi.waitFor(async () => {
      await expect.element(page.getByCSS("button.mt-1")).toBeInTheDocument();
    });
    await userEvent.click(page.getByCSS("button.mt-1"));
    expect(loadedKey).toBe("1");
  });

  it("does not show retry button when retryCount is 0", async () => {
    render(html`<ak-x-card
      .items=${[{ key: "1", title: "Card" }]}
      .retryCount=${0}
    ></ak-x-card>`);
    const el = (await page.getByCSS("ak-x-card").findElement()) as AkXCard;
    el.setCardError("1", "Fatal error");
    await vi.waitFor(async () => {
      await expect.element(page.getByText("Fatal error")).toBeInTheDocument();
    });
    await expect.element(page.getByText(/重试/)).not.toBeInTheDocument();
  });

  it("renders extra text in header when item has extra", async () => {
    render(html`<ak-x-card
      .items=${[{ key: "1", title: "Card", extra: "3 min ago" }]}
    ></ak-x-card>`);
    await expect.element(page.getByText("3 min ago")).toBeInTheDocument();
  });
});
