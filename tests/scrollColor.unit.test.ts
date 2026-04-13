import { describe, expect, it } from "vitest";

import {
  interpolatePalette,
  parseColor,
  pickPaletteStep,
  scrollProgress,
} from "@/lib/scrollColor";

describe("scrollColor - unit", () => {
  it("парсит hex/rgb цвета", () => {
    expect(parseColor("#fff")).toEqual({ r: 255, g: 255, b: 255 });
    expect(parseColor("#112233")).toEqual({ r: 17, g: 34, b: 51 });
    expect(parseColor("rgb(10, 20, 30)")).toEqual({ r: 10, g: 20, b: 30 });
  });

  it("интерполирует палитру по прогрессу", () => {
    expect(interpolatePalette(["#000000", "#ffffff"], 0)).toBe("rgb(0, 0, 0)");
    expect(interpolatePalette(["#000000", "#ffffff"], 1)).toBe("rgb(255, 255, 255)");
    expect(interpolatePalette(["#000000", "#ffffff"], 0.5)).toBe("rgb(128, 128, 128)");
  });

  it("выбирает ближайший шаг палитры для fallback", () => {
    const palette = ["#000000", "#777777", "#ffffff"];
    expect(pickPaletteStep(palette, 0.1)).toBe("rgb(0, 0, 0)");
    expect(pickPaletteStep(palette, 0.6)).toBe("rgb(119, 119, 119)");
    expect(pickPaletteStep(palette, 0.95)).toBe("rgb(255, 255, 255)");
  });

  it("возвращает корректный прогресс скролла", () => {
    const viewportHeight = 1000;
    const triggerStart = 0.2;
    const triggerEnd = 0.8;

    const belowViewport = {
      top: 900,
      height: 400,
    } as DOMRect;

    const inMiddle = {
      top: 300,
      height: 400,
    } as DOMRect;

    const aboveViewport = {
      top: -400,
      height: 400,
    } as DOMRect;

    expect(scrollProgress(belowViewport, viewportHeight, triggerStart, triggerEnd)).toBe(0);
    expect(scrollProgress(inMiddle, viewportHeight, triggerStart, triggerEnd)).toBeCloseTo(0.5, 1);
    expect(scrollProgress(aboveViewport, viewportHeight, triggerStart, triggerEnd)).toBe(1);
  });
});
