export const DESKTOP_BREAKPOINT = 768;

export function isDesktopViewport(width: number): boolean {
  return width >= DESKTOP_BREAKPOINT;
}

export function hasFinePointer(): boolean {
  if (typeof window === "undefined" || typeof window.matchMedia !== "function") {
    return false;
  }

  return window.matchMedia("(pointer: fine)").matches;
}

export function getCursorOffsetPosition(
  clientX: number,
  clientY: number,
  size: number
): { x: number; y: number } {
  const offset = size / 2;
  return {
    x: clientX - offset,
    y: clientY - offset,
  };
}

export function scrollToSection(sectionId: string): boolean {
  const target = document.getElementById(sectionId);
  if (!target) return false;

  target.scrollIntoView({ behavior: "auto", block: "start" });
  return true;
}
