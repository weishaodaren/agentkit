import "vitest/browser";

declare module "vitest/browser" {
  interface LocatorSelectors {
    getByCSS: (selector: string) => Locator;
  }
}
