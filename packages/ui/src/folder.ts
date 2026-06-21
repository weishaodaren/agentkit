import { html, nothing, type PropertyValues, type TemplateResult } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { cn } from "@/shared/cn";
import { AkElement } from "@/shared/base-element";
import { icon } from "@/shared/icons";

export interface FolderItem {
  key: string;
  name: string;
  type: "file" | "folder";
  children?: FolderItem[];
  /** File content or preview data */
  content?: string;
  /** File extension for icon selection */
  ext?: string;
}

/**
 * antd-x Folder 对标实现
 *
 * antd-x: File tree component based on antd Tree + Splitter.
 * Provides directory tree + file preview panel.
 *
 * Our implementation:
 *   - Recursive tree rendering with expand/collapse
 *   - File preview panel (right side)
 *   - File/folder icons based on type and extension
 */
@customElement("ak-folder")
export class AkFolder extends AkElement {
  @property({ type: Array })
  items: FolderItem[] = [];

  /** Currently selected file key */
  @property({ type: String, attribute: "active-key" })
  activeKey = "";

  /** Tree panel width (px) */
  @property({ type: Number, attribute: "tree-width" })
  treeWidth = 220;

  /** Show preview panel */
  @property({ type: Boolean })
  preview = true;

  @state()
  private _expandedKeys = new Set<string>();

  @state()
  private _selectedItem: FolderItem | null = null;

  override connectedCallback() {
    super.connectedCallback();
    // Auto-select first file if no activeKey
    if (!this.activeKey) {
      const firstFile = this._findFirstFile(this.items);
      if (firstFile) {
        this.activeKey = firstFile.key;
        this._selectedItem = firstFile;
      }
    }
  }

  override willUpdate(changed: PropertyValues) {
    // Sync _selectedItem BEFORE render to avoid change-in-update
    if (changed.has("activeKey") || changed.has("items")) {
      this._selectedItem = this._findItemByKey(this.items, this.activeKey);
    }
  }

  private _findFirstFile(items: FolderItem[]): FolderItem | null {
    for (const item of items) {
      if (item.type === "file") return item;
      if (item.children) {
        const found = this._findFirstFile(item.children);
        if (found) return found;
      }
    }
    return null;
  }

  private _findItemByKey(items: FolderItem[], key: string): FolderItem | null {
    for (const item of items) {
      if (item.key === key) return item;
      if (item.children) {
        const found = this._findItemByKey(item.children, key);
        if (found) return found;
      }
    }
    return null;
  }

  private _toggleExpand(key: string) {
    const next = new Set(this._expandedKeys);
    if (next.has(key)) {
      next.delete(key);
    } else {
      next.add(key);
    }
    this._expandedKeys = next;
  }

  private _selectItem(item: FolderItem) {
    if (item.type === "file") {
      this.activeKey = item.key;
      this._selectedItem = item;
      this.dispatchEvent(
        new CustomEvent("select", {
          detail: { key: item.key, item },
          bubbles: true,
          composed: true,
        }),
      );
    } else {
      this._toggleExpand(item.key);
    }
  }

  private _getFileIcon(item: FolderItem): string {
    if (item.type === "folder") {
      return this._expandedKeys.has(item.key) ? "folder-open" : "folder";
    }
    const ext = item.ext || item.name.split(".").pop()?.toLowerCase() || "";
    const iconMap: Record<string, string> = {
      ts: "file-code",
      tsx: "file-code",
      js: "file-code",
      jsx: "file-code",
      html: "file-code",
      css: "file-code",
      py: "file-code",
      json: "file-json",
      md: "file-text",
      txt: "file-text",
      png: "image",
      jpg: "image",
      svg: "image",
    };
    return iconMap[ext] || "file";
  }

  private _renderTree(
    items: FolderItem[],
    depth: number = 0,
  ): TemplateResult[] {
    return items.map(
      (item) => html`
        <div>
          <button
            class=${cn(
              "flex w-full cursor-pointer items-center gap-1.5 rounded-md border-0 bg-transparent py-1 pl-2 pr-1 text-left text-sm transition-colors",
              item.key === this.activeKey
                ? "bg-accent text-accent-foreground"
                : "text-foreground hover:bg-accent/50",
            )}
            style="padding-left: ${depth * 16 + 8}px;"
            @click=${() => this._selectItem(item)}
          >
            ${item.type === "folder"
              ? html`<span
                  class="shrink-0 text-muted-foreground transition-transform duration-150 ${this._expandedKeys.has(
                    item.key,
                  )
                    ? "rotate-90"
                    : ""}"
                >
                  ${icon("chevron-right", 12)}
                </span>`
              : html`<span class="w-3 shrink-0"></span>`}
            <span class="shrink-0 text-muted-foreground">
              ${icon(this._getFileIcon(item), 14)}
            </span>
            <span
              class="min-w-0 flex-1 overflow-hidden text-ellipsis whitespace-nowrap"
            >
              ${item.name}
            </span>
          </button>
          ${item.type === "folder" &&
          this._expandedKeys.has(item.key) &&
          item.children
            ? html`<div>${this._renderTree(item.children, depth + 1)}</div>`
            : nothing}
        </div>
      `,
    );
  }

  override render() {
    return html`
      <div
        class="ak-folder flex h-full overflow-hidden rounded-lg border border-border"
      >
        <!-- Tree panel -->
        <div
          class="overflow-y-auto border-r border-border bg-muted/20 p-2 scrollbar-thin"
          style="width: ${this.treeWidth}px; min-width: ${this.treeWidth}px;"
        >
          ${this._renderTree(this.items)}
        </div>

        <!-- Preview panel -->
        ${this.preview
          ? html`
              <div class="flex min-w-0 flex-1 flex-col">
                ${this._selectedItem
                  ? html`
                      <!-- File header -->
                      <div
                        class="flex items-center gap-2 border-b border-border px-4 py-2"
                      >
                        <span class="text-muted-foreground">
                          ${icon(this._getFileIcon(this._selectedItem), 14)}
                        </span>
                        <span class="text-sm font-medium text-foreground">
                          ${this._selectedItem.name}
                        </span>
                      </div>
                      <!-- File content -->
                      <div class="flex-1 overflow-auto p-4">
                        <slot name="preview">
                          ${this._selectedItem.content
                            ? html`<pre
                                class="text-sm leading-6 text-card-foreground"
                              ><code>${this._selectedItem.content}</code></pre>`
                            : html`<div class="text-sm text-muted-foreground">
                                无预览
                              </div>`}
                        </slot>
                      </div>
                    `
                  : html`<div
                      class="flex flex-1 items-center justify-center text-sm text-muted-foreground"
                    >
                      选择文件以预览
                    </div>`}
              </div>
            `
          : nothing}
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "ak-folder": AkFolder;
  }
}
