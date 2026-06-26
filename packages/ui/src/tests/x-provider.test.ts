import { page } from "vitest/browser";
import "@vitest/browser/matchers";
import { render } from "vitest-browser-lit";
import { html } from "lit";
import "@/x-provider.ts";
import { AkXProvider } from "@/x-provider.ts";

describe("AkXProvider", () => {
  it("renders slot content", async () => {
    render(html`<ak-x-provider><span>Child Content</span></ak-x-provider>`);
    await expect.element(page.getByText("Child Content")).toBeInTheDocument();
  });

  it("applies ltr direction by default", async () => {
    render(html`<ak-x-provider></ak-x-provider>`);
    const el = (await page
      .getByCSS("ak-x-provider")
      .findElement()) as AkXProvider;
    expect(el.style.direction).toBe("ltr");
  });

  it("applies rtl direction when direction is rtl", async () => {
    render(html`<ak-x-provider direction="rtl"></ak-x-provider>`);
    const el = (await page
      .getByCSS("ak-x-provider")
      .findElement()) as AkXProvider;
    expect(el.style.direction).toBe("rtl");
  });

  it("updates direction when property changes", async () => {
    render(html`<ak-x-provider></ak-x-provider>`);
    const el = (await page
      .getByCSS("ak-x-provider")
      .findElement()) as AkXProvider;
    expect(el.style.direction).toBe("ltr");
    el.direction = "rtl";
    await el.updateComplete;
    expect(el.style.direction).toBe("rtl");
  });

  it("has default prefixCls of ant", async () => {
    render(html`<ak-x-provider></ak-x-provider>`);
    const el = (await page
      .getByCSS("ak-x-provider")
      .findElement()) as AkXProvider;
    expect(el.prefixCls).toBe("ant");
  });

  it("has default theme of empty string", async () => {
    render(html`<ak-x-provider></ak-x-provider>`);
    const el = (await page
      .getByCSS("ak-x-provider")
      .findElement()) as AkXProvider;
    expect(el.theme).toBe("");
  });

  it("accepts custom prefixCls", async () => {
    render(html`<ak-x-provider prefix-cls="custom"></ak-x-provider>`);
    const el = (await page
      .getByCSS("ak-x-provider")
      .findElement()) as AkXProvider;
    expect(el.prefixCls).toBe("custom");
  });

  it("accepts custom theme", async () => {
    render(html`<ak-x-provider theme="dark"></ak-x-provider>`);
    const el = (await page
      .getByCSS("ak-x-provider")
      .findElement()) as AkXProvider;
    expect(el.theme).toBe("dark");
  });
});
