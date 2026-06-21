import { css, html, nothing, type CSSResult } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { AkElement } from "@/shared/base-element";
import { icon } from "@/shared/icons";

export interface AttachmentFile {
  name: string;
  size: number;
  type?: string;
  status?: "pending" | "uploading" | "done" | "error";
  progress?: number;
  thumb?: string;
}

/**
 * antd-x Attachments 对标实现
 *
 * antd-x: Based on antd Upload, provides file upload area with drag-and-drop.
 * Our implementation: Native drag-and-drop + file input, integrates with FileCard.
 *
 * Features:
 *   - Drag-and-drop upload area
 *   - File list display
 *   - accept filter
 *   - multiple selection
 */
const attachmentsCSS: CSSResult = css`
  .ak-attachments {
    display: flex;
    flex-direction: column;
    gap: var(--ak-padding-xs, 8px);
  }
  .ak-attachments-dropzone {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: var(--ak-padding-lg, 24px) var(--ak-padding, 16px);
    border-radius: var(--ak-border-radius-md, 8px);
    border: var(--ak-line-width-bold, 2px) dashed
      var(--ak-color-border, #d9d9d9);
    cursor: pointer;
    transition: all var(--ak-duration-mid, 200ms);
  }
  .ak-attachments-dropzone:hover {
    border-color: color-mix(
      in srgb,
      var(--ak-color-primary, #1677ff) 50%,
      transparent
    );
  }
  .ak-attachments-dropzone-active {
    border-color: var(--ak-color-primary, #1677ff);
    background: var(--ak-color-primary-bg, #e6f4ff);
  }
  .ak-attachments-dropzone-icon {
    margin-bottom: var(--ak-padding-xs, 8px);
    color: var(--ak-color-text-secondary, rgba(0, 0, 0, 0.65));
  }
  .ak-attachments-dropzone-text {
    font-size: var(--ak-font-size, 14px);
    color: var(--ak-color-text-secondary, rgba(0, 0, 0, 0.65));
  }
  .ak-attachments-input {
    display: none;
  }
  .ak-attachments-file-list {
    display: flex;
    flex-direction: column;
    gap: var(--ak-padding-xxs, 4px);
  }
  .ak-attachments-file {
    display: flex;
    align-items: center;
    gap: var(--ak-padding-xs, 8px);
    padding: var(--ak-padding-xxs, 4px) var(--ak-padding-sm, 12px);
    border-radius: var(--ak-border-radius-sm, 4px);
    border: var(--ak-line-width, 1px) solid var(--ak-color-border, #d9d9d9);
    background: var(--ak-color-bg-container, #fff);
  }
  .ak-attachments-file-icon {
    flex-shrink: 0;
    color: var(--ak-color-text-secondary, rgba(0, 0, 0, 0.65));
  }
  .ak-attachments-file-name {
    min-width: 0;
    flex: 1;
    font-size: var(--ak-font-size, 14px);
    color: var(--ak-color-text, rgba(0, 0, 0, 0.88));
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .ak-attachments-file-status {
    font-size: var(--ak-font-size-sm, 12px);
  }
  .ak-attachments-file-status-uploading {
    color: var(--ak-color-primary, #1677ff);
  }
  .ak-attachments-file-status-error {
    color: var(--ak-color-error, #ff4d4f);
  }
  .ak-attachments-file-remove {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 16px;
    height: 16px;
    flex-shrink: 0;
    border-radius: var(--ak-border-radius-sm, 4px);
    border: none;
    background: transparent;
    cursor: pointer;
    color: var(--ak-color-text-secondary, rgba(0, 0, 0, 0.65));
    transition: color var(--ak-duration-mid, 200ms);
  }
  .ak-attachments-file-remove:hover {
    color: var(--ak-color-text, rgba(0, 0, 0, 0.88));
  }
`;

@customElement("ak-attachments")
export class AkAttachments extends AkElement {
  static override styles = [attachmentsCSS];
  @property({ type: Array })
  files: AttachmentFile[] = [];

  /** Accept file types (e.g. "image/*,.pdf") */
  @property({ type: String })
  accept = "";

  /** Allow multiple file selection */
  @property({ type: Boolean })
  multiple = false;

  /** Maximum file count */
  @property({ type: Number, attribute: "max-count" })
  maxCount = 0;

  /** Placeholder text */
  @property({ type: String })
  placeholder = "拖拽文件到此处，或点击上传";

  @state()
  private _dragOver = false;

  private _handleDragOver(e: DragEvent) {
    e.preventDefault();
    e.stopPropagation();
    this._dragOver = true;
  }

  private _handleDragLeave(e: DragEvent) {
    e.preventDefault();
    e.stopPropagation();
    this._dragOver = false;
  }

  private _handleDrop(e: DragEvent) {
    e.preventDefault();
    e.stopPropagation();
    this._dragOver = false;
    const files = e.dataTransfer?.files;
    if (files && files.length > 0) {
      this._emitFiles(Array.from(files));
    }
  }

  private _handleFileInput(e: Event) {
    const target = e.target as HTMLInputElement;
    if (target.files && target.files.length > 0) {
      this._emitFiles(Array.from(target.files));
      target.value = ""; // Reset for re-selection
    }
  }

  private _emitFiles(fileList: File[]) {
    const attachments: AttachmentFile[] = fileList.map((f) => ({
      name: f.name,
      size: f.size,
      type: f.type,
      status: "pending" as const,
    }));
    this.dispatchEvent(
      new CustomEvent("upload", {
        detail: { files: attachments, rawFiles: fileList },
        bubbles: true,
        composed: true,
      }),
    );
  }

  private _handleRemove(index: number) {
    const file = this.files[index];
    this.dispatchEvent(
      new CustomEvent("remove", {
        detail: { index, file },
        bubbles: true,
        composed: true,
      }),
    );
  }

  override render() {
    const canUpload = this.maxCount === 0 || this.files.length < this.maxCount;

    return html`
      <div class="ak-attachments">
        ${canUpload
          ? html`
              <div
                class="ak-attachments-dropzone ${this._dragOver
                  ? "ak-attachments-dropzone-active"
                  : ""}"
                @dragover=${this._handleDragOver}
                @dragleave=${this._handleDragLeave}
                @drop=${this._handleDrop}
                @click=${() => {
                  const input = this.shadowRoot?.querySelector(
                    'input[type="file"]',
                  ) as HTMLInputElement;
                  input?.click();
                }}
              >
                <span class="ak-attachments-dropzone-icon"
                  >${icon("upload", 20)}</span
                >
                <span class="ak-attachments-dropzone-text"
                  >${this.placeholder}</span
                >
                <input
                  type="file"
                  class="ak-attachments-input"
                  accept=${this.accept}
                  ?multiple=${this.multiple}
                  @change=${this._handleFileInput}
                />
              </div>
            `
          : nothing}
        ${this.files.length > 0
          ? html`
              <div class="ak-attachments-file-list">
                ${this.files.map(
                  (file, i) => html`
                    <div class="ak-attachments-file">
                      <span class="ak-attachments-file-icon"
                        >${icon("file", 14)}</span
                      >
                      <span class="ak-attachments-file-name">${file.name}</span>
                      ${file.status === "uploading"
                        ? html`<span
                            class="ak-attachments-file-status ak-attachments-file-status-uploading"
                            >${file.progress ?? 0}%</span
                          >`
                        : nothing}
                      ${file.status === "error"
                        ? html`<span
                            class="ak-attachments-file-status ak-attachments-file-status-error"
                            >失败</span
                          >`
                        : nothing}
                      <button
                        class="ak-attachments-file-remove"
                        @click=${() => this._handleRemove(i)}
                      >
                        ${icon("x", 12)}
                      </button>
                    </div>
                  `,
                )}
              </div>
            `
          : nothing}
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "ak-attachments": AkAttachments;
  }
}
