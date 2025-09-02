// Lazy loading component
'use client';

import { useState, useEffect, useRef, ReactNode } from 'react';

interface LazyLoadProps {
  children: ReactNode;
  placeholder?: ReactNode;
  offset?: number;
  onVisible?: () => void;
}

export default function LazyLoad({
  children,
  placeholder = null,
  offset = 100,
  onVisible
}: LazyLoadProps) {
  const [isVisible, setIsVisible] = useState(false);
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          onVisible?.();
          observer.unobserve(element);
        }
      },
      {
        rootMargin: `${offset}px`
      }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [offset, onVisible]);

  return (
    <div ref={elementRef}>
      {isVisible ? children : placeholder}
    </div>
  );
}