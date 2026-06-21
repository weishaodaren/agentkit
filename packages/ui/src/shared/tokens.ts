/**
 * antd-x Design Tokens → CSS Custom Properties
 *
 * 对标 antd-x 的 token 系统（packages/x/components/theme/）
 * 通过 CSS 自定义属性注入到 Shadow DOM，XProvider 可在 :host 上覆盖
 *
 * Usage in components:
 *   import { tokenCSS } from "@/shared/tokens";
 *   static styles = [tokenCSS, componentCSS];
 *   // then use var(--ak-color-primary) etc. in CSS
 */
import { css, type CSSResult } from "lit";

/**
 * antd-x design token → CSS custom property mapping.
 * All values use antd-x default theme tokens.
 */
export const tokenCSS: CSSResult = css`
  :host {
    /* ── Colors ─────────────────────────────────── */
    --ak-color-primary: #1677ff;
    --ak-color-primary-hover: #4096ff;
    --ak-color-primary-active: #0958d9;
    --ak-color-primary-bg: #e6f4ff;
    --ak-color-success: #52c41a;
    --ak-color-warning: #faad14;
    --ak-color-error: #ff4d4f;
    --ak-color-info: #1677ff;

    /* Text colors */
    --ak-color-text: rgba(0, 0, 0, 0.88);
    --ak-color-text-secondary: rgba(0, 0, 0, 0.65);
    --ak-color-text-tertiary: rgba(0, 0, 0, 0.45);
    --ak-color-text-quaternary: rgba(0, 0, 0, 0.25);
    --ak-color-text-description: rgba(0, 0, 0, 0.45);

    /* Background colors */
    --ak-color-bg-container: #ffffff;
    --ak-color-bg-layout: #f5f5f5;
    --ak-color-bg-elevated: #ffffff;
    --ak-color-bg-spotlight: rgba(0, 0, 0, 0.85);
    --ak-color-bg-text-hover: rgba(0, 0, 0, 0.04);
    --ak-color-bg-text-active: rgba(0, 0, 0, 0.06);
    --ak-color-fill-content: rgba(0, 0, 0, 0.04);
    --ak-color-fill-content-hover: rgba(0, 0, 0, 0.08);

    /* Border colors */
    --ak-color-border: #d9d9d9;
    --ak-color-border-secondary: #f0f0f0;

    /* ── Spacing ────────────────────────────────── */
    --ak-padding-xxs: 4px;
    --ak-padding-xs: 8px;
    --ak-padding-sm: 12px;
    --ak-padding: 16px;
    --ak-padding-md: 20px;
    --ak-padding-lg: 24px;
    --ak-padding-xl: 32px;

    --ak-margin-xxs: 4px;
    --ak-margin-xs: 8px;
    --ak-margin-sm: 12px;
    --ak-margin: 16px;
    --ak-margin-md: 20px;
    --ak-margin-lg: 24px;
    --ak-margin-xl: 32px;

    /* ── Typography ─────────────────────────────── */
    --ak-font-family:
      -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue",
      Arial, "Noto Sans", sans-serif;
    --ak-font-family-code:
      "SFMono-Regular", Consolas, "Liberation Mono", Menlo, Courier, monospace;

    --ak-font-size: 14px;
    --ak-font-size-sm: 12px;
    --ak-font-size-lg: 16px;
    --ak-font-size-xl: 20px;
    --ak-font-size-heading-1: 38px;
    --ak-font-size-heading-2: 30px;
    --ak-font-size-heading-3: 24px;
    --ak-font-size-heading-4: 20px;
    --ak-font-size-heading-5: 16px;

    --ak-line-height: 1.5714;
    --ak-line-height-lg: 1.5;
    --ak-line-height-sm: 1.6667;

    /* ── Border Radius ──────────────────────────── */
    --ak-border-radius-xs: 2px;
    --ak-border-radius-sm: 4px;
    --ak-border-radius: 6px;
    --ak-border-radius-md: 8px;
    --ak-border-radius-lg: 12px;
    --ak-border-radius-xl: 16px;

    /* ── Line Width ─────────────────────────────── */
    --ak-line-width: 1px;
    --ak-line-width-bold: 2px;

    /* ── Shadows ────────────────────────────────── */
    --ak-box-shadow:
      0 6px 16px 0 rgba(0, 0, 0, 0.08), 0 3px 6px -4px rgba(0, 0, 0, 0.12),
      0 9px 28px 8px rgba(0, 0, 0, 0.05);
    --ak-box-shadow-secondary:
      0 6px 16px 0 rgba(0, 0, 0, 0.08), 0 3px 6px -4px rgba(0, 0, 0, 0.12),
      0 9px 28px 8px rgba(0, 0, 0, 0.05);
    --ak-box-shadow-tertiary:
      0 1px 2px 0 rgba(0, 0, 0, 0.03), 0 1px 6px -1px rgba(0, 0, 0, 0.02),
      0 2px 4px 0 rgba(0, 0, 0, 0.02);

    /* ── Motion ─────────────────────────────────── */
    --ak-duration-fast: 100ms;
    --ak-duration-mid: 200ms;
    --ak-duration-slow: 300ms;
    --ak-ease-in-out: cubic-bezier(0.645, 0.045, 0.355, 1);
    --ak-ease-out: cubic-bezier(0.215, 0.61, 0.355, 1);
    --ak-ease-in: cubic-bezier(0.55, 0.055, 0.675, 0.19);

    /* ── Control ────────────────────────────────── */
    --ak-control-height: 32px;
    --ak-control-height-sm: 24px;
    --ak-control-height-lg: 40px;

    /* ── Z-Index ────────────────────────────────── */
    --ak-z-index-base: 0;
    --ak-z-index-affix: 100;
    --ak-z-index-popup: 1000;
    --ak-z-index-modal: 1000;
    --ak-z-index-notification: 1010;
    --ak-z-index-tooltip: 1070;

    /* ── Component-specific aliases ─────────────── */
    /* Bubble */
    --ak-bubble-content-bg: var(--ak-color-fill-content);
    --ak-bubble-content-border-radius: var(--ak-border-radius-lg);

    /* Sender */
    --ak-sender-bg: var(--ak-color-bg-container);
    --ak-sender-border-radius: var(--ak-border-radius-lg);

    /* Think */
    --ak-think-border-color: var(--ak-color-border);
    --ak-think-text-color: var(--ak-color-text-description);

    /* Prompts */
    --ak-prompts-item-bg: var(--ak-color-bg-container);
    --ak-prompts-item-border: var(--ak-color-border-secondary);
    --ak-prompts-item-hover-bg: var(--ak-color-bg-text-hover);
  }
`;

/**
 * Helper: get a CSS variable reference for use in inline styles
 * @example `color: ${tokenVar('color-primary')}` → `color: var(--ak-color-primary)`
 */
export function tokenVar(name: string): string {
  return `var(--ak-${name})`;
}

/**
 * Dark theme token overrides.
 * Apply via XProvider or manually on :host for dark mode.
 */
export const darkTokenCSS: CSSResult = css`
  :host {
    --ak-color-primary: #1668dc;
    --ak-color-primary-hover: #3c89e8;
    --ak-color-primary-active: #1554ad;
    --ak-color-primary-bg: #111a2c;

    --ak-color-text: rgba(255, 255, 255, 0.85);
    --ak-color-text-secondary: rgba(255, 255, 255, 0.65);
    --ak-color-text-tertiary: rgba(255, 255, 255, 0.45);
    --ak-color-text-quaternary: rgba(255, 255, 255, 0.25);
    --ak-color-text-description: rgba(255, 255, 255, 0.45);

    --ak-color-bg-container: #141414;
    --ak-color-bg-layout: #000000;
    --ak-color-bg-elevated: #1f1f1f;
    --ak-color-bg-spotlight: rgba(255, 255, 255, 0.85);
    --ak-color-bg-text-hover: rgba(255, 255, 255, 0.06);
    --ak-color-bg-text-active: rgba(255, 255, 255, 0.08);
    --ak-color-fill-content: rgba(255, 255, 255, 0.04);
    --ak-color-fill-content-hover: rgba(255, 255, 255, 0.08);

    --ak-color-border: #424242;
    --ak-color-border-secondary: #303030;

    --ak-bubble-content-bg: var(--ak-color-fill-content);
    --ak-sender-bg: var(--ak-color-bg-container);
    --ak-think-border-color: var(--ak-color-border);
    --ak-think-text-color: var(--ak-color-text-description);
    --ak-prompts-item-bg: var(--ak-color-bg-container);
    --ak-prompts-item-border: var(--ak-color-border-secondary);
    --ak-prompts-item-hover-bg: var(--ak-color-bg-text-hover);
  }
`;
