import { html, nothing } from "lit";
import { customElement, property } from "lit/decorators.js";
import { cn } from "@/shared/cn";
import { AkElement } from "@/shared/base-element";
import { icon } from "@/shared/icons";

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
    pdf: "file-text",
    doc: "file-text",
    docx: "file-text",
    xls: "table",
    xlsx: "table",
    ppt: "presentation",
    pptx: "presentation",
    png: "image",
    jpg: "image",
    jpeg: "image",
    gif: "image",
    svg: "image",
    mp4: "video",
    mp3: "music",
    zip: "archive",
    rar: "archive",
    js: "file-code",
    ts: "file-code",
    py: "file-code",
    html: "file-code",
    css: "file-code",
    json: "file-json",
    md: "file-text",
    txt: "file",
  };
  return iconMap[ext] ?? "file";
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
          "ak-motion-slide-up ak-card-hover flex items-center gap-3 rounded-lg border border-border bg-card px-3 py-2",
          this.status === "error" && "border-destructive",
        )}
      >
        <!-- Icon -->
        <span class="shrink-0 text-muted-foreground"
          >${icon(getFileIcon(this.name), 18)}</span
        >

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
                ? html`<span class="flex items-center gap-1 text-destructive"
                    >${icon("circle-x", 12)} 上传失败</span
                  >`
                : formatFileSize(this.size)}
          </div>
        </div>

        <!-- Remove -->
        ${this.removable
          ? html`
              <button
                class="ak-btn-interactive flex h-5 w-5 shrink-0 cursor-pointer items-center justify-center rounded border-0 bg-transparent text-muted-foreground hover:text-foreground"
                @click=${this._handleRemove}
              >
                ${icon("x", 14)}
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
