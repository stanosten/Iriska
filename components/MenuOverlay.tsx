"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { X, ArrowRight } from "lucide-react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

export default function MenuOverlay({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isMounted, setIsMounted] = useState(false);

  // Mount/Unmount sync
  useEffect(() => {
    if (isOpen) {
      setIsMounted(true);
    }
  }, [isOpen]);

  // Handle Escape key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) onClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [isOpen, onClose]);

  // Body scroll lock
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const links = [
    { name: "Главная", href: "/" },
    { name: "Маникюр", href: "#nails" },
    { name: "Ресницы", href: "#lashes" },
    { name: "Контакты", href: "#contacts" },
  ];

  useGSAP(
    () => {
      if (!isMounted) return;

      const tl = gsap.timeline({
        onReverseComplete: () => setIsMounted(false),
      });

      if (isOpen) {
        // Open animation
        tl.fromTo(
          containerRef.current,
          { 
            yPercent: -100, 
            scale: 0.95,
            opacity: 0,
            borderRadius: "0 0 50% 50%" 
          },
          {
            yPercent: 0,
            scale: 1,
            opacity: 1,
            borderRadius: "0%",
            duration: 0.6,
            ease: "power3.inOut",
            clearProps: "transform",
          }
        ).fromTo(
          ".menu-item",
          { y: 100, opacity: 0, rotate: 5 },
          {
            y: 0,
            opacity: 1,
            rotate: 0,
            duration: 0.5,
            stagger: 0.05,
            ease: "back.out(1.7)",
          },
          "-=0.2"
        ).fromTo(
          ".menu-fade",
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.4, stagger: 0.1, ease: "power2.out" },
          "-=0.4"
        );
      } else {
        // Close animation
        tl.to(".menu-fade", { opacity: 0, y: -20, duration: 0.2, stagger: 0.02, ease: "power2.in" })
          .to(".menu-item", { y: -50, opacity: 0, duration: 0.3, stagger: 0.02, ease: "power2.in" }, "<")
          .to(containerRef.current, {
            yPercent: -100,
            scale: 0.95,
            opacity: 0,
            borderRadius: "0 0 50% 50%",
            duration: 0.5,
            ease: "power3.inOut",
          }, "<0.1");
      }
    },
    { dependencies: [isOpen, isMounted], scope: containerRef }
  );

  if (!isMounted) return null;

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 w-full h-screen bg-foreground text-background z-[100] flex flex-col justify-between p-6 md:p-12 lg:p-24 overflow-hidden will-change-transform"
      role="dialog"
      aria-modal="true"
      aria-label="Навигационное меню"
    >
      <div className="flex justify-between items-center w-full menu-fade">
        <div className="group block">
          <Image 
            src="/img/iriska_logo.svg" 
            alt="Студия Ири&Ка" 
            width={120} 
            height={50} 
            className="w-24 md:w-32 invert transition-transform duration-500 group-hover:scale-110 group-hover:rotate-2"
            unoptimized
          />
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Закрыть меню"
          className="group flex items-center gap-4 py-4 px-6 uppercase font-sans tracking-[0.2em] text-sm md:text-base rounded-full transition-all duration-300 hover:bg-background/10 focus:bg-background/10 active:scale-95 focus:outline-none focus:ring-2 focus:ring-background/50"
        >
          <span className="block transition-transform duration-300 group-hover:-translate-x-1">Закрыть</span>
          <X className="w-6 h-6 transition-transform duration-300 group-hover:rotate-90 group-hover:scale-110" />
        </button>
      </div>

      <div className="flex flex-col lg:flex-row justify-between items-end lg:items-center w-full mt-10 lg:mt-0 flex-1 overflow-y-auto lg:overflow-visible">
        {/* Navigation Links */}
        <ul className="flex flex-col gap-2 md:gap-4 w-full">
          {links.map((link, i) => (
            <li key={i} className="overflow-hidden w-fit">
              <a
                href={link.href}
                onClick={onClose}
                className="menu-item group flex items-center gap-4 font-heading text-5xl md:text-7xl lg:text-[9vw] leading-[1.1] uppercase text-background transition-colors duration-300 focus:outline-none focus-visible:text-accent hover:text-accent"
              >
                <ArrowRight className="w-8 h-8 md:w-12 md:h-12 opacity-0 -translate-x-8 transition-all duration-300 ease-out group-hover:opacity-100 group-hover:translate-x-0 group-focus-visible:opacity-100 group-focus-visible:translate-x-0" />
                <span className="relative transition-transform duration-300 group-hover:translate-x-2 group-focus-visible:translate-x-2 group-active:scale-95 origin-left">
                  {link.name}
                  <span className="absolute left-0 -bottom-2 w-full h-[2px] bg-accent transform scale-x-0 origin-left transition-transform duration-500 ease-out group-hover:scale-x-100 group-focus-visible:scale-x-100"></span>
                </span>
              </a>
            </li>
          ))}
        </ul>

        {/* Footer (Contacts & Socials) */}
        <div className="flex flex-col gap-8 text-sm md:text-base font-sans max-w-xs mt-16 lg:mt-0 pb-8 lg:pb-0 text-right lg:text-left w-full lg:w-auto items-end lg:items-start text-background/60">
          <div className="flex flex-col items-end lg:items-start group menu-fade">
            <h4 className="text-accent mb-2 uppercase tracking-widest text-[10px] opacity-80">Контакты</h4>
            <a
              href="tel:+79991234567"
              className="block text-background transition-colors duration-300 hover:text-accent focus-visible:text-accent focus:outline-none"
            >
              +7 (999) 123-45-67
            </a>
            <a
              href="mailto:hello@iriska.ru"
              className="block text-background transition-colors duration-300 hover:text-accent focus-visible:text-accent focus:outline-none"
            >
              hello@iriska.ru
            </a>
          </div>

          <div className="flex flex-col items-end lg:items-start menu-fade">
            <h4 className="text-accent mb-2 uppercase tracking-widest text-[10px] opacity-80">Соцсети</h4>
            <div className="flex gap-6">
              {[
                { name: "Instagram", href: "https://instagram.com" },
                { name: "Telegram", href: "https://t.me" },
                { name: "VK", href: "https://vk.com" },
              ].map((social) => (
                <a 
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-background relative overflow-hidden group transition-colors duration-300 hover:text-accent focus-visible:text-accent focus:outline-none"
                >
                  <span className="relative z-10">{social.name}</span>
                  <span className="absolute bottom-0 left-0 w-full h-[1px] bg-accent transform scale-x-0 origin-right transition-transform duration-300 group-hover:scale-x-100 group-hover:origin-left"></span>
                </a>
              ))}
            </div>
          </div>

          <div className="flex flex-col items-end lg:items-start menu-fade">
            <h4 className="text-accent mb-2 uppercase tracking-widest text-[10px] opacity-80">Адрес</h4>
            <p className="text-right lg:text-left text-background leading-relaxed">
              Москва, Хорошёвское шоссе, 82 к1
              <br />
              Ежедневно с 10:00 до 22:00
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
