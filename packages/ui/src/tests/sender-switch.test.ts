import { page, userEvent } from "vitest/browser";
import "@vitest/browser/matchers";
import { render } from "vitest-browser-lit";
import { html } from "lit";
import "@/sender-switch.ts";

describe("AkSenderSwitch", () => {
  it("renders a button with label as accessible name", async () => {
    render(html`<ak-sender-switch label="Mode"></ak-sender-switch>`);
    await expect
      .element(page.getByRole("button", { name: "Mode" }))
      .toBeInTheDocument();
  });

  it("defaults to unchecked state (no checked attribute)", async () => {
    render(html`<ak-sender-switch label="S"></ak-sender-switch>`);
    await expect
      .element(page.getByCSS("ak-sender-switch"))
      .not.toHaveAttribute("checked");
  });

  it("toggles to checked and dispatches change event on click", async () => {
    let changeDetail: boolean | undefined;
    render(html`<ak-sender-switch
      label="Toggle"
      @change=${(e: Event) => {
        changeDetail = (e as CustomEvent).detail.checked;
      }}
    ></ak-sender-switch>`);
    await userEvent.click(page.getByRole("button", { name: "Toggle" }));
    expect(changeDetail).toBe(true);
  });

  it("toggles back to unchecked on second click", async () => {
    const changes: boolean[] = [];
    render(html`<ak-sender-switch
      label="T"
      @change=${(e: Event) => {
        changes.push((e as CustomEvent).detail.checked);
      }}
    ></ak-sender-switch>`);
    const btn = page.getByRole("button", { name: "T" });
    await userEvent.click(btn);
    await userEvent.click(btn);
    expect(changes).toEqual([true, false]);
  });

  it("reflects checked attribute after toggle to true", async () => {
    render(html`<ak-sender-switch label="R"></ak-sender-switch>`);
    await userEvent.click(page.getByRole("button", { name: "R" }));
    await expect
      .element(page.getByCSS("ak-sender-switch"))
      .toHaveAttribute("checked");
  });

  it("disables the button when disabled is true", async () => {
    render(html`<ak-sender-switch
      label="D"
      ?disabled=${true}
    ></ak-sender-switch>`);
    await expect
      .element(page.getByRole("button", { name: "D" }))
      .toBeDisabled();
  });

  it("does not dispatch change when disabled button is clicked", async () => {
    const handler = vi.fn();
    render(html`<ak-sender-switch
      label="Disabled"
      ?disabled=${true}
      @change=${(e: Event) => handler(e)}
    ></ak-sender-switch>`);
    const btn = page.getByRole("button", { name: "Disabled" });
    const el = await btn.findElement();
    // Direct DOM click bypasses Playwright's disabled guard,
    // but _toggle() has `if (this.disabled) return` to prevent toggle
    (el as HTMLButtonElement).click();
    expect(handler).not.toHaveBeenCalled();
  });
});
