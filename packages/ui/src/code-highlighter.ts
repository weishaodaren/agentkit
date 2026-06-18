import { html, nothing } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { cn } from "./shared/cn";
import { AkElement } from "./shared/base-element";

@customElement("ak-code-highlighter")
export class AkCodeHighlighter extends AkElement {
  @property({ type: String })
  code = "";

  @property({ type: String })
  language = "";

  @property({ type: Boolean })
  showLineNumbers = false;

  @state()
  private _copied = false;

  private async _handleCopy() {
    try {
      await navigator.clipboard.writeText(this.code);
      this._copied = true;
      this.dispatchEvent(
        new CustomEvent("copy", {
          detail: { code: this.code },
          bubbles: true,
          composed: true,
        }),
      );
      setTimeout(() => {
        this._copied = false;
      }, 2000);
    } catch {
      // Fallback for non-secure contexts
      const textarea = document.createElement("textarea");
      textarea.value = this.code;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      this._copied = true;
      this.dispatchEvent(
        new CustomEvent("copy", {
          detail: { code: this.code },
          bubbles: true,
          composed: true,
        }),
      );
      setTimeout(() => {
        this._copied = false;
      }, 2000);
    }
  }

  private get _lines() {
    return this.code.split("\n");
  }

  override render() {
    const lines = this._lines;

    return html`
      <div
        class="relative overflow-hidden rounded-lg border border-border bg-muted/30"
      >
        <!-- Header -->
        <div
          class="flex items-center justify-between border-b border-border bg-muted/50 px-4 py-1.5"
        >
          <span class="text-xs text-muted-foreground"
            >${this.language || "text"}</span
          >
          <button
            class=${cn(
              "inline-flex cursor-pointer items-center gap-1 rounded border-0 bg-transparent px-2 py-0.5 text-xs transition-colors",
              this._copied
                ? "text-green-600"
                : "text-muted-foreground hover:text-foreground",
            )}
            @click=${this._handleCopy}
          >
            ${this._copied ? "✓ 已复制" : "复制"}
          </button>
        </div>

        <!-- Code -->
        <pre class="overflow-x-auto p-4 text-sm leading-6"><code>${this
          .showLineNumbers
          ? lines.map(
              (line, i) =>
                html`<div class="flex">
                  <span
                    class="mr-4 inline-block w-6 shrink-0 select-none text-right text-muted-foreground/50"
                    >${i + 1}</span
                  ><span>${line}</span>
                </div>`,
            )
          : this.code}</code></pre>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "ak-code-highlighter": AkCodeHighlighter;
  }
}
