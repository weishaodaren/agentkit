import { page, userEvent } from "vitest/browser";
import "@vitest/browser/matchers";
import { render } from "vitest-browser-lit";
import { html } from "lit";
import "@/conversations.ts";
import type { ConversationItem } from "@/conversations.ts";

const items: ConversationItem[] = [
  { key: "1", label: "Chat One" },
  { key: "2", label: "Chat Two", active: true },
  { key: "3", label: "Chat Three", disabled: true },
];

describe("AkConversations", () => {
  it("renders title in header", async () => {
    render(html`<ak-conversations
      .items=${items}
      title="My Chats"
      style="height:600px;"
    ></ak-conversations>`);
    await expect.element(page.getByText("My Chats")).toBeInTheDocument();
  });

  it("renders creation button when creation is true", async () => {
    render(html`<ak-conversations
      .items=${items}
      ?creation=${true}
      style="height:600px;"
    ></ak-conversations>`);
    await expect.element(page.getByText("新对话")).toBeInTheDocument();
  });

  it("renders custom creation label", async () => {
    render(html`<ak-conversations
      .items=${items}
      ?creation=${true}
      creation-label="Start New"
      style="height:600px;"
    ></ak-conversations>`);
    await expect.element(page.getByText("Start New")).toBeInTheDocument();
  });

  it("dispatches creation event on creation button click", async () => {
    let created = false;
    render(html`<ak-conversations
      .items=${items}
      ?creation=${true}
      style="height:600px;"
      @creation=${() => {
        created = true;
      }}
    ></ak-conversations>`);
    await userEvent.click(page.getByText("新对话"));
    expect(created).toBe(true);
  });

  it("renders conversation items", async () => {
    render(html`<ak-conversations
      .items=${items}
      style="height:600px;"
    ></ak-conversations>`);
    await vi.waitFor(() => {
      expect(page.getByText("Chat One")).toBeDefined();
    });
    await expect.element(page.getByText("Chat One")).toBeInTheDocument();
  });

  it("dispatches conversation-click on item click", async () => {
    let clickedKey = "";
    render(html`<ak-conversations
      .items=${items}
      style="height:600px;"
      @conversation-click=${(e: Event) => {
        clickedKey = (e as CustomEvent).detail.key;
      }}
    ></ak-conversations>`);
    await vi.waitFor(() => {
      expect(page.getByText("Chat One")).toBeDefined();
    });
    await userEvent.click(page.getByText("Chat One"));
    expect(clickedKey).toBe("1");
  });

  it("applies active class to active item", async () => {
    render(html`<ak-conversations
      .items=${items}
      style="height:600px;"
    ></ak-conversations>`);
    await vi.waitFor(() => {
      expect(page.getByText("Chat Two")).toBeDefined();
    });
    await expect
      .element(page.getByCSS(".ak-conversations-item-active"))
      .toBeInTheDocument();
  });

  it("shows active indicator for active item", async () => {
    render(html`<ak-conversations
      .items=${items}
      style="height:600px;"
    ></ak-conversations>`);
    await vi.waitFor(() => {
      expect(page.getByText("Chat Two")).toBeDefined();
    });
    await expect
      .element(page.getByCSS(".ak-conversations-item-indicator"))
      .toBeInTheDocument();
  });

  it("does not dispatch click for disabled items", async () => {
    const handler = vi.fn();
    render(html`<ak-conversations
      .items=${items}
      style="height:600px;"
      @conversation-click=${(e: Event) => handler(e)}
    ></ak-conversations>`);
    await vi.waitFor(() => {
      expect(page.getByText("Chat Three")).toBeDefined();
    });
    const el = await page.getByText("Chat Three").findElement();
    (el as HTMLElement).click();
    expect(handler).not.toHaveBeenCalled();
  });

  it("renders group headers in groupable mode", async () => {
    const groupedItems: ConversationItem[] = [
      { key: "1", label: "Item A", group: "Today" },
      { key: "2", label: "Item B", group: "Yesterday" },
    ];
    render(html`<ak-conversations
      .items=${groupedItems}
      ?groupable=${true}
      style="height:600px;"
    ></ak-conversations>`);
    await vi.waitFor(() => {
      expect(page.getByText("Today")).toBeDefined();
    });
    await expect.element(page.getByText("Today")).toBeInTheDocument();
    await expect.element(page.getByText("Yesterday")).toBeInTheDocument();
  });

  it("renders item icon when icon is specified", async () => {
    render(html`<ak-conversations
      .items=${[{ key: "1", label: "Starred", icon: "star" }]}
      style="height:600px;"
    ></ak-conversations>`);
    await vi.waitFor(() => {
      expect(page.getByText("Starred")).toBeDefined();
    });
    await expect
      .element(page.getByCSS(".ak-conversations-item-icon"))
      .toBeInTheDocument();
  });
});
