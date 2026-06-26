import { page } from "vitest/browser";
import "@vitest/browser/matchers";
import { render } from "vitest-browser-lit";
import { html } from "lit";
import "@/welcome.ts";

describe("AkWelcome", () => {
  it("renders title as heading", async () => {
    render(html`<ak-welcome title="Welcome Title"></ak-welcome>`);
    await expect
      .element(page.getByRole("heading", { name: "Welcome Title" }))
      .toBeInTheDocument();
  });

  it("renders description text", async () => {
    render(
      html`<ak-welcome
        title="T"
        description="My description text"
      ></ak-welcome>`,
    );
    await expect
      .element(page.getByText("My description text"))
      .toBeInTheDocument();
  });

  it("applies filled variant class by default", async () => {
    render(html`<ak-welcome title="T"></ak-welcome>`);
    const root = page.getByCSS(".ak-welcome");
    await expect.element(root).toHaveClass("ak-welcome-filled");
  });

  it("applies borderless variant class", async () => {
    render(html`<ak-welcome variant="borderless" title="T"></ak-welcome>`);
    const root = page.getByCSS(".ak-welcome");
    await expect.element(root).toHaveClass("ak-welcome-borderless");
  });

  it("renders icon as img when http URL provided", async () => {
    render(
      html`<ak-welcome
        icon="https://example.com/icon.png"
        title="T"
      ></ak-welcome>`,
    );
    const img = page.getByRole("img");
    await expect
      .element(img)
      .toHaveAttribute("src", "https://example.com/icon.png");
  });

  it("renders icon as img when data URL provided", async () => {
    render(
      html`<ak-welcome
        icon="data:image/png;base64,abc"
        title="T"
      ></ak-welcome>`,
    );
    const img = page.getByRole("img");
    await expect
      .element(img)
      .toHaveAttribute("src", "data:image/png;base64,abc");
  });

  it("renders icon as SVG when icon name provided", async () => {
    render(html`<ak-welcome icon="sparkles" title="T"></ak-welcome>`);
    const svg = page.getByCSS(".ak-welcome-icon svg");
    await expect.element(svg).toBeInTheDocument();
  });

  it("renders icon slot when no icon property", async () => {
    render(
      html`<ak-welcome title="T"><span slot="icon">custom</span></ak-welcome>`,
    );
    await expect.element(page.getByText("custom")).toBeInTheDocument();
  });
});
