/**
 * Motion utilities inspired by Ant Design's motion system.
 * Provides CSS keyframes + utility classes for Shadow DOM injection.
 *
 * Design tokens:
 *   --ak-duration-fast: 100ms
 *   --ak-duration-normal: 200ms
 *   --ak-duration-slow: 300ms
 *   --ak-ease-in-out: cubic-bezier(0.645, 0.045, 0.355, 1)
 *   --ak-ease-out: cubic-bezier(0.215, 0.61, 0.355, 1)
 *   --ak-ease-in: cubic-bezier(0.55, 0.055, 0.675, 0.19)
 */
import { unsafeCSS, type CSSResult } from "lit";

export const motionCSS: CSSResult = unsafeCSS(`
  :host {
    --ak-duration-fast: 100ms;
    --ak-duration-normal: 200ms;
    --ak-duration-slow: 300ms;
    --ak-ease-in-out: cubic-bezier(0.645, 0.045, 0.355, 1);
    --ak-ease-out: cubic-bezier(0.215, 0.61, 0.355, 1);
    --ak-ease-in: cubic-bezier(0.55, 0.055, 0.675, 0.19);
  }

  /* ── Keyframes ─────────────────────────────────── */

  @keyframes ak-fade-in {
    from { opacity: 0; }
    to { opacity: 1; }
  }

  @keyframes ak-fade-in-left {
    from { opacity: 0; transform: translateX(-20px); }
    to { opacity: 1; transform: translateX(0); }
  }

  @keyframes ak-fade-out {
    from { opacity: 1; }
    to { opacity: 0; }
  }

  @keyframes ak-slide-up {
    from { opacity: 0; transform: translateY(8px); }
    to { opacity: 1; transform: translateY(0); }
  }

  @keyframes ak-slide-down {
    from { opacity: 0; transform: translateY(-8px); }
    to { opacity: 1; transform: translateY(0); }
  }

  @keyframes ak-zoom-in {
    from { opacity: 0; transform: scale(0.95); }
    to { opacity: 1; transform: scale(1); }
  }

  @keyframes ak-enter-right {
    from { opacity: 0; transform: translateX(100%); }
    to { opacity: 1; transform: translateX(0); }
  }

  @keyframes ak-enter-left {
    from { opacity: 0; transform: translateX(-100%); }
    to { opacity: 1; transform: translateX(0); }
  }

  @keyframes ak-expand {
    from { max-height: 0; opacity: 0; }
    to { max-height: 2000px; opacity: 1; }
  }

  @keyframes ak-collapse {
    from { max-height: 2000px; opacity: 1; }
    to { max-height: 0; opacity: 0; }
  }

  @keyframes ak-spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }

  @keyframes ak-pulse-dot {
    0%, 80%, 100% { transform: scale(0.6); opacity: 0.4; }
    40% { transform: scale(1); opacity: 1; }
  }

  /* antd loadingMove: translateY 0→4→0→-4→0 over 2s */
  @keyframes ak-loading-bounce {
    0%   { transform: translateY(0); }
    10%  { transform: translateY(4px); }
    20%  { transform: translateY(0); }
    30%  { transform: translateY(-4px); }
    40%  { transform: translateY(0); }
    100% { transform: translateY(0); }
  }

  @keyframes ak-typewriter-cursor {
    0%, 100% { opacity: 1; }
    50% { opacity: 0; }
  }

  /* ── Utility animation classes ─────────────────── */

  .ak-motion-fade-in {
    animation: ak-fade-in var(--ak-duration-slow) var(--ak-ease-out) both;
  }

  .ak-motion-fade-in-left {
    animation: ak-fade-in-left var(--ak-duration-slow) var(--ak-ease-out) both;
  }

  .ak-motion-slide-up {
    animation: ak-slide-up var(--ak-duration-slow) var(--ak-ease-out) both;
  }

  .ak-motion-slide-down {
    animation: ak-slide-down var(--ak-duration-slow) var(--ak-ease-out) both;
  }

  .ak-motion-zoom-in {
    animation: ak-zoom-in var(--ak-duration-slow) var(--ak-ease-out) both;
  }

  .ak-motion-enter-right {
    animation: ak-enter-right var(--ak-duration-slow) var(--ak-ease-out) both;
  }

  /* ── Button interactions (antd-style) ──────────── */

  .ak-btn-interactive {
    transition:
      background-color var(--ak-duration-normal) var(--ak-ease-in-out),
      border-color var(--ak-duration-normal) var(--ak-ease-in-out),
      color var(--ak-duration-normal) var(--ak-ease-in-out),
      box-shadow var(--ak-duration-normal) var(--ak-ease-in-out),
      transform var(--ak-duration-fast) var(--ak-ease-in-out);
  }

  .ak-btn-interactive:hover {
    transform: translateY(-1px);
  }

  .ak-btn-interactive:active {
    transform: translateY(0) scale(0.98);
  }

  /* ── Card hover lift (antd-style) ─────────────── */

  .ak-card-hover {
    transition:
      background-color var(--ak-duration-normal) var(--ak-ease-in-out),
      box-shadow var(--ak-duration-normal) var(--ak-ease-in-out),
      transform var(--ak-duration-normal) var(--ak-ease-out);
  }

  .ak-card-hover:hover {
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
    transform: translateY(-1px);
  }

  /* ── Typewriter cursor ────────────────────────── */

  .ak-cursor {
    display: inline-block;
    width: 2px;
    height: 1em;
    background: currentColor;
    margin-left: 2px;
    vertical-align: text-bottom;
    animation: ak-typewriter-cursor 0.8s step-end infinite;
  }

  /* ── Stagger delay helpers ────────────────────── */

  /* ── Think component ─────────────────────────── */

  .ak-think {
    display: block;
  }

  .ak-think-status-wrapper {
    width: fit-content;
    display: flex;
    flex-direction: row;
    gap: 8px;
    align-items: center;
    font-size: 14px;
    color: var(--_muted-foreground, #6b7280);
    line-height: 1.5714;
    cursor: pointer;
    user-select: none;
    padding: 2px 0;
    transition: color 0.15s;
  }
  .ak-think-status-wrapper:hover {
    color: var(--_foreground, #1f2937);
  }

  .ak-think-status-icon {
    font-size: 16px;
    display: flex;
  }

  .ak-think-status-text {
    line-height: 1.5714;
    font-size: 14px;
  }

  .ak-think-status-down-icon {
    font-size: 12px;
    display: inline-flex;
    align-items: center;
  }
  .ak-think-status-down-icon svg {
    transition: all 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);
  }

  .ak-think-motion-blink {
    animation: ak-think-blink 1.2s step-end infinite;
  }
  @keyframes ak-think-blink {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.3; }
  }

  /* antd-x: .ant-think-content — left border timeline style */
  .ak-think-content {
    margin-top: 12px;
    width: 100%;
    color: var(--_muted-foreground, #6b7280);
    padding-inline-start: 12px;
    border-inline-start: 2px solid var(--_border, #e5e7eb);
  }

  /* ── Bubble component ────────────────────────── */

  /* antd-x: .ant-bubble-content — base */
  .ak-bubble-content {
    position: relative;
    box-sizing: border-box;
    min-width: 0;
    max-width: 100%;
    min-height: 46px;
    padding: 12px 16px;
    color: var(--_foreground, #1f2937);
    font-size: 14px;
    line-height: 1.5714;
    word-break: break-word;
  }

  /* antd-x: string content does NOT get pre-wrap — causes blank gaps */
  /* .ak-bubble-content-string — no white-space override */

  /* antd-x: variants */
  .ak-bubble-content-filled {
    background-color: var(--_muted, #f3f4f6);
  }
  .ak-bubble-content-outlined {
    border: 1px solid var(--_border, #e5e7eb);
  }
  .ak-bubble-content-shadow {
    box-shadow: 0 1px 2px 0 rgba(0,0,0,0.03), 0 1px 6px -1px rgba(0,0,0,0.02), 0 2px 4px 0 rgba(0,0,0,0.02);
  }
  .ak-bubble-content-borderless {
    background-color: transparent;
    padding: 0;
    min-height: 0;
  }

  /* antd-x: shapes */
  .ak-bubble-content-default {
    border-radius: 12px;
  }
  .ak-bubble-content-round {
    border-radius: 18px;
  }
  .ak-bubble-content-corner {
    border-radius: 12px;
  }
  .ak-bubble-content-corner-start {
    border-start-start-radius: 2px;
  }
  .ak-bubble-content-corner-end {
    border-start-end-radius: 2px;
  }

  /* antd-x: .ant-bubble-dot — loading dots */
  .ak-bubble-dot {
    position: relative;
    height: 32px;
    display: flex;
    align-items: center;
    column-gap: 8px;
    padding: 0 4px;
    align-self: center;
  }
  .ak-bubble-dot-item {
    background-color: var(--_primary, #1677ff);
    border-radius: 100%;
    width: 4px;
    height: 4px;
    animation: ak-loading-bounce 2s linear infinite;
  }
  .ak-bubble-dot-item:nth-child(1) { animation-delay: 0s; }
  .ak-bubble-dot-item:nth-child(2) { animation-delay: 0.2s; }
  .ak-bubble-dot-item:nth-child(3) { animation-delay: 0.4s; }

  /* antd-x: .ant-bubble-header */
  .ak-bubble-header {
    display: flex;
    margin-bottom: 4px;
    font-size: 14px;
    line-height: 1.5714;
    color: var(--_foreground, #1f2937);
  }

  /* antd-x: .ant-bubble-footer */
  .ak-bubble-footer {
    display: flex;
    margin-top: 16px;
    font-size: 14px;
    line-height: 1.5714;
    color: var(--_foreground, #1f2937);
  }
  .ak-bubble-footer-start { flex-direction: row; }
  .ak-bubble-footer-end { flex-direction: row-reverse; }

  /* antd-x: .ant-bubble-avatar */
  .ak-bubble-avatar {
    min-width: 32px;
  }

  /* antd-x: .ant-bubble-body */
  .ak-bubble-body {
    display: flex;
    flex-direction: column;
    max-width: 100%;
  }

  /* ── Stagger delay helpers ────────────────────── */

  .ak-stagger-1 { animation-delay: 50ms; }
  .ak-stagger-2 { animation-delay: 100ms; }
  .ak-stagger-3 { animation-delay: 150ms; }
  .ak-stagger-4 { animation-delay: 200ms; }
  .ak-stagger-5 { animation-delay: 250ms; }
  .ak-stagger-6 { animation-delay: 300ms; }
  .ak-stagger-7 { animation-delay: 350ms; }
  .ak-stagger-8 { animation-delay: 400ms; }
`);
