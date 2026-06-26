import { tokenVar, tokenCSS, darkTokenCSS } from "@/shared/tokens";

describe("tokenVar", () => {
  it("wraps name in var(--ak-*)", () => {
    expect(tokenVar("color-primary")).toBe("var(--ak-color-primary)");
  });

  it("handles multi-segment names", () => {
    expect(tokenVar("border-radius-lg")).toBe("var(--ak-border-radius-lg)");
    expect(tokenVar("font-size-sm")).toBe("var(--ak-font-size-sm)");
  });

  it("handles single-word names", () => {
    expect(tokenVar("padding")).toBe("var(--ak-padding)");
  });
});

describe("tokenCSS", () => {
  it("is a CSSResult with :host selector", () => {
    expect(tokenCSS).toBeDefined();
    expect(tokenCSS.cssText).toContain(":host");
  });

  it("contains antd-x color tokens", () => {
    expect(tokenCSS.cssText).toContain("--ak-color-primary");
    expect(tokenCSS.cssText).toContain("--ak-color-error");
    expect(tokenCSS.cssText).toContain("--ak-color-text");
  });

  it("contains spacing tokens", () => {
    expect(tokenCSS.cssText).toContain("--ak-padding-sm");
    expect(tokenCSS.cssText).toContain("--ak-padding");
  });

  it("contains border-radius tokens", () => {
    expect(tokenCSS.cssText).toContain("--ak-border-radius-lg");
  });

  it("contains motion duration tokens", () => {
    expect(tokenCSS.cssText).toContain("--ak-duration-mid");
    expect(tokenCSS.cssText).toContain("--ak-ease-in-out");
  });
});

describe("darkTokenCSS", () => {
  it("is a CSSResult with dark theme overrides", () => {
    expect(darkTokenCSS).toBeDefined();
    expect(darkTokenCSS.cssText).toContain(":host");
  });

  it("overrides primary color for dark mode", () => {
    expect(darkTokenCSS.cssText).toContain("--ak-color-primary");
    // Dark theme uses a different shade
    expect(darkTokenCSS.cssText).toContain("#1668dc");
  });

  it("adjusts text colors for dark mode", () => {
    expect(darkTokenCSS.cssText).toContain("rgba(255, 255, 255");
  });
});
