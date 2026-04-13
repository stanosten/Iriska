import { describe, expect, it, vi } from "vitest";
import { DESKTOP_BREAKPOINT, getCursorOffsetPosition, hasFinePointer, isDesktopViewport } from "@/lib/heroCursor";

describe("heroCursor unit", () => {
  it("detects desktop viewport by breakpoint", () => {
    expect(isDesktopViewport(DESKTOP_BREAKPOINT)).toBe(true);
    expect(isDesktopViewport(DESKTOP_BREAKPOINT - 1)).toBe(false);
  });

  it("calculates centered cursor offset by size", () => {
    expect(getCursorOffsetPosition(120, 80, 100)).toEqual({ x: 70, y: 30 });
    expect(getCursorOffsetPosition(60, 60, 80)).toEqual({ x: 20, y: 20 });
  });

  it("detects fine pointer via matchMedia", () => {
    const originalMatchMedia = window.matchMedia;
    Object.defineProperty(window, "matchMedia", {
      writable: true,
      value: vi.fn().mockImplementation((query: string) => ({ matches: query === "(pointer: fine)" })),
    });
    expect(hasFinePointer()).toBe(true);
    window.matchMedia = originalMatchMedia;
  });
});
