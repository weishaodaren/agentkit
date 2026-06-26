import "vitest-browser-lit"; // 导入 Lit 测试工具，扩展 screen 和 expect
import { locators } from "vitest/browser";

// 扩展 page/locator 支持 CSS 选择器查询
// 用法: page.getByCSS(".my-class") 或 locator.getByCSS(".child")
locators.extend({
  getByCSS(css: string) {
    return `css=${css}`;
  },
});
