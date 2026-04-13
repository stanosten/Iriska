export function initScrollReveal() {
  if (typeof window === "undefined") return () => {};

  // Проверка настроек пользователя (отключение анимаций для предпочитающих уменьшенное движение)
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (prefersReducedMotion) {
    return () => {};
  }

  const elements = Array.from(document.querySelectorAll<HTMLElement>("[data-reveal]"));
  if (elements.length === 0) return () => {};

  // Инициализация стилей элементов
  elements.forEach((el) => {
    const type = el.dataset.reveal || "fade";
    el.classList.add("reveal-element", `reveal-${type}`);
    
    // Кастомные настройки для каждого элемента
    const duration = el.dataset.revealDuration || "800ms";
    const delay = el.dataset.revealDelay || "0ms";
    const easing = el.dataset.revealEasing || "cubic-bezier(0.25, 1, 0.5, 1)";
    
    el.style.transitionDuration = duration;
    el.style.transitionDelay = delay;
    el.style.transitionTimingFunction = easing;
  });

  let cleanup = () => {};

  const hasObserver = typeof window !== "undefined" && "IntersectionObserver" in window;

  if (hasObserver) {
    // Группируем наблюдателей по порогу срабатывания (threshold) для оптимизации
    const observers = new Map<number, IntersectionObserver>();

    elements.forEach((el) => {
      const threshold = parseFloat(el.dataset.revealThreshold || "0.15");

      let observer = observers.get(threshold);
      if (!observer) {
        observer = new IntersectionObserver(
          (entries, obs) => {
            entries.forEach((entry) => {
              const target = entry.target as HTMLElement;
              const isOnce = target.dataset.revealOnce !== "false"; // По умолчанию true
              
              if (entry.isIntersecting) {
                target.classList.add("is-revealed");
                if (isOnce) {
                  obs.unobserve(target);
                }
              } else if (!isOnce) {
                target.classList.remove("is-revealed");
              }
            });
          },
          {
            root: null,
            rootMargin: "0px 0px -5% 0px",
            threshold: threshold,
          }
        );
        observers.set(threshold, observer);
      }
      observer.observe(el);
    });

    cleanup = () => {
      observers.forEach((obs) => obs.disconnect());
    };
  } else {
    // Fallback: ручная проверка позиции для браузеров без Intersection Observer
    const throttle = (func: () => void, limit: number) => {
      let inThrottle: boolean = false;
      return function() {
        if (!inThrottle) {
          func();
          inThrottle = true;
          window.setTimeout(() => (inThrottle = false), limit);
        }
      };
    };

    const handleScroll = throttle(() => {
      const viewportHeight = window.innerHeight;
      elements.forEach((el) => {
        if (el.classList.contains("is-revealed")) return;
        const rect = el.getBoundingClientRect();
        const threshold = parseFloat(el.dataset.revealThreshold || "0.15");
        
        // Если верхняя граница элемента пересекла нужный порог видимой области
        if (rect.top <= viewportHeight * (1 - threshold)) {
          el.classList.add("is-revealed");
        }
      });
    }, 50);

    handleScroll(); // Первоначальная проверка
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll, { passive: true });

    cleanup = () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }

  return cleanup;
}
