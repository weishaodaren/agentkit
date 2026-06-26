import { page, userEvent } from "vitest/browser";
import "@vitest/browser/matchers";
import { render } from "vitest-browser-lit";
import { html } from "lit";
import "@/file-card.ts";

describe("AkFileCard", () => {
  it("renders file name", async () => {
    render(html`<ak-file-card name="report.pdf"></ak-file-card>`);
    await expect.element(page.getByText("report.pdf")).toBeInTheDocument();
  });

  it("formats file size for done status", async () => {
    render(
      html`<ak-file-card
        name="f.txt"
        .size=${1024}
        status="done"
      ></ak-file-card>`,
    );
    await expect.element(page.getByText("1.0 KB")).toBeInTheDocument();
  });

  it("formats 0 bytes as 0 B", async () => {
    render(html`<ak-file-card name="empty.bin" .size=${0}></ak-file-card>`);
    await expect.element(page.getByText("0 B")).toBeInTheDocument();
  });

  it("formats MB correctly", async () => {
    render(html`<ak-file-card name="big.zip" .size=${1048576}></ak-file-card>`);
    await expect.element(page.getByText("1.0 MB")).toBeInTheDocument();
  });

  it("shows progress bar for uploading status", async () => {
    render(html`<ak-file-card
      name="upload.zip"
      status="uploading"
      .progress=${50}
    ></ak-file-card>`);
    await expect
      .element(page.getByCSS(".ak-file-card-progress"))
      .toBeInTheDocument();
    await expect
      .element(page.getByCSS(".ak-file-card-progress-bar"))
      .toBeInTheDocument();
  });

  it("shows error text for error status", async () => {
    render(html`<ak-file-card name="fail.txt" status="error"></ak-file-card>`);
    await expect.element(page.getByText("上传失败")).toBeInTheDocument();
  });

  it("applies error class for error status", async () => {
    render(html`<ak-file-card name="fail.txt" status="error"></ak-file-card>`);
    await expect
      .element(page.getByCSS(".ak-file-card"))
      .toHaveClass("ak-file-card-error");
  });

  it("does not apply error class for done status", async () => {
    render(html`<ak-file-card name="ok.txt" status="done"></ak-file-card>`);
    await expect
      .element(page.getByCSS(".ak-file-card"))
      .not.toHaveClass("ak-file-card-error");
  });

  it("shows thumbnail img when thumb and type is image", async () => {
    render(html`<ak-file-card
      name="photo.jpg"
      type="image"
      thumb="https://img.test/photo.jpg"
    ></ak-file-card>`);
    await expect.element(page.getByAltText("photo.jpg")).toBeInTheDocument();
  });

  it("does not show thumbnail when type is file", async () => {
    render(html`<ak-file-card
      name="doc.pdf"
      type="file"
      thumb="https://img.test/doc.jpg"
    ></ak-file-card>`);
    await expect.element(page.getByAltText("doc.pdf")).not.toBeInTheDocument();
  });

  it("shows file icon when no thumb", async () => {
    render(html`<ak-file-card name="doc.pdf" type="file"></ak-file-card>`);
    await expect
      .element(page.getByCSS(".ak-file-card-icon"))
      .toBeInTheDocument();
  });

  it("renders remove button when removable is true", async () => {
    render(html`<ak-file-card name="f.txt" ?removable=${true}></ak-file-card>`);
    await expect
      .element(page.getByCSS(".ak-file-card-remove"))
      .toBeInTheDocument();
  });

  it("does not render remove button when removable is false", async () => {
    render(html`<ak-file-card name="f.txt"></ak-file-card>`);
    await expect
      .element(page.getByCSS(".ak-file-card-remove"))
      .not.toBeInTheDocument();
  });

  it("dispatches remove event with name on remove click", async () => {
    let removedName = "";
    render(html`<ak-file-card
      name="deleteme.txt"
      ?removable=${true}
      @remove=${(e: Event) => {
        removedName = (e as CustomEvent).detail.name;
      }}
    ></ak-file-card>`);
    await userEvent.click(page.getByCSS(".ak-file-card-remove"));
    expect(removedName).toBe("deleteme.txt");
  });

  it("shows mask overlay text when mask is true", async () => {
    render(html`<ak-file-card
      name="photo.jpg"
      type="image"
      thumb="https://img.test/p.jpg"
      ?mask=${true}
    ></ak-file-card>`);
    await expect.element(page.getByText("查看")).toBeInTheDocument();
  });
});
