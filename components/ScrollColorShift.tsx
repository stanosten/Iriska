"use client";

import { useEffect } from "react";

import { interpolatePalette, pickPaletteStep, scrollProgress } from "@/lib/scrollColor";

interface ScrollColorConfig {
  transitionMs: number;
  throttleMs: number;
  triggerStart: number;
  triggerEnd: number;
  paletteByBlock: Record<string, string[]>;
}

const SCROLL_COLOR_CONFIG: ScrollColorConfig = {
  transitionMs: 420,
  throttleMs: 48,
  triggerStart: 0.2,
  triggerEnd: 0.85,
  paletteByBlock: {
    hero: ["#FBF3E9", "#F8EEDF", "#F5E8D4"],
    lashes: ["#FFF9F4", "#FDF1E7", "#F9E8DB"],
    nails: ["#F7EFE5", "#F4E6D7", "#F2DFCB"],
    why: ["#FFFFFF", "#F7F1EA", "#F1E8DC"],
    portfolio: ["#3D2B1F", "#4A3527", "#5A3F2F"],
    footer: ["#2F2118", "#3A291D", "#4A3324"],
  },
};

function supportsBackgroundTransition(): boolean {
  if (typeof window === "undefined") return false;
  if (!("CSS" in window) || typeof window.CSS?.supports !== "function") return false;
  return window.CSS.supports("transition", "background-color 0.2s ease");
}

export default function ScrollColorShift() {
  useEffect(() => {
    const blocks = Array.from(
      document.querySelectorAll<HTMLElement>("[data-scroll-color-id]")
    );
    if (!blocks.length) return;

    const hasTransitions = supportsBackgroundTransition();
    const { paletteByBlock, transitionMs, triggerStart, triggerEnd, throttleMs } = SCROLL_COLOR_CONFIG;

    blocks.forEach((block) => {
      block.classList.add("scroll-color-block");
      block.style.setProperty("--scroll-transition-ms", `${transitionMs}ms`);

      if (!hasTransitions) {
        block.dataset.scrollNoTransition = "true";
      } else {
        delete block.dataset.scrollNoTransition;
      }
    });

    const setBlockColor = (block: HTMLElement, viewportHeight: number) => {
      const blockId = block.dataset.scrollColorId ?? "";
      const palette = paletteByBlock[blockId] ?? ["#FBF3E9", "#F6EDE2", "#F1E6D8"];
      const progress = scrollProgress(
        block.getBoundingClientRect(),
        viewportHeight,
        triggerStart,
        triggerEnd
      );
      const nextColor = hasTransitions
        ? interpolatePalette(palette, progress)
        : pickPaletteStep(palette, progress);

      block.style.setProperty("--scroll-bg-color", nextColor);
      block.style.backgroundColor = nextColor;
    };

    const updateColors = () => {
      const viewportHeight = window.innerHeight || document.documentElement.clientHeight || 1;
      blocks.forEach((block) => setBlockColor(block, viewportHeight));
    };

    let rafId: number | null = null;
    let timeoutId: number | null = null;
    let lastRun = 0;

    const scheduleUpdate = () => {
      if (rafId !== null || timeoutId !== null) return;

      rafId = window.requestAnimationFrame((now) => {
        rafId = null;
        const elapsed = now - lastRun;
        if (elapsed < throttleMs) {
          timeoutId = window.setTimeout(() => {
            timeoutId = null;
            lastRun = performance.now();
            updateColors();
          }, throttleMs - elapsed);
          return;
        }

        lastRun = now;
        updateColors();
      });
    };

    updateColors();

    const listenerOptions: AddEventListenerOptions = { passive: true };
    window.addEventListener("scroll", scheduleUpdate, listenerOptions);
    window.addEventListener("resize", scheduleUpdate, listenerOptions);
    window.addEventListener("orientationchange", scheduleUpdate, listenerOptions);

    return () => {
      window.removeEventListener("scroll", scheduleUpdate);
      window.removeEventListener("resize", scheduleUpdate);
      window.removeEventListener("orientationchange", scheduleUpdate);

      if (rafId !== null) {
        window.cancelAnimationFrame(rafId);
      }
      if (timeoutId !== null) {
        window.clearTimeout(timeoutId);
      }
    };
  }, []);

  return null;
}
