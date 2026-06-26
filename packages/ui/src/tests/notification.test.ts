import { page, userEvent } from "vitest/browser";
import "@vitest/browser/matchers";
import { render } from "vitest-browser-lit";
import { html } from "lit";
import "@/notification.ts";
import { AkNotification } from "@/notification.ts";

async function getNotification() {
  render(html`<ak-notification></ak-notification>`);
  return (await page
    .getByCSS("ak-notification")
    .findElement()) as AkNotification;
}

describe("AkNotification", () => {
  it("renders nothing when no toasts", async () => {
    render(html`<ak-notification></ak-notification>`);
    await expect
      .element(page.getByCSS(".ak-notification"))
      .not.toBeInTheDocument();
  });

  it("renders toast on open() call", async () => {
    const el = await getNotification();
    el.open({ title: "Hello" });
    await el.updateComplete;
    await expect.element(page.getByText("Hello")).toBeInTheDocument();
  });

  it("renders title", async () => {
    const el = await getNotification();
    el.open({ title: "Notification Title" });
    await el.updateComplete;
    await expect
      .element(page.getByText("Notification Title"))
      .toBeInTheDocument();
  });

  it("renders description when provided", async () => {
    const el = await getNotification();
    el.open({ title: "Title", description: "Description text" });
    await el.updateComplete;
    await expect
      .element(page.getByText("Description text"))
      .toBeInTheDocument();
  });

  it("does not render description when not provided", async () => {
    const el = await getNotification();
    el.open({ title: "No Desc" });
    await el.updateComplete;
    await expect
      .element(page.getByCSS(".ak-notification-description"))
      .not.toBeInTheDocument();
  });

  it("applies info icon class by default", async () => {
    const el = await getNotification();
    el.open({ title: "Info" });
    await el.updateComplete;
    await expect
      .element(page.getByCSS(".ak-notification-icon-info"))
      .toBeInTheDocument();
  });

  it("applies success icon class", async () => {
    const el = await getNotification();
    el.open({ title: "Success", type: "success" });
    await el.updateComplete;
    await expect
      .element(page.getByCSS(".ak-notification-icon-success"))
      .toBeInTheDocument();
  });

  it("applies warning icon class", async () => {
    const el = await getNotification();
    el.open({ title: "Warning", type: "warning" });
    await el.updateComplete;
    await expect
      .element(page.getByCSS(".ak-notification-icon-warning"))
      .toBeInTheDocument();
  });

  it("applies error icon class", async () => {
    const el = await getNotification();
    el.open({ title: "Error", type: "error" });
    await el.updateComplete;
    await expect
      .element(page.getByCSS(".ak-notification-icon-error"))
      .toBeInTheDocument();
  });

  it("applies placement class for bottom-left", async () => {
    render(html`<ak-notification placement="bottom-left"></ak-notification>`);
    const el = (await page
      .getByCSS("ak-notification")
      .findElement()) as AkNotification;
    el.open({ title: "Placement" });
    await el.updateComplete;
    await expect
      .element(page.getByCSS(".ak-notification-bottom-left"))
      .toBeInTheDocument();
  });

  it("applies placement class for top-right by default", async () => {
    const el = await getNotification();
    el.open({ title: "Default" });
    await el.updateComplete;
    await expect
      .element(page.getByCSS(".ak-notification-top-right"))
      .toBeInTheDocument();
  });

  it("removes toast on close button click", async () => {
    const el = await getNotification();
    el.open({ title: "Close Me", duration: 0 });
    await el.updateComplete;
    await expect.element(page.getByText("Close Me")).toBeInTheDocument();
    await userEvent.click(page.getByCSS(".ak-notification-close"));
    // Wait for 300ms close animation
    await new Promise((r) => setTimeout(r, 400));
    await expect.element(page.getByText("Close Me")).not.toBeInTheDocument();
  });

  it("auto-closes after duration", async () => {
    const el = await getNotification();
    el.open({ title: "Auto Close", duration: 50 });
    await el.updateComplete;
    await expect.element(page.getByText("Auto Close")).toBeInTheDocument();
    // Wait for duration (50ms) + close animation (300ms) + buffer
    await new Promise((r) => setTimeout(r, 500));
    await expect.element(page.getByText("Auto Close")).not.toBeInTheDocument();
  });

  it("does not auto-close when duration is 0", async () => {
    const el = await getNotification();
    el.open({ title: "Persistent", duration: 0 });
    await el.updateComplete;
    await expect.element(page.getByText("Persistent")).toBeInTheDocument();
    await new Promise((r) => setTimeout(r, 200));
    await expect.element(page.getByText("Persistent")).toBeInTheDocument();
  });

  it("open() returns toast id", async () => {
    const el = await getNotification();
    const id = el.open({ title: "ID Test" });
    expect(id).toBeTruthy();
  });

  it("uses custom key when provided", async () => {
    const el = await getNotification();
    const id = el.open({ title: "Custom Key", key: "my-key" });
    expect(id).toBe("my-key");
  });

  it("close() removes toast by id", async () => {
    const el = await getNotification();
    const id = el.open({ title: "Close By ID", duration: 0 });
    await el.updateComplete;
    await expect.element(page.getByText("Close By ID")).toBeInTheDocument();
    el.close(id);
    await new Promise((r) => setTimeout(r, 400));
    await expect.element(page.getByText("Close By ID")).not.toBeInTheDocument();
  });
});
