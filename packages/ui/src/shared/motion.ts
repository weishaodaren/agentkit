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

  .ak-stagger-1 { animation-delay: 50ms; }
  .ak-stagger-2 { animation-delay: 100ms; }
  .ak-stagger-3 { animation-delay: 150ms; }
  .ak-stagger-4 { animation-delay: 200ms; }
  .ak-stagger-5 { animation-delay: 250ms; }
  .ak-stagger-6 { animation-delay: 300ms; }
  .ak-stagger-7 { animation-delay: 350ms; }
  .ak-stagger-8 { animation-delay: 400ms; }
`);
