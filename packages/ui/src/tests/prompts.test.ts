import { page, userEvent } from "vitest/browser";
import "@vitest/browser/matchers";
import { render } from "vitest-browser-lit";
import { html } from "lit";
import "@/prompts.ts";
import type { PromptsItem } from "@/prompts.ts";

const items: PromptsItem[] = [
  { key: "1", label: "First Prompt", description: "Description one" },
  { key: "2", label: "Second Prompt", description: "Description two" },
];

describe("AkPrompts", () => {
  it("renders title as heading", async () => {
    render(html`<ak-prompts .items=${items} title="My Prompts"></ak-prompts>`);
    await expect
      .element(page.getByRole("heading", { name: "My Prompts" }))
      .toBeInTheDocument();
  });

  it("renders all item labels", async () => {
    render(html`<ak-prompts .items=${items}></ak-prompts>`);
    await expect.element(page.getByText("First Prompt")).toBeInTheDocument();
    await expect.element(page.getByText("Second Prompt")).toBeInTheDocument();
  });

  it("renders item descriptions", async () => {
    render(html`<ak-prompts .items=${items}></ak-prompts>`);
    await expect.element(page.getByText("Description one")).toBeInTheDocument();
    await expect.element(page.getByText("Description two")).toBeInTheDocument();
  });

  it("dispatches item-click with item detail on click", async () => {
    let clickedKey = "";
    render(html`<ak-prompts
      .items=${items}
      @item-click=${(e: Event) => {
        clickedKey = (e as CustomEvent).detail.item.key;
      }}
    ></ak-prompts>`);
    await userEvent.click(page.getByText("First Prompt"));
    expect(clickedKey).toBe("1");
  });

  it("does not dispatch item-click for disabled items", async () => {
    const handler = vi.fn();
    const disabledItems: PromptsItem[] = [
      { key: "x", label: "Disabled Prompt", disabled: true },
    ];
    render(html`<ak-prompts
      .items=${disabledItems}
      @item-click=${(e: Event) => handler(e)}
    ></ak-prompts>`);
    // disabled item has pointer-events:none CSS, so use direct DOM click
    // to bypass Playwright's pointer interception
    const el = await page.getByText("Disabled Prompt").findElement();
    (el as HTMLElement).click();
    expect(handler).not.toHaveBeenCalled();
  });

  it("does not dispatch item-click for items with children", async () => {
    const handler = vi.fn();
    const nestedItems: PromptsItem[] = [
      {
        key: "parent",
        label: "Parent Prompt",
        children: [{ key: "child", label: "Child Prompt" }],
      },
    ];
    render(html`<ak-prompts
      .items=${nestedItems}
      @item-click=${(e: Event) => handler(e)}
    ></ak-prompts>`);
    await userEvent.click(page.getByText("Parent Prompt"));
    expect(handler).not.toHaveBeenCalled();
  });

  it("applies columns class based on columns property", async () => {
    render(html`<ak-prompts .items=${items} columns="3"></ak-prompts>`);
    await expect
      .element(page.getByCSS(".ak-prompts-list"))
      .toHaveClass("ak-prompts-list-cols-3");
  });

  it("applies vertical class when vertical is true", async () => {
    render(html`<ak-prompts .items=${items} ?vertical=${true}></ak-prompts>`);
    await expect
      .element(page.getByCSS(".ak-prompts-list"))
      .toHaveClass("ak-prompts-list-vertical");
  });

  it("applies wrap class when wrap is true", async () => {
    render(html`<ak-prompts .items=${items} ?wrap=${true}></ak-prompts>`);
    await expect
      .element(page.getByCSS(".ak-prompts-list"))
      .toHaveClass("ak-prompts-list-wrap");
  });
});
