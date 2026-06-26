import { iconSvg } from "@/shared/icons";

describe("iconSvg", () => {
  it("returns an SVG string for known icons", () => {
    const svg = iconSvg("copy");
    expect(svg).toContain("<svg");
    expect(svg).toContain("</svg>");
    // default size = 16
    expect(svg).toContain('width="16"');
    expect(svg).toContain('height="16"');
  });

  it("respects custom size parameter", () => {
    const svg = iconSvg("copy", 20);
    expect(svg).toContain('width="20"');
    expect(svg).toContain('height="20"');
  });

  it("uses currentColor for stroke", () => {
    const svg = iconSvg("copy");
    expect(svg).toContain('stroke="currentColor"');
  });

  it("returns empty SVG for unknown icon name", () => {
    // iconSvg returns "" for unknown icons
    expect(iconSvg("nonexistent-icon-xyz")).toBe("");
  });

  it("renders icon nodes (child elements inside SVG)", () => {
    const svg = iconSvg("check");
    // Lucide icons contain child elements like <path>, <circle>, etc.
    expect(svg.length).toBeGreaterThan(30);
  });

  it("includes viewBox attribute", () => {
    const svg = iconSvg("copy");
    expect(svg).toContain('viewBox="0 0 24 24"');
  });
});
