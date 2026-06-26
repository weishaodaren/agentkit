import { page, userEvent } from "vitest/browser";
import "@vitest/browser/matchers";
import { render } from "vitest-browser-lit";
import { html } from "lit";
import "@/actions.ts";
import type { ActionsItem } from "@/actions.ts";

const items: ActionsItem[] = [
  { key: "1", label: "Like", icon: "heart" },
  { key: "2", label: "Share", active: true },
  { key: "3", label: "Delete", disabled: true },
];

describe("AkActions", () => {
  it("renders all item labels as buttons", async () => {
    render(html`<ak-actions .items=${items}></ak-actions>`);
    await expect
      .element(page.getByRole("button", { name: "Like" }))
      .toBeInTheDocument();
    await expect
      .element(page.getByRole("button", { name: "Share" }))
      .toBeInTheDocument();
  });

  it("applies active class to active items", async () => {
    render(html`<ak-actions .items=${items}></ak-actions>`);
    await expect
      .element(page.getByRole("button", { name: "Share" }))
      .toHaveClass("ak-actions-item-active");
  });

  it("does not apply active class to inactive items", async () => {
    render(html`<ak-actions .items=${items}></ak-actions>`);
    await expect
      .element(page.getByRole("button", { name: "Like" }))
      .not.toHaveClass("ak-actions-item-active");
  });

  it("dispatches action-click with key and item on click", async () => {
    let clickedKey = "";
    render(html`<ak-actions
      .items=${items}
      @action-click=${(e: Event) => {
        clickedKey = (e as CustomEvent).detail.key;
      }}
    ></ak-actions>`);
    await userEvent.click(page.getByRole("button", { name: "Like" }));
    expect(clickedKey).toBe("1");
  });

  it("includes item object in action-click detail", async () => {
    let clickedItem: ActionsItem | undefined;
    render(html`<ak-actions
      .items=${items}
      @action-click=${(e: Event) => {
        clickedItem = (e as CustomEvent).detail.item;
      }}
    ></ak-actions>`);
    await userEvent.click(page.getByRole("button", { name: "Like" }));
    expect(clickedItem?.label).toBe("Like");
  });

  it("does not dispatch action-click for disabled items", async () => {
    const handler = vi.fn();
    render(html`<ak-actions
      .items=${items}
      @action-click=${(e: Event) => handler(e)}
    ></ak-actions>`);
    // disabled button has pointer-events:none CSS + disabled attribute
    const el = await page.getByText("Delete").findElement();
    (el as HTMLElement).click();
    expect(handler).not.toHaveBeenCalled();
  });

  it("applies filled variant class", async () => {
    render(html`<ak-actions .items=${items} variant="filled"></ak-actions>`);
    await expect
      .element(page.getByCSS(".ak-actions"))
      .toHaveClass("ak-actions-filled");
  });

  it("applies outlined variant class", async () => {
    render(html`<ak-actions .items=${items} variant="outlined"></ak-actions>`);
    await expect
      .element(page.getByCSS(".ak-actions"))
      .toHaveClass("ak-actions-outlined");
  });

  it("does not apply variant class for default borderless", async () => {
    render(html`<ak-actions .items=${items}></ak-actions>`);
    const root = page.getByCSS(".ak-actions");
    await expect.element(root).not.toHaveClass("ak-actions-filled");
    await expect.element(root).not.toHaveClass("ak-actions-outlined");
  });

  it("renders icon span when item has icon", async () => {
    render(html`<ak-actions .items=${items}></ak-actions>`);
    await expect
      .element(page.getByCSS(".ak-actions-item-icon"))
      .toBeInTheDocument();
  });

  it("does not render icon span when item has no icon", async () => {
    render(
      html`<ak-actions
        .items=${[{ key: "x", label: "NoIcon" } as ActionsItem]}
      ></ak-actions>`,
    );
    await expect
      .element(page.getByCSS(".ak-actions-item-icon"))
      .not.toBeInTheDocument();
  });
});
