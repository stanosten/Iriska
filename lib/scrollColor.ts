export interface RgbColor {
  r: number;
  g: number;
  b: number;
}

const HEX_SHORT_RE = /^#([0-9a-f]{3})$/i;
const HEX_FULL_RE = /^#([0-9a-f]{6})$/i;
const RGB_RE =
  /^rgb\(\s*([+-]?\d*\.?\d+)\s*,\s*([+-]?\d*\.?\d+)\s*,\s*([+-]?\d*\.?\d+)\s*\)$/i;

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function toChannel(value: number): number {
  return clamp(Math.round(value), 0, 255);
}

export function parseColor(value: string): RgbColor | null {
  const normalized = value.trim();
  if (!normalized) return null;

  const shortHex = normalized.match(HEX_SHORT_RE);
  if (shortHex) {
    const [, hex] = shortHex;
    return {
      r: parseInt(`${hex[0]}${hex[0]}`, 16),
      g: parseInt(`${hex[1]}${hex[1]}`, 16),
      b: parseInt(`${hex[2]}${hex[2]}`, 16),
    };
  }

  const fullHex = normalized.match(HEX_FULL_RE);
  if (fullHex) {
    const [, hex] = fullHex;
    return {
      r: parseInt(hex.slice(0, 2), 16),
      g: parseInt(hex.slice(2, 4), 16),
      b: parseInt(hex.slice(4, 6), 16),
    };
  }

  const rgb = normalized.match(RGB_RE);
  if (rgb) {
    const [, r, g, b] = rgb;
    return { r: toChannel(Number(r)), g: toChannel(Number(g)), b: toChannel(Number(b)) };
  }

  return null;
}

function mixColor(from: RgbColor, to: RgbColor, progress: number): RgbColor {
  const p = clamp(progress, 0, 1);
  return {
    r: toChannel(from.r + (to.r - from.r) * p),
    g: toChannel(from.g + (to.g - from.g) * p),
    b: toChannel(from.b + (to.b - from.b) * p),
  };
}

export function toRgbString(color: RgbColor): string {
  return `rgb(${color.r}, ${color.g}, ${color.b})`;
}

export function interpolatePalette(palette: string[], progress: number): string {
  const parsed = palette
    .map((entry) => parseColor(entry))
    .filter((entry): entry is RgbColor => entry !== null);

  if (!parsed.length) return "rgb(251, 243, 233)";
  if (parsed.length === 1) return toRgbString(parsed[0]);

  const p = clamp(progress, 0, 1);
  const scaled = p * (parsed.length - 1);
  const lowerIndex = Math.floor(scaled);
  const upperIndex = Math.min(parsed.length - 1, lowerIndex + 1);
  const localProgress = scaled - lowerIndex;

  return toRgbString(mixColor(parsed[lowerIndex], parsed[upperIndex], localProgress));
}

export function pickPaletteStep(palette: string[], progress: number): string {
  if (!palette.length) return "rgb(251, 243, 233)";
  const p = clamp(progress, 0, 1);
  const index = Math.round(p * (palette.length - 1));
  const parsed = parseColor(palette[index] ?? palette[0]);
  return parsed ? toRgbString(parsed) : "rgb(251, 243, 233)";
}

export function scrollProgress(
  rect: DOMRect,
  viewportHeight: number,
  triggerStart: number,
  triggerEnd: number
): number {
  const startLine = viewportHeight * triggerEnd;
  const endLine = viewportHeight * triggerStart;
  const center = rect.top + rect.height / 2;

  if (startLine <= endLine) {
    return center <= endLine ? 1 : 0;
  }

  return clamp((startLine - center) / (startLine - endLine), 0, 1);
}
