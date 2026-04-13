"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Eye, CheckCircle2 } from "lucide-react";
import MagneticButton from "./MagneticButton";
import { openModal } from "./Modal";
import { openPriceModal } from "./PriceModal";

const services = [
  {
    title: "Классика",
    desc: "Максимально естественный взгляд. По одной искусственной ресничке на каждую натуральную.",
    image: "/img/resnicy.webp",
  },
  {
    title: "2D / 3D Объем",
    desc: "Пушистые и выразительные ресницы для яркого, но гармоничного образа.",
    image: "/img/2D3D.webp",
  },
  {
    title: "Трендовые эффекты",
    desc: "Мокрый эффект, лучики, цветное наращивание — всё для создания вашего уникального стиля.",
    image: "/img/trend.webp",
  },
];

export default function Lashes() {
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [loadedImages, setLoadedImages] = useState<Record<number, boolean>>({});
  const [errorImages, setErrorImages] = useState<Record<number, boolean>>({});

  useEffect(() => {
    // Preload images for smooth transition
    services.forEach((service, index) => {
      const img = new window.Image();
      img.src = service.image;
      img.onload = () => setLoadedImages((prev) => ({ ...prev, [index]: true }));
      img.onerror = () => setErrorImages((prev) => ({ ...prev, [index]: true }));
    });
  }, []);

  return (
    <section
      id="lashes"
      data-scroll-color-id="lashes"
      className="py-24 px-4 md:px-10 overflow-hidden bg-white/40"
    >
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col items-center mb-16 text-center" data-reveal="slide-up">
          <Eye className="w-10 h-10 text-accent mb-4" />
          <h2 className="font-heading text-4xl md:text-5xl">
            Профессиональное наращивание ресниц
          </h2>
          <p className="mt-4 text-lg max-w-2xl opacity-80">
            Подчеркните красоту ваших глаз с помощью безопасного наращивания.
            Мы используем только гипоаллергенные материалы премиум-класса.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div 
            className="relative h-[60vh] w-full rounded-2xl overflow-hidden bg-accent/5"
            aria-live="polite"
            aria-atomic="true"
            data-reveal="slide-right"
            data-reveal-duration="1000ms"
          >
            {services.map((service, index) => {
              const isError = errorImages[index];
              const isActive = activeIndex === index;

              if (isError) {
                return (
                  <div 
                    key={`fallback-${index}`}
                    className={`absolute inset-0 flex items-center justify-center bg-accent/10 transition-opacity duration-700 ease-in-out ${isActive ? "opacity-100 z-10" : "opacity-0 z-0"}`}
                  >
                    <span className="opacity-50">Изображение недоступно</span>
                  </div>
                );
              }

              return (
                <Image
                  key={service.image}
                  src={service.image}
                  alt={`Наращивание ресниц: ${service.title}`}
                  fill
                  className={`object-cover transition-opacity duration-700 ease-in-out ${isActive ? "opacity-100 z-10" : "opacity-0 z-0"} ${loadedImages[index] ? "blur-0" : "blur-sm"}`}
                  unoptimized
                  priority={index === 0}
                  onLoad={() => setLoadedImages((prev) => ({ ...prev, [index]: true }))}
                  onError={() => setErrorImages((prev) => ({ ...prev, [index]: true }))}
                />
              );
            })}
          </div>

          <div 
            className="flex flex-col gap-6"
            onMouseLeave={() => setActiveIndex(0)}
            data-reveal="slide-left"
            data-reveal-duration="1000ms"
            data-reveal-delay="200ms"
          >
            {services.map((service, index) => {
              const isActive = activeIndex === index;
              return (
                <div
                  key={index}
                  onMouseEnter={() => setActiveIndex(index)}
                  className={`p-6 rounded-2xl border backdrop-blur-sm cursor-pointer transition-all duration-300 ${
                    isActive
                      ? "bg-background/90 border-accent/30 shadow-md scale-[1.02]"
                      : "bg-background/60 border-accent/10 hover:bg-background/70 hover:scale-[1.01]"
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <CheckCircle2 className={`w-6 h-6 shrink-0 mt-1 transition-colors duration-300 ${isActive ? "text-accent" : "text-accent/50"}`} />
                    <div>
                      <h3 className="font-heading text-2xl mb-2">{service.title}</h3>
                      <p className="opacity-80 leading-relaxed">{service.desc}</p>
                    </div>
                  </div>
                </div>
              );
            })}
            
            <div className="mt-6 flex flex-wrap gap-4 items-center">
              <MagneticButton
                type="button"
                onClick={openModal}
                className="inline-flex items-center justify-center bg-accent text-white px-8 py-4 rounded-full font-medium"
              >
                Записаться онлайн
              </MagneticButton>
              <MagneticButton 
                type="button"
                onClick={openPriceModal}
                className="bg-foreground text-background px-8 py-4 rounded-full font-medium"
              >
                Узнать стоимость
              </MagneticButton>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
