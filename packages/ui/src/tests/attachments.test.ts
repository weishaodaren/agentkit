import { page, userEvent } from "vitest/browser";
import "@vitest/browser/matchers";
import { render } from "vitest-browser-lit";
import { html } from "lit";
import "@/attachments.ts";
import type { AttachmentFile } from "@/attachments.ts";

const files: AttachmentFile[] = [
  { name: "doc.pdf", size: 1024, status: "done" },
  { name: "img.png", size: 2048, status: "done" },
];

describe("AkAttachments", () => {
  it("renders dropzone with default placeholder", async () => {
    render(html`<ak-attachments .files=${files}></ak-attachments>`);
    await expect
      .element(page.getByText("拖拽文件到此处，或点击上传"))
      .toBeInTheDocument();
  });

  it("renders custom placeholder", async () => {
    render(
      html`<ak-attachments
        .files=${[]}
        placeholder="Click to upload"
      ></ak-attachments>`,
    );
    await expect.element(page.getByText("Click to upload")).toBeInTheDocument();
  });

  it("renders file names", async () => {
    render(html`<ak-attachments .files=${files}></ak-attachments>`);
    await expect.element(page.getByText("doc.pdf")).toBeInTheDocument();
    await expect.element(page.getByText("img.png")).toBeInTheDocument();
  });

  it("shows uploading progress percentage", async () => {
    render(
      html`<ak-attachments
        .files=${[
          {
            name: "upload.zip",
            size: 4096,
            status: "uploading" as const,
            progress: 75,
          },
        ]}
      ></ak-attachments>`,
    );
    await expect.element(page.getByText("75%")).toBeInTheDocument();
  });

  it("applies uploading status class", async () => {
    render(
      html`<ak-attachments
        .files=${[
          {
            name: "upload.zip",
            size: 4096,
            status: "uploading" as const,
            progress: 50,
          },
        ]}
      ></ak-attachments>`,
    );
    await expect
      .element(page.getByCSS(".ak-attachments-file-status-uploading"))
      .toBeInTheDocument();
  });

  it("shows error status text", async () => {
    render(
      html`<ak-attachments
        .files=${[{ name: "fail.txt", size: 100, status: "error" as const }]}
      ></ak-attachments>`,
    );
    await expect.element(page.getByText("失败")).toBeInTheDocument();
  });

  it("applies error status class", async () => {
    render(
      html`<ak-attachments
        .files=${[{ name: "fail.txt", size: 100, status: "error" as const }]}
      ></ak-attachments>`,
    );
    await expect
      .element(page.getByCSS(".ak-attachments-file-status-error"))
      .toBeInTheDocument();
  });

  it("dispatches remove event with index and file", async () => {
    let removedIndex = -1;
    let removedName = "";
    render(html`<ak-attachments
      .files=${files}
      @remove=${(e: Event) => {
        const detail = (e as CustomEvent).detail;
        removedIndex = detail.index;
        removedName = detail.file.name;
      }}
    ></ak-attachments>`);
    // Target first file's remove button to avoid strict mode multiple matches
    await userEvent.click(
      page.getByCSS(
        ".ak-attachments-file:first-child .ak-attachments-file-remove",
      ),
    );
    expect(removedIndex).toBe(0);
    expect(removedName).toBe("doc.pdf");
  });

  it("hides dropzone when maxCount is reached", async () => {
    render(
      html`<ak-attachments .files=${files} .maxCount=${2}></ak-attachments>`,
    );
    await expect
      .element(page.getByCSS(".ak-attachments-dropzone"))
      .not.toBeInTheDocument();
  });

  it("shows dropzone when under maxCount", async () => {
    render(
      html`<ak-attachments .files=${files} .maxCount=${5}></ak-attachments>`,
    );
    await expect
      .element(page.getByCSS(".ak-attachments-dropzone"))
      .toBeInTheDocument();
  });

  it("shows dropzone when maxCount is 0 (unlimited)", async () => {
    render(html`<ak-attachments .files=${files}></ak-attachments>`);
    await expect
      .element(page.getByCSS(".ak-attachments-dropzone"))
      .toBeInTheDocument();
  });

  it("does not render file list when files is empty", async () => {
    render(html`<ak-attachments .files=${[]}></ak-attachments>`);
    await expect
      .element(page.getByCSS(".ak-attachments-file-list"))
      .not.toBeInTheDocument();
  });
});
