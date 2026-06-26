import { page, userEvent } from "vitest/browser";
import "@vitest/browser/matchers";
import { render } from "vitest-browser-lit";
import { html } from "lit";
import "@/suggestion.ts";
import type { SuggestionItem } from "@/suggestion.ts";

const items: SuggestionItem[] = [
  { key: "1", label: "Apple", value: "apple" },
  { key: "2", label: "Banana", value: "banana" },
];

describe("AkSuggestion", () => {
  it("does not render items when open is false", async () => {
    render(html`<ak-suggestion .items=${items}></ak-suggestion>`);
    await expect.element(page.getByText("Apple")).not.toBeInTheDocument();
  });

  it("renders items when open is true", async () => {
    render(html`<ak-suggestion .items=${items} ?open=${true}></ak-suggestion>`);
    await expect.element(page.getByText("Apple")).toBeInTheDocument();
    await expect.element(page.getByText("Banana")).toBeInTheDocument();
  });

  it("dispatches select event with key and value on item click", async () => {
    let selectedKey = "";
    let selectedValue = "";
    render(html`<ak-suggestion
      .items=${items}
      ?open=${true}
      @select=${(e: Event) => {
        const detail = (e as CustomEvent).detail;
        selectedKey = detail.key;
        selectedValue = detail.value;
      }}
    ></ak-suggestion>`);
    await userEvent.click(page.getByText("Apple"));
    expect(selectedKey).toBe("1");
    expect(selectedValue).toBe("apple");
  });

  it("filters items by filterValue matching label", async () => {
    render(html`<ak-suggestion
      .items=${items}
      ?open=${true}
      filter-value="app"
    ></ak-suggestion>`);
    await expect.element(page.getByText("Apple")).toBeInTheDocument();
    await expect.element(page.getByText("Banana")).not.toBeInTheDocument();
  });

  it("filters items by filterValue matching value", async () => {
    render(html`<ak-suggestion
      .items=${items}
      ?open=${true}
      filter-value="ban"
    ></ak-suggestion>`);
    await expect.element(page.getByText("Banana")).toBeInTheDocument();
    await expect.element(page.getByText("Apple")).not.toBeInTheDocument();
  });

  it("strips leading slash from filterValue before filtering", async () => {
    render(html`<ak-suggestion
      .items=${items}
      ?open=${true}
      filter-value="/app"
    ></ak-suggestion>`);
    await expect.element(page.getByText("Apple")).toBeInTheDocument();
  });

  it("expands children when item with children is clicked", async () => {
    const nestedItems: SuggestionItem[] = [
      {
        key: "parent",
        label: "Parent",
        value: "parent",
        children: [{ key: "child", label: "Child Item", value: "child" }],
      },
    ];
    render(html`<ak-suggestion
      .items=${nestedItems}
      ?open=${true}
    ></ak-suggestion>`);
    // Child not visible initially
    await expect.element(page.getByText("Child Item")).not.toBeInTheDocument();
    // Click parent to expand
    await userEvent.click(page.getByText("Parent"));
    await expect.element(page.getByText("Child Item")).toBeInTheDocument();
  });

  it("dispatches select when child item is clicked", async () => {
    const nestedItems: SuggestionItem[] = [
      {
        key: "parent",
        label: "Parent",
        value: "parent",
        children: [{ key: "child", label: "Child Item", value: "child" }],
      },
    ];
    let selectedValue = "";
    render(html`<ak-suggestion
      .items=${nestedItems}
      ?open=${true}
      @select=${(e: Event) => {
        selectedValue = (e as CustomEvent).detail.value;
      }}
    ></ak-suggestion>`);
    await userEvent.click(page.getByText("Parent"));
    await userEvent.click(page.getByText("Child Item"));
    expect(selectedValue).toBe("child");
  });

  it("collapses children when expanded item is clicked again", async () => {
    const nestedItems: SuggestionItem[] = [
      {
        key: "parent",
        label: "Parent",
        value: "parent",
        children: [{ key: "child", label: "Child Item", value: "child" }],
      },
    ];
    render(html`<ak-suggestion
      .items=${nestedItems}
      ?open=${true}
    ></ak-suggestion>`);
    await userEvent.click(page.getByText("Parent"));
    await expect.element(page.getByText("Child Item")).toBeInTheDocument();
    // Click again to collapse
    await userEvent.click(page.getByText("Parent"));
    await expect.element(page.getByText("Child Item")).not.toBeInTheDocument();
  });
});
