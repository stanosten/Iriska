"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { withBasePath } from "@/lib/basePath";

const portfolioData = [
  {
    category: "Наращивание ресниц",
    items: [
      { id: "lash-1", src: "/img/lash1.webp", alt: "Наращивание ресниц: классический объем, выразительный взгляд" },
      { id: "lash-2", src: "/img/lash2.webp", alt: "Наращивание ресниц: лисий эффект, густые ресницы" },
      { id: "lash-3", src: "/img/lash3.webp", alt: "Наращивание ресниц: натуральный эффект, повседневный стиль" },
      { id: "lash-4", src: "/img/lash4.webp", alt: "Наращивание ресниц: 3D объем, яркий образ" },
    ],
  },
  {
    category: "Маникюр",
    items: [
      { id: "nail-1", src: "/img/nail1.webp", alt: "Маникюр: аппаратный маникюр с нюдовым покрытием" },
      { id: "nail-2", src: "/img/nail2.webp", alt: "Маникюр: яркий дизайн ногтей, стильный нейл-арт" },
      { id: "nail-3", src: "/img/nail3.webp", alt: "Маникюр: классический френч, элегантные ногти" },
      { id: "nail-4", src: "/img/nail4.webp", alt: "Маникюр: комбинированный маникюр с матовым топом" },
    ],
  },
];

const getGridClasses = (index: number) => {
  // Асимметричная сетка 7-5 / 5-7
  switch (index % 4) {
    case 0:
      return "md:col-span-7 h-[350px] md:h-[500px]";
    case 1:
      return "md:col-span-5 h-[350px] md:h-[500px]";
    case 2:
      return "md:col-span-5 h-[350px] md:h-[500px]";
    case 3:
      return "md:col-span-7 h-[350px] md:h-[500px]";
    default:
      return "md:col-span-12 h-[350px]";
  }
};

const ANIMATION_MS = 400;

type PortfolioItem = {
  id: string;
  src: string;
  alt: string;
};

const flatPortfolioItems: PortfolioItem[] = portfolioData.flatMap((section) => section.items);

export default function Portfolio() {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [isLightboxVisible, setIsLightboxVisible] = useState(false);
  const preloadedImagesRef = useRef<Set<string>>(new Set());
  const closeTimeoutRef = useRef<number | null>(null);

  const selectedImage = selectedIndex !== null ? flatPortfolioItems[selectedIndex] : null;

  const preloadImage = useCallback((src: string) => {
    if (preloadedImagesRef.current.has(src)) return;
    const image = new window.Image();
    image.decoding = "async";
    image.src = withBasePath(src);
    preloadedImagesRef.current.add(src);
  }, []);

  const preloadAroundIndex = useCallback((index: number) => {
    [-1, 0, 1].forEach((offset) => {
      const targetIndex = (index + offset + flatPortfolioItems.length) % flatPortfolioItems.length;
      const targetItem = flatPortfolioItems[targetIndex];
      preloadImage(targetItem.src);
    });
  }, [preloadImage]);

  const preloadAroundItem = useCallback((itemId: string) => {
    const index = flatPortfolioItems.findIndex((item) => item.id === itemId);
    if (index === -1) return;
    preloadAroundIndex(index);
  }, [preloadAroundIndex]);

  const closeLightbox = useCallback(() => {
    if (selectedIndex === null) return;
    setIsLightboxVisible(false);
    if (closeTimeoutRef.current) {
      window.clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
    closeTimeoutRef.current = window.setTimeout(() => {
      setSelectedIndex(null);
      closeTimeoutRef.current = null;
    }, ANIMATION_MS);
  }, [selectedIndex]);

  const openLightbox = useCallback((item: PortfolioItem) => {
    const index = flatPortfolioItems.findIndex((entry) => entry.id === item.id);
    if (index === -1) return;
    if (closeTimeoutRef.current) {
      window.clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
    preloadAroundIndex(index);
    setIsLightboxVisible(false);
    setSelectedIndex(index);
  }, [preloadAroundIndex]);

  const navigateLightbox = useCallback((step: -1 | 1) => {
    if (selectedIndex === null) return;
    const nextIndex =
      (selectedIndex + step + flatPortfolioItems.length) % flatPortfolioItems.length;
    preloadAroundIndex(nextIndex);
    setSelectedIndex(nextIndex);
    setIsLightboxVisible(true);
  }, [selectedIndex, preloadAroundIndex]);

  // Обработчик клавиши Escape для закрытия полноэкранного режима
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && selectedIndex !== null) {
        closeLightbox();
      }
      if (e.key === "ArrowRight" && selectedIndex !== null) {
        navigateLightbox(1);
      }
      if (e.key === "ArrowLeft" && selectedIndex !== null) {
        navigateLightbox(-1);
      }
    };

    if (selectedIndex !== null) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [selectedIndex, closeLightbox, navigateLightbox]);

  useEffect(() => {
    if (selectedIndex === null) return;
    const rafId = window.requestAnimationFrame(() => {
      setIsLightboxVisible(true);
    });
    return () => {
      window.cancelAnimationFrame(rafId);
    };
  }, [selectedIndex]);

  useEffect(() => {
    const timerId = window.setTimeout(() => {
      flatPortfolioItems.forEach((item) => preloadImage(item.src));
    }, 200);
    return () => {
      window.clearTimeout(timerId);
    };
  }, [preloadImage]);

  useEffect(() => {
    return () => {
      if (closeTimeoutRef.current) {
        window.clearTimeout(closeTimeoutRef.current);
      }
    };
  }, []);

  return (
    <section
      aria-labelledby="portfolio-heading"
      data-scroll-color-id="portfolio"
      className="py-24 bg-foreground text-background"
    >
      <div className="container mx-auto px-4 md:px-10 max-w-[1400px]">
        <h2 
          id="portfolio-heading" 
          className="text-4xl md:text-6xl lg:text-7xl font-heading mb-16 text-center"
          data-reveal="slide-up"
        >
          Портфолио
        </h2>

        <div className="space-y-24">
          {portfolioData.map((section) => (
            <div key={section.category}>
              <h3 className="text-2xl md:text-4xl font-heading mb-8 border-b border-background/20 pb-4 inline-block" data-reveal="slide-right">
                {section.category}
              </h3>
              
              <ul className="grid grid-cols-1 md:grid-cols-12 gap-2 md:gap-4 list-none p-0 m-0">
                {section.items.map((item, index) => (
                  <li 
                    key={item.id} 
                    className={`${getGridClasses(index)} relative overflow-hidden group bg-background/5`}
                    data-reveal="scale"
                    data-reveal-delay={`${(index % 4) * 150}ms`}
                    data-reveal-duration="800ms"
                  >
                    <figure className="w-full h-full m-0 relative flex items-center justify-center">
                      <Image
                        src={withBasePath(item.src)}
                        alt={item.alt}
                        fill
                        loading="lazy"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 70vw"
                        className="object-cover transition-transform duration-500 ease-out group-hover:scale-105 transform-gpu will-change-transform"
                        unoptimized
                      />
                      {/* Плавный Hover-эффект с изменением прозрачности и микро-движением */}
                      <div 
                        className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-colors duration-500 ease-out z-10 flex items-center justify-center cursor-pointer"
                        onClick={() => openLightbox(item)}
                        onMouseEnter={() => preloadAroundItem(item.id)}
                        onFocus={() => preloadAroundItem(item.id)}
                        data-portfolio-id={item.id}
                      >
                        <figcaption 
                          className="text-white opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-500 ease-out font-heading text-2xl tracking-wider uppercase border border-white px-6 py-3 min-h-[44px] min-w-[44px] flex items-center justify-center hover:bg-white hover:text-black" 
                          aria-label={`Увеличить ${item.alt}`}
                        >
                          Смотреть
                        </figcaption>
                      </div>
                    </figure>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Полноэкранный режим (Lightbox) */}
        {selectedImage && (
          <div 
            className="fixed inset-0 z-[99999] pointer-events-auto"
            role="dialog"
            aria-modal="true"
          >
            <div
              className={`absolute inset-0 bg-black/90 transition-opacity duration-[400ms] ease-out will-change-opacity motion-reduce:transition-none ${isLightboxVisible ? "opacity-100" : "opacity-0"}`}
              onClick={closeLightbox}
              aria-hidden="true"
            />

            <button 
              className={`absolute top-4 right-4 md:top-8 md:right-8 text-white/70 hover:text-white p-2 z-50 cursor-pointer transition-all duration-[400ms] ease-out transform-gpu will-change-transform will-change-opacity motion-reduce:transition-none ${isLightboxVisible ? "opacity-100 translate-y-0 scale-100" : "opacity-0 -translate-y-3 scale-95"}`}
              onClick={closeLightbox}
              aria-label="Закрыть полноэкранный режим"
            >
              <X className="w-8 h-8 md:w-10 md:h-10" />
            </button>

            <button
              className={`absolute left-2 md:left-6 top-1/2 -translate-y-1/2 text-white/75 hover:text-white p-2 md:p-3 z-50 cursor-pointer transition-all duration-[400ms] ease-out transform-gpu will-change-transform will-change-opacity motion-reduce:transition-none ${isLightboxVisible ? "opacity-100 scale-100" : "opacity-0 scale-95"}`}
              onClick={() => navigateLightbox(-1)}
              aria-label="Предыдущее изображение"
            >
              <ChevronLeft className="w-8 h-8 md:w-10 md:h-10" />
            </button>

            <button
              className={`absolute right-2 md:right-6 top-1/2 -translate-y-1/2 text-white/75 hover:text-white p-2 md:p-3 z-50 cursor-pointer transition-all duration-[400ms] ease-out transform-gpu will-change-transform will-change-opacity motion-reduce:transition-none ${isLightboxVisible ? "opacity-100 scale-100" : "opacity-0 scale-95"}`}
              onClick={() => navigateLightbox(1)}
              aria-label="Следующее изображение"
            >
              <ChevronRight className="w-8 h-8 md:w-10 md:h-10" />
            </button>

            <div
              className="absolute inset-0 z-40 p-4 md:p-8 flex items-center justify-center"
              onClick={(e) => e.stopPropagation()}
            >
              <div
                className={`relative w-full h-full max-w-6xl max-h-[90vh] transition-all duration-[400ms] ease-out transform-gpu will-change-transform will-change-opacity motion-reduce:transition-none ${isLightboxVisible ? "opacity-100 scale-100" : "opacity-0 scale-90"}`}
              >
              <Image 
                src={withBasePath(selectedImage.src)}
                alt={selectedImage.alt}
                fill
                priority
                sizes="100vw"
                className="object-contain"
                unoptimized
              />
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
