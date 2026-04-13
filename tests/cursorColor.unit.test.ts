import { describe, expect, it } from "vitest";

import {
  contrastRatio,
  extractGradientColors,
  parseCssColor,
  pickCursorColor,
} from "@/lib/cursorColor";

describe("cursorColor - unit", () => {
  it("парсит HEX и RGB в единый формат", () => {
    expect(parseCssColor("#fff")).toEqual({ r: 255, g: 255, b: 255, a: 1 });
    expect(parseCssColor("#112233")).toEqual({ r: 17, g: 34, b: 51, a: 1 });
    expect(parseCssColor("rgb(10, 20, 30)")).toEqual({ r: 10, g: 20, b: 30, a: 1 });
    expect(parseCssColor("rgba(10, 20, 30, 0.5)")).toEqual({ r: 10, g: 20, b: 30, a: 0.5 });
  });

  it("вычисляет контрастность по WCAG 2.1", () => {
    const black = { r: 0, g: 0, b: 0, a: 1 };
    const white = { r: 255, g: 255, b: 255, a: 1 };
    const ratio = contrastRatio(black, white);
    expect(ratio).toBeCloseTo(21, 4);
  });

  it("выбирает наиболее контрастный цвет курсора", () => {
    const onDark = pickCursorColor({ r: 20, g: 20, b: 20, a: 1 });
    const onLight = pickCursorColor({ r: 245, g: 245, b: 245, a: 1 });

    expect(onDark.color).toBe("#ffffff");
    expect(onLight.color).toBe("#111111");
    expect(onDark.contrast).toBeGreaterThan(4.5);
    expect(onLight.contrast).toBeGreaterThan(4.5);
  });

  it("извлекает цвета из CSS-градиента", () => {
    const colors = extractGradientColors(
      "linear-gradient(120deg, #ffffff 0%, rgb(20, 30, 40) 100%)"
    );
    expect(colors.length).toBe(2);
    expect(colors[0]).toEqual({ r: 255, g: 255, b: 255, a: 1 });
    expect(colors[1]).toEqual({ r: 20, g: 30, b: 40, a: 1 });
  });
});
