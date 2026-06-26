import { page, userEvent } from "vitest/browser";
import "@vitest/browser/matchers";
import { render } from "vitest-browser-lit";
import { html } from "lit";
import "@/sources.ts";
import type { SourceItem } from "@/sources.ts";

const items: SourceItem[] = [
  {
    key: "1",
    title: "First Source",
    description: "Desc one",
    url: "https://a.com",
  },
  { key: "2", title: "Second Source", description: "Desc two" },
];

describe("AkSources", () => {
  it("renders title with item count", async () => {
    render(html`<ak-sources .items=${items} title="References"></ak-sources>`);
    await expect.element(page.getByText("References (2)")).toBeInTheDocument();
  });

  it("uses default title when not provided", async () => {
    render(html`<ak-sources .items=${items}></ak-sources>`);
    await expect.element(page.getByText("参考来源 (2)")).toBeInTheDocument();
  });

  it("renders all item titles", async () => {
    render(html`<ak-sources .items=${items}></ak-sources>`);
    await expect.element(page.getByText("First Source")).toBeInTheDocument();
    await expect.element(page.getByText("Second Source")).toBeInTheDocument();
  });

  it("renders item descriptions", async () => {
    render(html`<ak-sources .items=${items}></ak-sources>`);
    await expect.element(page.getByText("Desc one")).toBeInTheDocument();
    await expect.element(page.getByText("Desc two")).toBeInTheDocument();
  });

  it("renders 1-based item indices", async () => {
    render(html`<ak-sources .items=${items}></ak-sources>`);
    // exact match to avoid conflict with title count "(2)"
    await expect
      .element(page.getByText("1", { exact: true }))
      .toBeInTheDocument();
    await expect
      .element(page.getByText("2", { exact: true }))
      .toBeInTheDocument();
  });

  it("does not render when items is empty", async () => {
    render(html`<ak-sources .items=${[]}></ak-sources>`);
    await expect.element(page.getByCSS(".ak-sources")).not.toBeInTheDocument();
  });

  it("dispatches source-click with key and item on click", async () => {
    let clickedKey = "";
    render(html`<ak-sources
      .items=${items}
      @source-click=${(e: Event) => {
        clickedKey = (e as CustomEvent).detail.key;
      }}
    ></ak-sources>`);
    await userEvent.click(page.getByText("Second Source"));
    expect(clickedKey).toBe("2");
  });

  it("calls window.open when item has url", async () => {
    const openSpy = vi.spyOn(window, "open").mockImplementation(() => null);
    render(html`<ak-sources .items=${items}></ak-sources>`);
    await userEvent.click(page.getByText("First Source"));
    expect(openSpy).toHaveBeenCalledWith(
      "https://a.com",
      "_blank",
      "noopener,noreferrer",
    );
    openSpy.mockRestore();
  });

  it("does not call window.open when item has no url", async () => {
    const openSpy = vi.spyOn(window, "open").mockImplementation(() => null);
    render(html`<ak-sources .items=${items}></ak-sources>`);
    await userEvent.click(page.getByText("Second Source"));
    expect(openSpy).not.toHaveBeenCalled();
    openSpy.mockRestore();
  });

  it("applies inline mode class", async () => {
    render(html`<ak-sources .items=${items} mode="inline"></ak-sources>`);
    await expect
      .element(page.getByCSS(".ak-sources-list"))
      .toHaveClass("ak-sources-inline");
  });

  it("does not apply inline class in list mode", async () => {
    render(html`<ak-sources .items=${items} mode="list"></ak-sources>`);
    await expect
      .element(page.getByCSS(".ak-sources-list"))
      .not.toHaveClass("ak-sources-inline");
  });
});
