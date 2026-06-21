import { css, html, nothing, type CSSResult } from "lit";
import { customElement, property } from "lit/decorators.js";
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
const fileCardCSS: CSSResult = css`
  .ak-file-card {
    display: flex;
    align-items: center;
    gap: var(--ak-padding-sm, 12px);
    padding: var(--ak-padding-xs, 8px) var(--ak-padding-sm, 12px);
    border-radius: var(--ak-border-radius-md, 8px);
    border: var(--ak-line-width, 1px) solid var(--ak-color-border, #d9d9d9);
    background: var(--ak-color-bg-container, #fff);
    transition: all var(--ak-duration-mid, 200ms) var(--ak-ease-in-out);
  }
  .ak-file-card:hover {
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
    transform: translateY(-1px);
  }
  .ak-file-card-error {
    border-color: var(--ak-color-error, #ff4d4f);
  }
  .ak-file-card-thumb {
    position: relative;
    flex-shrink: 0;
  }
  .ak-file-card-thumb img {
    width: 40px;
    height: 40px;
    border-radius: var(--ak-border-radius-sm, 4px);
    object-fit: cover;
  }
  .ak-file-card-mask {
    position: absolute;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: var(--ak-border-radius-sm, 4px);
    background: rgba(0, 0, 0, 0.4);
    opacity: 0;
    transition: opacity var(--ak-duration-mid, 200ms);
  }
  .ak-file-card:hover .ak-file-card-mask {
    opacity: 1;
  }
  .ak-file-card-mask span {
    font-size: var(--ak-font-size-sm, 12px);
    color: #fff;
  }
  .ak-file-card-icon {
    flex-shrink: 0;
    color: var(--ak-color-text-secondary, rgba(0, 0, 0, 0.65));
  }
  .ak-file-card-body {
    min-width: 0;
    flex: 1;
  }
  .ak-file-card-name {
    font-size: var(--ak-font-size, 14px);
    color: var(--ak-color-text, rgba(0, 0, 0, 0.88));
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .ak-file-card-meta {
    font-size: var(--ak-font-size-sm, 12px);
    color: var(--ak-color-text-secondary, rgba(0, 0, 0, 0.65));
  }
  .ak-file-card-progress {
    margin-top: 4px;
    height: 4px;
    width: 100%;
    border-radius: 2px;
    background: var(--ak-color-fill-content, rgba(0, 0, 0, 0.04));
    overflow: hidden;
  }
  .ak-file-card-progress-bar {
    height: 100%;
    border-radius: 2px;
    background: var(--ak-color-primary, #1677ff);
    transition: width var(--ak-duration-mid, 200ms);
  }
  .ak-file-card-error-text {
    display: flex;
    align-items: center;
    gap: 4px;
    color: var(--ak-color-error, #ff4d4f);
  }
  .ak-file-card-remove {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 20px;
    height: 20px;
    flex-shrink: 0;
    border-radius: var(--ak-border-radius-sm, 4px);
    border: none;
    background: transparent;
    cursor: pointer;
    color: var(--ak-color-text-secondary, rgba(0, 0, 0, 0.65));
    transition: all var(--ak-duration-mid, 200ms);
  }
  .ak-file-card-remove:hover {
    color: var(--ak-color-text, rgba(0, 0, 0, 0.88));
  }
`;

@customElement("ak-file-card")
export class AkFileCard extends AkElement {
  static override styles = [fileCardCSS];
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
        class="ak-file-card ${this.status === "error"
          ? "ak-file-card-error"
          : ""}"
      >
        <!-- Icon / Thumbnail -->
        ${this.thumb && (this.type === "image" || this.type === "video")
          ? html`<div class="ak-file-card-thumb">
              <img src=${this.thumb} alt=${this.name} />
              ${this.mask
                ? html`<div class="ak-file-card-mask"><span>查看</span></div>`
                : nothing}
            </div>`
          : html`<span class="ak-file-card-icon"
              >${icon(getFileIcon(this.name, this.type), 18)}</span
            >`}

        <!-- Info -->
        <div class="ak-file-card-body">
          <div class="ak-file-card-name">${this.name}</div>
          <div class="ak-file-card-meta">
            ${this.status === "uploading"
              ? html`<div class="ak-file-card-progress">
                  <div
                    class="ak-file-card-progress-bar"
                    style="width: ${this.progress}%"
                  ></div>
                </div>`
              : this.status === "error"
                ? html`<span class="ak-file-card-error-text"
                    >${icon("circle-x", 12)} 上传失败</span
                  >`
                : formatFileSize(this.size)}
          </div>
        </div>

        <!-- Remove -->
        ${this.removable
          ? html`<button
              class="ak-file-card-remove"
              @click=${this._handleRemove}
            >
              ${icon("x", 14)}
            </button>`
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
