"use client";

import { useEffect } from "react";

/**
 * Изинг-функция для плавного движения
 * easeInOutCubic: начинает медленно, ускоряется в середине, замедляется в конце
 */
const easeInOutCubic = (t: number): number => {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
};

interface SmoothScrollOptions {
  duration?: number;
  offset?: number;
}

export default function SmoothScrollHandler({
  duration = 800,
  offset = 0, // Можно настроить отступ, если есть фиксированный header
}: SmoothScrollOptions) {
  useEffect(() => {
    // Проверяем, включено ли системное предпочтение reduced motion
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const handleAnchorClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      
      // Ищем ближайшую ссылку-родителя, если клик был по вложенному элементу (например, по иконке внутри <a>)
      const anchor = target.closest("a");

      if (!anchor) return;

      const href = anchor.getAttribute("href");

      // Обрабатываем только внутренние якорные ссылки, начинающиеся с "#"
      if (!href || !href.startsWith("#") || href === "#") return;

      const targetId = href.substring(1);
      const targetElement = document.getElementById(targetId);

      if (!targetElement) return;

      // Если пользователь предпочитает уменьшенное движение, используем стандартное поведение (прыжок)
      if (prefersReducedMotion) return;

      e.preventDefault();

      const startPosition = window.scrollY;
      const targetPosition = targetElement.getBoundingClientRect().top + startPosition - offset;
      const distance = targetPosition - startPosition;
      let startTime: number | null = null;

      const animation = (currentTime: number) => {
        if (startTime === null) startTime = currentTime;
        const timeElapsed = currentTime - startTime;
        const progress = Math.min(timeElapsed / duration, 1);
        
        // Применяем функцию ease
        const easeProgress = easeInOutCubic(progress);

        window.scrollTo(0, startPosition + distance * easeProgress);

        if (timeElapsed < duration) {
          requestAnimationFrame(animation);
        } else {
          // По завершении анимации обновляем URL без перезагрузки страницы
          window.history.pushState(null, "", href);
          // Устанавливаем фокус на целевой элемент для доступности
          targetElement.setAttribute("tabindex", "-1");
          targetElement.focus({ preventScroll: true });
        }
      };

      requestAnimationFrame(animation);
    };

    document.addEventListener("click", handleAnchorClick);

    return () => {
      document.removeEventListener("click", handleAnchorClick);
    };
  }, [duration, offset]);

  return null;
}
