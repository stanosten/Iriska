"use client";

import { useEffect, useRef, useState } from "react";

interface AnimatedCounterProps {
  target: number;
  duration?: number;
  start?: number;
  suffix?: string;
  prefix?: string;
  className?: string;
  formatNumber?: boolean;
}

export default function AnimatedCounter({
  target,
  duration = 2000,
  start = 0,
  suffix = "",
  prefix = "",
  className = "",
  formatNumber = true,
}: AnimatedCounterProps) {
  const [count, setCount] = useState(start);
  const [isHovered, setIsHovered] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const [isCounting, setIsCounting] = useState(false);
  const elementRef = useRef<HTMLSpanElement>(null);
  
  // Refs for animation state
  const startTimeRef = useRef<number | null>(null);
  const currentCountRef = useRef(start);
  const rafIdRef = useRef<number | null>(null);
  const pausedTimeRef = useRef<number | null>(null);
  const totalPausedDurationRef = useRef(0);

  // Intersection Observer to start animation when visible
  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && !hasStarted) {
          setHasStarted(true);
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [hasStarted]);

  // Main animation loop
  useEffect(() => {
    if (!hasStarted) return;
    
    // Check if invalid target
    if (isNaN(target) || target === null || target === undefined) {
      setCount(target);
      return;
    }

    setIsCounting(true);

    const animate = (timestamp: number) => {
      if (startTimeRef.current === null) {
        startTimeRef.current = timestamp;
      }

      if (isHovered) {
        // Record pause start time
        if (pausedTimeRef.current === null) {
          pausedTimeRef.current = timestamp;
        }
        rafIdRef.current = requestAnimationFrame(animate);
        return;
      } else if (pausedTimeRef.current !== null) {
        // Add paused duration to total and reset
        totalPausedDurationRef.current += timestamp - pausedTimeRef.current;
        pausedTimeRef.current = null;
      }

      // Calculate elapsed time considering pauses
      const elapsed = timestamp - startTimeRef.current - totalPausedDurationRef.current;
      
      // Easing function (easeInOutCubic)
      const progress = Math.min(elapsed / duration, 1);
      const easeInOutCubic = progress < 0.5 
        ? 4 * progress * progress * progress 
        : 1 - Math.pow(-2 * progress + 2, 3) / 2;
      
      const nextCount = Math.floor(start + (target - start) * easeInOutCubic);
      
      if (currentCountRef.current !== nextCount) {
        currentCountRef.current = nextCount;
        setCount(nextCount);
      }

      if (progress < 1) {
        rafIdRef.current = requestAnimationFrame(animate);
      } else {
        setCount(target);
        setIsCounting(false);
      }
    };

    rafIdRef.current = requestAnimationFrame(animate);

    return () => {
      if (rafIdRef.current !== null) {
        cancelAnimationFrame(rafIdRef.current);
      }
    };
  }, [hasStarted, isHovered, target, duration, start]);

  const formattedCount = formatNumber 
    ? new Intl.NumberFormat("ru-RU").format(count) 
    : count.toString();

  // Return formatted string with error handling for fallback
  const displayValue = isNaN(target) ? target : `${prefix}${formattedCount}${suffix}`;

  return (
    <span
      ref={elementRef}
      className={`${className} inline-block transition-all duration-300 ease-in-out ${isCounting ? 'scale-[1.03] text-accent/90' : 'scale-100'}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      aria-label={`${target}${suffix}`}
    >
      {displayValue}
    </span>
  );
}