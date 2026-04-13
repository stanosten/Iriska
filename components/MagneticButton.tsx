"use client";

import React, { ReactNode, ButtonHTMLAttributes, forwardRef, useRef, useEffect } from "react";

interface MagneticButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  distance?: number;
  strength?: number;
  className?: string;
}

const MagneticButton = forwardRef<HTMLButtonElement, MagneticButtonProps>(
  ({ children, distance = 15, strength = 0.1, className = "", ...props }, ref) => {
    const localRef = useRef<HTMLButtonElement | null>(null);

    useEffect(() => {
      const button = localRef.current;
      if (!button) return;

      // Accessibility: Disable for users with vestibular disorders
      const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const hasFinePointer = window.matchMedia("(pointer: fine)").matches;
      
      if (prefersReducedMotion || !hasFinePointer) return;

      let rafId = 0;
      let isHovered = false;

      const handleMouseMove = (e: MouseEvent) => {
        const rect = button.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        const distX = e.clientX - centerX;
        const distY = e.clientY - centerY;
        
        // Trigger area: max distance from button boundaries
        const isInsideMagneticField = 
          e.clientX >= rect.left - distance &&
          e.clientX <= rect.right + distance &&
          e.clientY >= rect.top - distance &&
          e.clientY <= rect.bottom + distance;

        if (isInsideMagneticField) {
          if (!isHovered) {
            isHovered = true;
            // Min 400ms transition for smooth pull
            button.style.transition = 'transform 0.45s cubic-bezier(0.25, 1, 0.5, 1)';
          }
          
          // Pull force calculation
          let pullX = distX * strength;
          let pullY = distY * strength;
          
          // Max displacement: 5px from natural position
          const maxDisplacement = 5;
          pullX = Math.max(-maxDisplacement, Math.min(maxDisplacement, pullX));
          pullY = Math.max(-maxDisplacement, Math.min(maxDisplacement, pullY));
          
          rafId = requestAnimationFrame(() => {
            button.style.transform = `translate(${pullX}px, ${pullY}px)`;
          });
        } else {
          if (isHovered) {
            isHovered = false;
            // Smooth fade-out when cursor leaves active zone
            rafId = requestAnimationFrame(() => {
              button.style.transition = 'transform 0.5s cubic-bezier(0.25, 1, 0.5, 1)';
              button.style.transform = `translate(0px, 0px)`;
            });
          }
        }
      };

      window.addEventListener("mousemove", handleMouseMove, { passive: true });

      return () => {
        window.removeEventListener("mousemove", handleMouseMove);
        cancelAnimationFrame(rafId);
      };
    }, [distance, strength]);

    const setRefs = (node: HTMLButtonElement | null) => {
      localRef.current = node;
      if (typeof ref === "function") {
        ref(node);
      } else if (ref) {
        ref.current = node;
      }
    };

    return (
      <button ref={setRefs} className={`${className} will-change-transform`} {...props}>
        {children}
      </button>
    );
  }
);

MagneticButton.displayName = "MagneticButton";
export default MagneticButton;
