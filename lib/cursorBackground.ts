import {
  RGB,
  averageColors,
  extractGradientColors,
  flattenRgba,
  parseCssColor,
} from "./cursorColor";

const FALLBACK_BACKGROUND: RGB = { r: 251, g: 243, b: 233, a: 1 };

function isTransparent(color: RGB | null): boolean {
  if (!color) return true;
  return (color.a ?? 1) <= 0;
}

function sampleMediaCenter(element: Element): RGB | null {
  if (typeof document === "undefined") return null;

  if (element instanceof HTMLImageElement && element.complete) {
    try {
      const canvas = document.createElement("canvas");
      canvas.width = 1;
      canvas.height = 1;
      const ctx = canvas.getContext("2d");
      if (!ctx) return null;
      const sx = Math.floor(element.naturalWidth / 2);
      const sy = Math.floor(element.naturalHeight / 2);
      if (sx <= 0 || sy <= 0) return null;
      ctx.drawImage(element, sx, sy, 1, 1, 0, 0, 1, 1);
      const data = ctx.getImageData(0, 0, 1, 1).data;
      const r = data[0];
      const g = data[1];
      const b = data[2];
      const a = data[3];
      return { r, g, b, a: a / 255 };
    } catch {
      return null;
    }
  }

  if (element instanceof HTMLVideoElement && element.readyState >= 2) {
    try {
      const canvas = document.createElement("canvas");
      canvas.width = 1;
      canvas.height = 1;
      const ctx = canvas.getContext("2d");
      if (!ctx) return null;
      const sx = Math.floor(element.videoWidth / 2);
      const sy = Math.floor(element.videoHeight / 2);
      if (sx <= 0 || sy <= 0) return null;
      ctx.drawImage(element, sx, sy, 1, 1, 0, 0, 1, 1);
      const data = ctx.getImageData(0, 0, 1, 1).data;
      const r = data[0];
      const g = data[1];
      const b = data[2];
      const a = data[3];
      return { r, g, b, a: a / 255 };
    } catch {
      return null;
    }
  }

  return null;
}

function readStyleBackground(style: CSSStyleDeclaration): RGB | null {
  const backgroundImage = style.backgroundImage;
  if (backgroundImage && backgroundImage !== "none") {
    const gradientColors = extractGradientColors(backgroundImage);
    if (gradientColors.length > 0) {
      return averageColors(gradientColors);
    }
  }

  const parsed = parseCssColor(style.backgroundColor);
  if (!parsed) return null;
  return parsed;
}

export function resolveBackgroundColorForElement(
  start: Element | null,
  win: Window
): RGB {
  const fallbackFromBody = parseCssColor(win.getComputedStyle(win.document.body).backgroundColor);
  const base = fallbackFromBody && !isTransparent(fallbackFromBody) ? fallbackFromBody : FALLBACK_BACKGROUND;
  let current = start;
  let color = base;

  while (current) {
    const sampledMedia = sampleMediaCenter(current);
    if (sampledMedia && !isTransparent(sampledMedia)) {
      color = flattenRgba(sampledMedia, color);
      return color;
    }

    const style = win.getComputedStyle(current);
    const candidate = readStyleBackground(style);
    if (candidate && !isTransparent(candidate)) {
      color = flattenRgba(candidate, color);
      return color;
    }

    current = current.parentElement;
  }

  return color;
}

export function resolveBackgroundColorAtPoint(
  x: number,
  y: number,
  doc: Document = document
): RGB {
  const win = doc.defaultView;
  if (!win) {
    return FALLBACK_BACKGROUND;
  }
  const element = doc.elementFromPoint(x, y);
  return resolveBackgroundColorForElement(element, win);
}
