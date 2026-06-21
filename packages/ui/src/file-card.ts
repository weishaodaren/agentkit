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

function getFileIcon(name: string, type?: string): string {
  // antd-x: IMAGE/VIDEO/AUDIO/FILE types
  if (type === "image") return "image";
  if (type === "video") return "video";
  if (type === "audio") return "music";

  const ext = name.split(".").pop()?.toLowerCase() ?? "";
  // antd-x: 13 preset file icons
  const iconMap: Record<string, string> = {
    pdf: "file-text",
    doc: "file-text",
    docx: "file-text",
    xls: "table",
    xlsx: "table",
    csv: "table",
    ppt: "presentation",
    pptx: "presentation",
    png: "image",
    jpg: "image",
    jpeg: "image",
    gif: "image",
    svg: "image",
    webp: "image",
    mp4: "video",
    avi: "video",
    mov: "video",
    mp3: "music",
    wav: "music",
    zip: "archive",
    rar: "archive",
    "7z": "archive",
    js: "file-code",
    ts: "file-code",
    jsx: "file-code",
    tsx: "file-code",
    py: "file-code",
    html: "file-code",
    css: "file-code",
    json: "file-json",
    md: "file-text",
    txt: "file",
    xml: "file-code",
    yaml: "file-code",
    yml: "file-code",
  };
  return iconMap[ext] ?? "file";
}

/**
 * antd-x FileCard 对标实现
 *
 * antd-x types: IMAGE / VIDEO / AUDIO / FILE
 * antd-x features: 13 preset file icons, mask hover overlay
 */
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

  /** antd-x: file type (image/video/audio/file) */
  @property({ type: String })
  type: "image" | "video" | "audio" | "file" = "file";

  /** Image/video thumbnail URL */
  @property({ type: String })
  thumb = "";

  /** Whether to show mask overlay on hover */
  @property({ type: Boolean })
  mask = false;

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
          "ak-motion-slide-up ak-card-hover group flex items-center gap-3 rounded-lg border border-border bg-card px-3 py-2",
          this.status === "error" && "border-destructive",
        )}
      >
        <!-- Icon / Thumbnail -->
        ${this.thumb && (this.type === "image" || this.type === "video")
          ? html`<div class="relative shrink-0">
              <img
                src=${this.thumb}
                alt=${this.name}
                class="h-10 w-10 rounded object-cover"
              />
              ${this.mask
                ? html`<div
                    class="ak-file-card-mask absolute inset-0 flex items-center justify-center rounded bg-black/40 opacity-0 transition-opacity duration-200 group-hover:opacity-100"
                  >
                    <span class="text-xs text-white">查看</span>
                  </div>`
                : nothing}
            </div>`
          : html`<span class="shrink-0 text-muted-foreground"
              >${icon(getFileIcon(this.name, this.type), 18)}</span
            >`}

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
