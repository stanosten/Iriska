"use client";

import { useEffect } from "react";
import { initScrollReveal } from "@/lib/scrollReveal";
import { usePathname } from "next/navigation";

export default function ScrollRevealInit() {
  const pathname = usePathname();

  useEffect(() => {
    // Small timeout to ensure DOM is fully rendered after route change
    const timer = setTimeout(() => {
      const cleanup = initScrollReveal();
      return cleanup;
    }, 50);

    return () => {
      clearTimeout(timer);
    };
  }, [pathname]);

  return null;
}
