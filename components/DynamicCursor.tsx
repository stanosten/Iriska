"use client";

import { useEffect } from "react";

import { pickCursorColor } from "@/lib/cursorColor";
import { resolveBackgroundColorAtPoint } from "@/lib/cursorBackground";

const CURSOR_ACTIVE_CLASS = "dynamic-cursor-active";
const CURSOR_SELECTOR = ".dynamic-cursor-dot";
const INTERACTIVE_SELECTOR = [
  '[data-cursor-interactive="true"]',
  "a",
  "button",
  "input",
  "textarea",
  "select",
  '[role="button"]',
  ".cursor-pointer",
].join(", ");
const CURSOR_COLORS = ["#111111", "#ffffff", "#A88B4A"];

function hasFinePointer(): boolean {
  if (typeof window === "undefined" || typeof window.matchMedia !== "function") {
    return false;
  }
  return window.matchMedia("(pointer: fine)").matches;
}

export default function DynamicCursor() {
  useEffect(() => {
    if (!hasFinePointer()) return;

    const root = document.documentElement;
    const cursor = document.querySelector<HTMLElement>(CURSOR_SELECTOR);
    if (!cursor) return;

    root.classList.add(CURSOR_ACTIVE_CLASS);
    root.style.setProperty("--cursor-x", "-100px");
    root.style.setProperty("--cursor-y", "-100px");
    root.style.setProperty("--cursor-color", "#111111");

    let rafId = 0;
    let pointerX = -100;
    let pointerY = -100;
    let isPointerInside = false;
    let currentColor = "#111111";

    const render = () => {
      rafId = 0;
      if (!isPointerInside) return;

      root.style.setProperty("--cursor-x", `${pointerX}px`);
      root.style.setProperty("--cursor-y", `${pointerY}px`);

      const background = resolveBackgroundColorAtPoint(pointerX, pointerY, document);
      const next = pickCursorColor(background, CURSOR_COLORS).color;
      if (next !== currentColor) {
        currentColor = next;
        root.style.setProperty("--cursor-color", next);
      }
    };

    const requestRender = () => {
      if (rafId) return;
      rafId = window.requestAnimationFrame(render);
    };

    const onPointerMove = (event: PointerEvent) => {
      pointerX = event.clientX;
      pointerY = event.clientY;
      isPointerInside = true;
      requestRender();
    };

    const onPointerLeave = () => {
      isPointerInside = false;
      root.style.setProperty("--cursor-x", "-100px");
      root.style.setProperty("--cursor-y", "-100px");
    };

    const onMouseOver = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      
      // 1. Проверка на текстовый ховер (как было)
      const hoverEl = target.closest<HTMLElement>('[data-cursor-text]');
      if (hoverEl && cursor) {
        const text = hoverEl.getAttribute('data-cursor-text') || '';
        const bg = hoverEl.getAttribute('data-cursor-bg') || '';
        
        cursor.classList.add('cursor-hover-active');
        const textSpan = cursor.querySelector('.dynamic-cursor-text');
        if (textSpan) {
          textSpan.textContent = text.replace(/\\n/g, '\n');
        }
        if (bg) {
          cursor.style.setProperty('--hover-bg', bg);
        }
        return; // Если это текстовый ховер, не применяем обычный интерактивный класс
      }

      // 2. Проверка на интерактивные элементы (увеличение курсора)
      const interactiveEl = target.closest<HTMLElement>(INTERACTIVE_SELECTOR);
      if (interactiveEl && cursor) {
        cursor.classList.add('cursor-interactive');
      }
    };

    const onMouseOut = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      
      const hoverEl = target.closest<HTMLElement>('[data-cursor-text]');
      if (hoverEl && cursor) {
        cursor.classList.remove('cursor-hover-active');
        const textSpan = cursor.querySelector('.dynamic-cursor-text');
        if (textSpan) {
          textSpan.textContent = '';
        }
        cursor.style.removeProperty('--hover-bg');
      }

      const interactiveEl = target.closest<HTMLElement>(INTERACTIVE_SELECTOR);
      if (interactiveEl && cursor) {
        cursor.classList.remove('cursor-interactive');
      }
    };

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    document.addEventListener("mouseleave", onPointerLeave);
    window.addEventListener("blur", onPointerLeave);
    window.addEventListener("scroll", requestRender, { passive: true });
    document.addEventListener("mouseover", onMouseOver, { passive: true });
    document.addEventListener("mouseout", onMouseOut, { passive: true });

    return () => {
      if (rafId) {
        window.cancelAnimationFrame(rafId);
      }
      window.removeEventListener("pointermove", onPointerMove);
      document.removeEventListener("mouseleave", onPointerLeave);
      window.removeEventListener("blur", onPointerLeave);
      window.removeEventListener("scroll", requestRender);
      document.removeEventListener("mouseover", onMouseOver);
      document.removeEventListener("mouseout", onMouseOut);
      root.classList.remove(CURSOR_ACTIVE_CLASS);
      root.style.removeProperty("--cursor-x");
      root.style.removeProperty("--cursor-y");
      root.style.removeProperty("--cursor-color");
    };
  }, []);

  return (
    <div
      className="dynamic-cursor-dot fixed top-0 left-0 z-[99999] pointer-events-none"
      aria-hidden="true"
    >
      <span className="dynamic-cursor-text"></span>
    </div>
  );
}
