import { html, nothing } from "lit";
import { customElement, property } from "lit/decorators.js";
import { cn } from "./shared/cn";
import { AkElement } from "./shared/base-element";

function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB", "TB", "PB"];
  const i = Math.min(
    Math.floor(Math.log(bytes) / Math.log(k)),
    sizes.length - 1,
  );
  return `${(bytes / k ** i).toFixed(i > 0 ? 1 : 0)} ${sizes[i]}`;
}

function getFileIcon(name: string): string {
  const ext = name.split(".").pop()?.toLowerCase() ?? "";
  const iconMap: Record<string, string> = {
    pdf: "📄",
    doc: "📝",
    docx: "📝",
    xls: "📊",
    xlsx: "📊",
    ppt: "📑",
    pptx: "📑",
    png: "🖼️",
    jpg: "🖼️",
    jpeg: "🖼️",
    gif: "🖼️",
    svg: "🖼️",
    mp4: "🎬",
    mp3: "🎵",
    zip: "📦",
    rar: "📦",
    js: "⚡",
    ts: "⚡",
    py: "🐍",
    html: "🌐",
    css: "🎨",
    json: "📋",
    md: "📝",
    txt: "📄",
  };
  return iconMap[ext] ?? "📄";
}

@customElement("ak-file-card")
export class AkFileCard extends AkElement {
  @property({ type: String })
  name = "";

  @property({ type: Number })
  size = 0;

  @property({ type: String })
  status: "pending" | "uploading" | "done" | "error" = "done";

  @property({ type: Number })
  progress = 0;

  @property({ type: Boolean })
  removable = false;

  private _handleRemove(e: Event) {
    e.stopPropagation();
    this.dispatchEvent(
      new CustomEvent("remove", {
        detail: { name: this.name },
        bubbles: true,
        composed: true,
      }),
    );
  }

  override render() {
    return html`
      <div
        class=${cn(
          "flex items-center gap-3 rounded-lg border border-border bg-card px-3 py-2",
          this.status === "error" && "border-destructive",
        )}
      >
        <!-- Icon -->
        <span class="shrink-0 text-lg">${getFileIcon(this.name)}</span>

        <!-- Info -->
        <div class="min-w-0 flex-1">
          <div class="truncate text-sm text-card-foreground">${this.name}</div>
          <div class="text-xs text-muted-foreground">
            ${this.status === "uploading"
              ? html`
                  <div
                    class="mt-1 h-1 w-full overflow-hidden rounded-full bg-muted"
                  >
                    <div
                      class="h-full rounded-full bg-primary transition-all"
                      style="width: ${this.progress}%"
                    ></div>
                  </div>
                `
              : this.status === "error"
                ? html`<span class="text-destructive">上传失败</span>`
                : formatFileSize(this.size)}
          </div>
        </div>

        <!-- Remove -->
        ${this.removable
          ? html`
              <button
                class="flex h-5 w-5 shrink-0 cursor-pointer items-center justify-center rounded border-0 bg-transparent text-muted-foreground transition-colors hover:text-foreground"
                @click=${this._handleRemove}
              >
                ✕
              </button>
            `
          : nothing}
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "ak-file-card": AkFileCard;
  }
}
