import { beforeEach, describe, expect, it, vi } from "vitest";
import { scrollToSection } from "@/lib/heroCursor";

describe("heroCursor integration", () => {
  beforeEach(() => {
    document.body.innerHTML = "";
  });

  it("returns false when section is missing", () => {
    expect(scrollToSection("nails")).toBe(false);
  });

  it("scrolls to target section and returns true", () => {
    const section = document.createElement("section");
    section.id = "nails";
    const scrollSpy = vi.fn();
    section.scrollIntoView = scrollSpy;
    document.body.appendChild(section);

    expect(scrollToSection("nails")).toBe(true);
    expect(scrollSpy).toHaveBeenCalledWith({ behavior: "auto", block: "start" });
  });
});
