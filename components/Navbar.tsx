"use client";

import Image from "next/image";
import { withBasePath } from "@/lib/basePath";

interface NavbarProps {
  onOpenMenu: () => void;
}

export default function Navbar({ onOpenMenu }: NavbarProps) {
  const homePath = withBasePath("/");
  const handleLogoClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    window.location.assign(homePath);
  };

  return (
    <nav className="fixed top-0 left-0 w-full z-40 p-6 md:p-8 lg:p-12 pointer-events-none mix-blend-difference text-white">
      <div className="flex justify-between items-center max-w-[1920px] mx-auto w-full">
        {/* Logo */}
        <a href={homePath} onClick={handleLogoClick} className="pointer-events-auto block group">
          <Image
            src={withBasePath("/img/iriska_logo.svg")}
            alt="Студия Ири&Ка"
            width={120}
            height={50}
            className="w-24 md:w-32 brightness-0 invert transition-all duration-500 ease-in-out will-change-transform group-hover:scale-110 group-hover:rotate-[-2deg] group-hover:-translate-y-1 group-hover:opacity-80"
            unoptimized
          />
        </a>

        {/* Menu Button */}
        <div className="pointer-events-auto">
          <button
            type="button"
            onClick={onOpenMenu}
            className="group relative flex items-center gap-4 py-2 px-4 transition-all duration-300 ease-in-out hover:bg-white/10 focus:bg-white/10 active:scale-95 focus:outline-none focus:ring-2 focus:ring-white/50 rounded-full"
            aria-label="Открыть меню"
          >
            <span className="text-sm md:text-base uppercase font-sans tracking-[0.2em] transition-colors duration-300 group-hover:text-white">
              Меню
              <span className="absolute bottom-1 left-4 w-[calc(100%-3rem)] h-[1px] bg-white transform scale-x-0 origin-left transition-transform duration-300 ease-out group-hover:scale-x-100"></span>
            </span>
            <div className="flex flex-col gap-1.5 w-8">
              <span className="h-[1px] w-full bg-white transition-all duration-300 ease-in-out group-hover:w-3/4 group-hover:-translate-y-[1px]"></span>
              <span className="h-[1px] w-3/4 bg-white ml-auto transition-all duration-300 ease-in-out group-hover:w-full group-hover:translate-y-[1px]"></span>
            </div>
          </button>
        </div>
      </div>
    </nav>
  );
}
