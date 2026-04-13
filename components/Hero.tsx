"use client";

import { type MouseEvent } from "react";
import Image from "next/image";

import MagneticButton from "./MagneticButton";
import { openModal } from "./Modal";
import { scrollToSection } from "@/lib/heroCursor";
import { withBasePath } from "@/lib/basePath";

export default function Hero() {
  const handleImageClick = (e: MouseEvent<HTMLAnchorElement>, type: "nails" | "lashes") => {
    e.preventDefault();
    scrollToSection(type);
  };

  return (
    <section
      data-scroll-color-id="hero"
      className="relative min-h-screen flex items-center justify-center bg-background overflow-hidden py-24 px-6 md:px-12 lg:px-24"
    >
      <div className="max-w-7xl w-full grid grid-cols-1 lg:grid-cols-2 gap-16 items-center z-10">
        
        {/* Text Content */}
        <div className="flex flex-col gap-8 order-2 lg:order-1" data-reveal="slide-up" data-reveal-duration="1000ms" data-reveal-delay="200ms">
          <h1 className="font-heading text-foreground text-4xl md:text-6xl leading-tight">
            Студия Ири&Ка: Маникюр и Наращивание ресниц в Москве
          </h1>
          
          <div className="flex flex-col gap-4">
            <p className="text-foreground font-sans text-base md:text-lg opacity-90 leading-relaxed">
              Профессиональный уход за ногтями и создание идеального взгляда. Качество, проверенное временем, в уютной атмосфере.
            </p>
            <p className="text-foreground font-sans text-sm md:text-base opacity-75 leading-relaxed">
              Мы используем только премиальные сертифицированные материалы для маникюра и наращивания ресниц. Наша студия гарантирует абсолютную безопасность благодаря трехэтапной стерилизации инструментов. Доверьте свою красоту профессионалам и наслаждайтесь безупречным результатом.
            </p>
          </div>
          
          <div className="pt-4">
            <MagneticButton
              type="button"
              onClick={openModal}
              className="bg-accent text-white px-10 py-4 rounded-full font-medium shadow-lg shadow-accent/20"
            >
              Записаться онлайн
            </MagneticButton>
          </div>
        </div>

        {/* Images Composition (Asymmetrical) */}
        <div className="relative h-[60vh] lg:h-[80vh] w-full order-1 lg:order-2 flex items-center justify-center">
          
          {/* Decorative Blur */}
          <div className="absolute inset-0 w-full h-full bg-accent/5 rounded-full blur-[100px] -z-10" />

          {/* Image 1: Top Left (Larger) - Interactive Anchor */}
          <a
            href="#nails"
            className="absolute top-[5%] left-0 w-[70%] h-[60%] rounded-3xl overflow-hidden shadow-[0_20px_40px_-15px_rgba(61,43,31,0.15)] z-10 backdrop-blur-sm border border-white/30 block group"
            aria-label="Перейти к разделу Маникюр и педикюр"
            onClick={(e) => handleImageClick(e, "nails")}
            data-cursor-text="nail-мастер\nИрина"
            data-cursor-bg="#BCCCD2"
            data-reveal="slide-right"
            data-reveal-delay="400ms"
            data-reveal-duration="1000ms"
          >
            <Image
              src={withBasePath("/img/hero_photo1.webp")}
              alt="Маникюр в студии Ири&Ка"
              fill
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              priority
              unoptimized
            />
          </a>
          
          {/* Image 2: Bottom Right (Smaller, Overlapping) */}
          <a
            href="#lashes"
            className="absolute bottom-[5%] right-0 w-[55%] h-[55%] rounded-3xl overflow-hidden shadow-[0_20px_40px_-15px_rgba(61,43,31,0.2)] z-20 backdrop-blur-sm border border-white/30 block group"
            aria-label="Перейти к разделу Наращивание ресниц"
            onClick={(e) => handleImageClick(e, "lashes")}
            data-cursor-text="лешмейкер\nКатерина"
            data-cursor-bg="#F9C344"
            data-reveal="slide-left"
            data-reveal-delay="600ms"
            data-reveal-duration="1000ms"
          >
            <Image
              src={withBasePath("/img/hero_photo2.webp")}
              alt="Наращивание ресниц в студии Ири&Ка"
              fill
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              priority
              unoptimized
            />
          </a>
          
        </div>
      </div>
    </section>
  );
}
