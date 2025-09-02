// Image optimization component
'use client';

import { useState, useEffect, useRef } from 'react';

interface ImageOptimizationProps {
  src: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
  quality?: number;
  lazy?: boolean;
}

export default function ImageOptimization({
  src,
  alt,
  className = '',
  width,
  height,
  quality = 80,
  lazy = true
}: ImageOptimizationProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (!imgRef.current) return;
    
    const img = imgRef.current;
    
    const handleLoad = () => {
      setIsLoading(false);
    };
    
    const handleError = () => {
      setIsLoading(false);
      setIsError(true);
    };
    
    img.addEventListener('load', handleLoad);
    img.addEventListener('error', handleError);
    
    return () => {
      img.removeEventListener('load', handleLoad);
      img.removeEventListener('error', handleError);
    };
  }, [src]);

  // In a real implementation, this would connect to an image optimization service
  // For now, we'll just pass through the src but with optimization parameters
  const optimizedSrc = `${src}${src.includes('?') ? '&' : '?'}q=${quality}`;

  if (isError) {
    return (
      <div className={`bg-gray-800 flex items-center justify-center ${className}`} style={{ width, height }}>
        <div className="text-gray-600">Image not available</div>
      </div>
    );
  }

  return (
    <>
      {isLoading && (
        <div className={`bg-gray-800 animate-pulse ${className}`} style={{ width, height }} />
      )}
      <img
        ref={imgRef}
        src={optimizedSrc}
        alt={alt}
        className={`${className} ${isLoading ? 'hidden' : ''}`}
        width={width}
        height={height}
        loading={lazy ? 'lazy' : 'eager'}
        decoding="async"
        style={{ width, height }}
      />
    </>
  );
}