import { page, userEvent } from "vitest/browser";
import "@vitest/browser/matchers";
import { render } from "vitest-browser-lit";
import { html } from "lit";
import "@/think.ts";

describe("AkThink", () => {
  it("renders custom title text", async () => {
    render(html`<ak-think title="My Reasoning"></ak-think>`);
    await expect.element(page.getByText("My Reasoning")).toBeInTheDocument();
  });

  it("defaults to '思考过程' when no title and not loading", async () => {
    render(html`<ak-think></ak-think>`);
    await expect.element(page.getByText("思考过程")).toBeInTheDocument();
  });

  it("shows '思考中...' when loading and no title", async () => {
    render(html`<ak-think ?loading=${true}></ak-think>`);
    await expect.element(page.getByText("思考中...")).toBeInTheDocument();
  });

  it("uses custom title even when loading", async () => {
    render(html`<ak-think title="Analyzing" ?loading=${true}></ak-think>`);
    await expect.element(page.getByText("Analyzing")).toBeInTheDocument();
  });

  it("dispatches expand event with expanded=false on first click", async () => {
    let expanded: boolean | undefined;
    render(html`<ak-think
      title="Toggle Me"
      @expand=${(e: Event) => {
        expanded = (e as CustomEvent).detail.expanded;
      }}
    ></ak-think>`);
    await userEvent.click(page.getByText("Toggle Me"));
    expect(expanded).toBe(false);
  });

  it("dispatches expand event with expanded=true on second click", async () => {
    const expansions: boolean[] = [];
    render(html`<ak-think
      title="Double Toggle"
      @expand=${(e: Event) => {
        expansions.push((e as CustomEvent).detail.expanded);
      }}
    ></ak-think>`);
    const title = page.getByText("Double Toggle");
    await userEvent.click(title);
    // _toggle() sets _animating=true for 300ms (setTimeout cleanup);
    // must wait for it to reset before the next click can proceed
    await new Promise((r) => setTimeout(r, 350));
    await userEvent.click(title);
    expect(expansions).toEqual([false, true]);
  });

  it("collapses content when defaultExpanded is false", async () => {
    render(html`<ak-think title="T" .defaultExpanded=${false}></ak-think>`);
    await expect.element(page.getByCSS(".ak-think-content")).toHaveStyle({
      height: "0px",
    });
  });

  it("applies blink animation class when blink is true", async () => {
    render(html`<ak-think title="Blinking" ?blink=${true}></ak-think>`);
    await expect
      .element(page.getByCSS(".ak-think-motion-blink"))
      .toBeInTheDocument();
  });

  it("reflects expanded attribute when controlled", async () => {
    render(html`<ak-think title="T" ?expanded=${true}></ak-think>`);
    await expect.element(page.getByCSS("ak-think")).toHaveAttribute("expanded");
  });

  it("does not reflect expanded attribute in uncontrolled mode", async () => {
    render(html`<ak-think title="T"></ak-think>`);
    await expect
      .element(page.getByCSS("ak-think"))
      .not.toHaveAttribute("expanded");
  });

  it("renders slotted content when content property is empty", async () => {
    render(html`<ak-think title="T"><span>Slotted text</span></ak-think>`);
    await expect.element(page.getByText("Slotted text")).toBeInTheDocument();
  });

  it("renders loading icon when loading is true", async () => {
    render(html`<ak-think title="Loading Think" ?loading=${true}></ak-think>`);
    // Loading state adds ak-think-status-icon-loading class to icon wrapper
    await expect
      .element(page.getByCSS(".ak-think-status-icon-loading"))
      .toBeInTheDocument();
  });
});
