import { page, userEvent } from "vitest/browser";
import "@vitest/browser/matchers";
import { render } from "vitest-browser-lit";
import { html } from "lit";
import "@/folder.ts";
import type { FolderItem } from "@/folder.ts";

const items: FolderItem[] = [
  {
    key: "src",
    name: "src",
    type: "folder",
    children: [
      {
        key: "main.ts",
        name: "main.ts",
        type: "file",
        content: "console.log(1)",
      },
      {
        key: "util.ts",
        name: "util.ts",
        type: "file",
        content: "export const x = 1",
      },
    ],
  },
  { key: "readme.md", name: "README.md", type: "file", content: "# Hello" },
];

describe("AkFolder", () => {
  it("renders top-level item names", async () => {
    render(html`<ak-folder .items=${items}></ak-folder>`);
    await expect.element(page.getByText("src")).toBeInTheDocument();
    await expect.element(page.getByText("README.md")).toBeInTheDocument();
  });

  it("does not render children when folder is collapsed", async () => {
    render(html`<ak-folder .items=${items}></ak-folder>`);
    // main.ts is auto-selected and shown in preview header, so check util.ts instead
    await expect.element(page.getByText("util.ts")).not.toBeInTheDocument();
  });

  it("expands folder and shows children on click", async () => {
    render(html`<ak-folder .items=${items}></ak-folder>`);
    await userEvent.click(page.getByText("src"));
    // main.ts also appears in preview header (auto-selected), so only check util.ts
    await expect.element(page.getByText("util.ts")).toBeInTheDocument();
  });

  it("collapses folder on second click", async () => {
    render(html`<ak-folder .items=${items}></ak-folder>`);
    await userEvent.click(page.getByText("src"));
    await expect.element(page.getByText("util.ts")).toBeInTheDocument();
    await userEvent.click(page.getByText("src"));
    // main.ts stays in preview header (auto-selected), check util.ts absence in tree
    await expect.element(page.getByText("util.ts")).not.toBeInTheDocument();
  });

  it("dispatches select event on file click", async () => {
    let selectedKey = "";
    render(html`<ak-folder
      .items=${items}
      @select=${(e: Event) => {
        selectedKey = (e as CustomEvent).detail.key;
      }}
    ></ak-folder>`);
    await userEvent.click(page.getByText("README.md"));
    expect(selectedKey).toBe("readme.md");
  });

  it("auto-selects first file on connect", async () => {
    render(html`<ak-folder .items=${items}></ak-folder>`);
    // main.ts is the first file found (depth-first: src → main.ts)
    // Its name appears in the preview header since src is collapsed by default
    await expect
      .element(page.getByText("main.ts", { exact: true }))
      .toBeInTheDocument();
  });

  it("shows preview content for selected file", async () => {
    render(html`<ak-folder .items=${items}></ak-folder>`);
    // Auto-selected first file is main.ts (depth-first), content is "console.log(1)"
    await expect.element(page.getByText("console.log(1)")).toBeInTheDocument();
  });

  it("shows preview header with file name", async () => {
    render(html`<ak-folder .items=${items}></ak-folder>`);
    await expect
      .element(page.getByCSS(".ak-folder-preview-header-name"))
      .toBeInTheDocument();
  });

  it("shows 无预览 when selected file has no content", async () => {
    render(
      html`<ak-folder
        .items=${[
          { key: "empty.txt", name: "empty.txt", type: "file" as const },
        ]}
      ></ak-folder>`,
    );
    await expect.element(page.getByText("无预览")).toBeInTheDocument();
  });

  it("does not show preview panel when preview is false", async () => {
    // Use property binding (.preview) instead of boolean attribute (?preview)
    // because preview defaults to true; ?preview=${false} removes an attribute
    // that was never set, so the property retains its default true value
    render(html`<ak-folder .items=${items} .preview=${false}></ak-folder>`);
    await expect
      .element(page.getByCSS(".ak-folder-preview"))
      .not.toBeInTheDocument();
  });

  it("applies active class to selected file", async () => {
    render(
      html`<ak-folder .items=${items} active-key="readme.md"></ak-folder>`,
    );
    // README.md is the active file, check its button has active class
    const btn = page.getByRole("button", { name: "README.md" });
    await expect.element(btn).toHaveClass("ak-folder-tree-item-active");
  });

  it("applies chevron expanded class when folder is expanded", async () => {
    render(html`<ak-folder .items=${items}></ak-folder>`);
    await userEvent.click(page.getByText("src"));
    await expect
      .element(page.getByCSS(".ak-folder-tree-item-chevron-expanded"))
      .toBeInTheDocument();
  });
});
