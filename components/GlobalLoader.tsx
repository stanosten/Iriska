"use client";

import { useEffect, useState } from "react";
import { LoaderCircle } from "lucide-react";

interface LoaderProps {
  /**
   * Минимальное время отображения лоадера (в миллисекундах)
   * Нужно для того, чтобы лоадер не моргал, если страница загрузилась слишком быстро
   */
  minDisplayTime?: number;
  /**
   * Цвет спиннера (по умолчанию используется цвет текста - bg-foreground/text-foreground)
   */
  spinnerColorClass?: string;
  /**
   * Цвет фона (по умолчанию bg-background)
   */
  bgColorClass?: string;
}

export default function GlobalLoader({
  minDisplayTime = 800,
  spinnerColorClass = "text-accent",
  bgColorClass = "bg-background",
}: LoaderProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [isFadingOut, setIsFadingOut] = useState(false);

  useEffect(() => {
    const startTime = Date.now();

    const hideLoader = () => {
      const elapsedTime = Date.now() - startTime;
      const remainingTime = Math.max(0, minDisplayTime - elapsedTime);

      setTimeout(() => {
        setIsFadingOut(true);
        // Даем время на CSS-анимацию fade-out (500ms) перед полным удалением из DOM
        setTimeout(() => {
          setIsLoading(false);
          // Восстанавливаем скролл после загрузки
          document.body.style.overflow = "";
        }, 500);
      }, remainingTime);
    };

    // Блокируем скролл во время загрузки
    document.body.style.overflow = "hidden";

    if (document.readyState === "complete") {
      hideLoader();
    } else {
      window.addEventListener("load", hideLoader);
      return () => window.removeEventListener("load", hideLoader);
    }
  }, [minDisplayTime]);

  if (!isLoading) return null;

  return (
    <div
      role="progressbar"
      aria-busy="true"
      aria-label="Загрузка контента"
      className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center ${bgColorClass} transition-opacity duration-500 ease-in-out ${
        isFadingOut ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
    >
      <div className="relative flex flex-col items-center">
        {/* Анимированный спиннер */}
        <LoaderCircle 
          className={`w-12 h-12 md:w-16 md:h-16 animate-spin ${spinnerColorClass}`} 
          strokeWidth={1.5}
        />
        
        {/* Текстовый индикатор */}
        <span className="mt-6 text-sm md:text-base font-heading tracking-[0.2em] text-foreground uppercase opacity-80 animate-pulse">
          Загрузка
        </span>
      </div>
    </div>
  );
}
