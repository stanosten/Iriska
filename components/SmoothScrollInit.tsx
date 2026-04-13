"use client";

import { useEffect } from "react";
import Lenis from "lenis";

export default function SmoothScrollInit() {
  useEffect(() => {
    // Инициализация Lenis
    const lenis = new Lenis({
      duration: 1.2, // Длительность прокрутки (чем больше, тем плавнее и медленнее)
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Функция плавности
      orientation: "vertical", // Направление прокрутки
      gestureOrientation: "vertical", // Направление для жестов тачпада
      smoothWheel: true, // Плавная прокрутка колесиком мыши
      wheelMultiplier: 1, // Чувствительность колесика
      touchMultiplier: 2, // Чувствительность тачпада/сенсора
    });

    // Обновление анимации
    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    // Очистка при размонтировании
    return () => {
      lenis.destroy();
    };
  }, []);

  return null;
}
