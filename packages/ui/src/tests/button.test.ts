import { page } from "vitest/browser";
import "@vitest/browser/matchers";
import { render } from "vitest-browser-lit";
import { html } from "lit";
import "@/button.ts";

describe("AkButton", () => {
  it("renders a button with slot content", async () => {
    render(html`<ak-button>Click me</ak-button>`);
    // slot 内容投影为 button 的 accessible name
    const button = page.getByRole("button", { name: "Click me" });
    await expect.element(button).toBeInTheDocument();
  });

  it("applies default variant (primary) class", async () => {
    render(html`<ak-button>Default</ak-button>`);
    await expect.element(page.getByRole("button")).toHaveClass("bg-primary");
  });

  it("applies destructive variant class", async () => {
    render(html`<ak-button variant="destructive">Delete</ak-button>`);
    await expect
      .element(page.getByRole("button"))
      .toHaveClass("bg-destructive");
  });

  it("applies sm size class", async () => {
    render(html`<ak-button size="sm">Small</ak-button>`);
    await expect.element(page.getByRole("button")).toHaveClass("h-8");
  });

  it("reflects disabled property to inner button", async () => {
    render(html`<ak-button .disabled=${true}>Disabled</ak-button>`);
    await expect.element(page.getByRole("button")).toBeDisabled();
  });
});
