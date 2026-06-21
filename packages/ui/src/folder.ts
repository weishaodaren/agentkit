import {
  css,
  html,
  nothing,
  type PropertyValues,
  type TemplateResult,
  type CSSResult,
} from "lit";
import { customElement, property, state } from "lit/decorators.js";
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
const folderCSS: CSSResult = css`
  .ak-folder {
    display: flex;
    height: 100%;
    overflow: hidden;
    border-radius: var(--ak-border-radius-md, 8px);
    border: var(--ak-line-width, 1px) solid var(--ak-color-border, #d9d9d9);
  }
  .ak-folder-tree {
    overflow-y: auto;
    border-right: var(--ak-line-width, 1px) solid
      var(--ak-color-border, #d9d9d9);
    background: var(--ak-color-fill-content, rgba(0, 0, 0, 0.04));
    padding: var(--ak-padding-xs, 8px);
  }
  .ak-folder-tree-item {
    display: flex;
    align-items: center;
    gap: var(--ak-padding-xxs, 4px);
    padding: var(--ak-padding-xxs, 4px) var(--ak-padding-xxs, 4px);
    border-radius: var(--ak-border-radius-sm, 4px);
    border: none;
    background: transparent;
    font-size: var(--ak-font-size, 14px);
    color: var(--ak-color-text, rgba(0, 0, 0, 0.88));
    text-align: left;
    cursor: pointer;
    width: 100%;
    transition: background var(--ak-duration-mid, 200ms);
  }
  .ak-folder-tree-item:hover {
    background: var(--ak-color-bg-text-hover, rgba(0, 0, 0, 0.04));
  }
  .ak-folder-tree-item-active {
    background: var(--ak-color-fill-content, rgba(0, 0, 0, 0.04));
  }
  .ak-folder-tree-item-icon {
    flex-shrink: 0;
    color: var(--ak-color-text-secondary, rgba(0, 0, 0, 0.65));
  }
  .ak-folder-tree-item-chevron {
    flex-shrink: 0;
    color: var(--ak-color-text-secondary, rgba(0, 0, 0, 0.65));
    transition: transform var(--ak-duration-mid, 200ms);
  }
  .ak-folder-tree-item-chevron-expanded {
    transform: rotate(90deg);
  }
  .ak-folder-tree-item-name {
    min-width: 0;
    flex: 1;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .ak-folder-preview {
    display: flex;
    flex-direction: column;
    min-width: 0;
    flex: 1;
  }
  .ak-folder-preview-header {
    display: flex;
    align-items: center;
    gap: var(--ak-padding-xs, 8px);
    padding: var(--ak-padding-xs, 8px) var(--ak-padding, 16px);
    border-bottom: var(--ak-line-width, 1px) solid
      var(--ak-color-border, #d9d9d9);
  }
  .ak-folder-preview-header-icon {
    color: var(--ak-color-text-secondary, rgba(0, 0, 0, 0.65));
  }
  .ak-folder-preview-header-name {
    font-size: var(--ak-font-size, 14px);
    font-weight: 500;
    color: var(--ak-color-text, rgba(0, 0, 0, 0.88));
  }
  .ak-folder-preview-content {
    flex: 1;
    overflow: auto;
    padding: var(--ak-padding, 16px);
  }
  .ak-folder-preview-content pre {
    font-size: var(--ak-font-size, 14px);
    line-height: 1.5;
    color: var(--ak-color-text, rgba(0, 0, 0, 0.88));
    margin: 0;
  }
  .ak-folder-preview-empty {
    display: flex;
    flex: 1;
    align-items: center;
    justify-content: center;
    font-size: var(--ak-font-size, 14px);
    color: var(--ak-color-text-secondary, rgba(0, 0, 0, 0.65));
  }
`;

@customElement("ak-folder")
export class AkFolder extends AkElement {
  static override styles = [folderCSS];
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
            class="ak-folder-tree-item ${item.key === this.activeKey
              ? "ak-folder-tree-item-active"
              : ""}"
            style="padding-left: ${depth * 16 + 8}px;"
            @click=${() => this._selectItem(item)}
          >
            ${item.type === "folder"
              ? html`<span
                  class="ak-folder-tree-item-chevron ${this._expandedKeys.has(
                    item.key,
                  )
                    ? "ak-folder-tree-item-chevron-expanded"
                    : ""}"
                >
                  ${icon("chevron-right", 12)}
                </span>`
              : html`<span style="width:12px;flex-shrink:0;"></span>`}
            <span class="ak-folder-tree-item-icon">
              ${icon(this._getFileIcon(item), 14)}
            </span>
            <span class="ak-folder-tree-item-name">${item.name}</span>
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
      <div class="ak-folder">
        <!-- Tree panel -->
        <div
          class="ak-folder-tree"
          style="width: ${this.treeWidth}px; min-width: ${this.treeWidth}px;"
        >
          ${this._renderTree(this.items)}
        </div>

        <!-- Preview panel -->
        ${this.preview
          ? html`
              <div class="ak-folder-preview">
                ${this._selectedItem
                  ? html`
                      <div class="ak-folder-preview-header">
                        <span class="ak-folder-preview-header-icon"
                          >${icon(
                            this._getFileIcon(this._selectedItem),
                            14,
                          )}</span
                        >
                        <span class="ak-folder-preview-header-name"
                          >${this._selectedItem.name}</span
                        >
                      </div>
                      <div class="ak-folder-preview-content">
                        <slot name="preview">
                          ${this._selectedItem.content
                            ? html`<pre><code>${this._selectedItem
                                .content}</code></pre>`
                            : html`<div class="ak-folder-preview-empty">
                                无预览
                              </div>`}
                        </slot>
                      </div>
                    `
                  : html`<div class="ak-folder-preview-empty">
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
