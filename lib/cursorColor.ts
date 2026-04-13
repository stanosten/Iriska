export interface RGB {
  r: number;
  g: number;
  b: number;
  a?: number;
}

export interface CursorColorResult {
  color: string;
  contrast: number;
}

const HEX_SHORT_RE = /^#([0-9a-f]{3})$/i;
const HEX_FULL_RE = /^#([0-9a-f]{6})$/i;
const RGB_RE =
  /^rgba?\(\s*([+-]?\d*\.?\d+)\s*,\s*([+-]?\d*\.?\d+)\s*,\s*([+-]?\d*\.?\d+)(?:\s*,\s*([+-]?\d*\.?\d+))?\s*\)$/i;

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function toChannel(value: number): number {
  return clamp(Math.round(value), 0, 255);
}

export function parseCssColor(input: string): RGB | null {
  const normalized = input.trim();
  if (!normalized) return null;

  const shortHex = normalized.match(HEX_SHORT_RE);
  if (shortHex) {
    const [, hex] = shortHex;
    return {
      r: parseInt(`${hex[0]}${hex[0]}`, 16),
      g: parseInt(`${hex[1]}${hex[1]}`, 16),
      b: parseInt(`${hex[2]}${hex[2]}`, 16),
      a: 1,
    };
  }

  const fullHex = normalized.match(HEX_FULL_RE);
  if (fullHex) {
    const [, hex] = fullHex;
    return {
      r: parseInt(hex.slice(0, 2), 16),
      g: parseInt(hex.slice(2, 4), 16),
      b: parseInt(hex.slice(4, 6), 16),
      a: 1,
    };
  }

  const rgb = normalized.match(RGB_RE);
  if (rgb) {
    const [, r, g, b, a] = rgb;
    return {
      r: toChannel(Number(r)),
      g: toChannel(Number(g)),
      b: toChannel(Number(b)),
      a: a === undefined ? 1 : clamp(Number(a), 0, 1),
    };
  }

  return null;
}

function srgbToLinear(channel: number): number {
  const value = channel / 255;
  return value <= 0.03928 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
}

export function relativeLuminance(color: RGB): number {
  const r = srgbToLinear(color.r);
  const g = srgbToLinear(color.g);
  const b = srgbToLinear(color.b);
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

export function contrastRatio(first: RGB, second: RGB): number {
  const l1 = relativeLuminance(first);
  const l2 = relativeLuminance(second);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

export function flattenRgba(foreground: RGB, background: RGB): RGB {
  const alpha = foreground.a ?? 1;
  if (alpha >= 1) return { r: foreground.r, g: foreground.g, b: foreground.b, a: 1 };

  const inv = 1 - alpha;
  return {
    r: toChannel(foreground.r * alpha + background.r * inv),
    g: toChannel(foreground.g * alpha + background.g * inv),
    b: toChannel(foreground.b * alpha + background.b * inv),
    a: 1,
  };
}

export function averageColors(colors: RGB[]): RGB {
  if (!colors.length) {
    return { r: 255, g: 255, b: 255, a: 1 };
  }

  const sum = colors.reduce(
    (acc, color) => ({
      r: acc.r + color.r,
      g: acc.g + color.g,
      b: acc.b + color.b,
    }),
    { r: 0, g: 0, b: 0 }
  );

  return {
    r: toChannel(sum.r / colors.length),
    g: toChannel(sum.g / colors.length),
    b: toChannel(sum.b / colors.length),
    a: 1,
  };
}

export function extractGradientColors(gradient: string): RGB[] {
  const matches = gradient.match(/#[0-9a-f]{3,6}|rgba?\([^)]+\)/gi);
  if (!matches) return [];
  return matches
    .map((token) => parseCssColor(token))
    .filter((value): value is RGB => value !== null);
}

export function pickCursorColor(
  background: RGB,
  candidates: string[] = ["#111111", "#ffffff"]
): CursorColorResult {
  let bestColor = candidates[0] ?? "#111111";
  let bestContrast = -1;

  for (const candidate of candidates) {
    const parsed = parseCssColor(candidate);
    if (!parsed) continue;
    const ratio = contrastRatio(background, parsed);
    if (ratio > bestContrast) {
      bestContrast = ratio;
      bestColor = candidate;
    }
  }

  return {
    color: bestColor,
    contrast: bestContrast,
  };
}
