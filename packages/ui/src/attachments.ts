import { html, nothing } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { cn } from "@/shared/cn";
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
@customElement("ak-attachments")
export class AkAttachments extends AkElement {
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
      <div class="ak-attachments flex flex-col gap-2">
        <!-- Upload area -->
        ${canUpload
          ? html`
              <div
                class=${cn(
                  "flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed px-4 py-6 transition-colors duration-200",
                  this._dragOver
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/50",
                )}
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
                <span class="mb-2 text-muted-foreground">
                  ${icon("upload", 20)}
                </span>
                <span class="text-sm text-muted-foreground">
                  ${this.placeholder}
                </span>
                <input
                  type="file"
                  class="hidden"
                  accept=${this.accept}
                  ?multiple=${this.multiple}
                  @change=${this._handleFileInput}
                />
              </div>
            `
          : nothing}

        <!-- File list -->
        ${this.files.length > 0
          ? html`
              <div class="flex flex-col gap-1">
                ${this.files.map(
                  (file, i) => html`
                    <div
                      class="flex items-center gap-2 rounded-md border border-border bg-card px-3 py-1.5"
                    >
                      <span class="shrink-0 text-muted-foreground">
                        ${icon("file", 14)}
                      </span>
                      <span
                        class="min-w-0 flex-1 truncate text-sm text-card-foreground"
                      >
                        ${file.name}
                      </span>
                      ${file.status === "uploading"
                        ? html`<span class="text-xs text-primary"
                            >${file.progress ?? 0}%</span
                          >`
                        : nothing}
                      ${file.status === "error"
                        ? html`<span class="text-xs text-destructive"
                            >失败</span
                          >`
                        : nothing}
                      <button
                        class="flex h-4 w-4 shrink-0 cursor-pointer items-center justify-center rounded border-0 bg-transparent text-muted-foreground hover:text-foreground"
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
