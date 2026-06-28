"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";

const fallbackImage =
  "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=900&q=80";

export function ProductImageCarousel({
  images,
  alt,
  href,
  priorityImage = false,
  sizes = "100vw",
  className = "",
}) {
  const imageUrls = useMemo(() => {
    const urls = Array.isArray(images) ? images.filter(Boolean) : [];
    return urls.length > 0 ? urls : [fallbackImage];
  }, [images]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const hasMultipleImages = imageUrls.length > 1;

  function handleScroll(event) {
    if (!hasMultipleImages) {
      return;
    }

    const { scrollLeft, clientWidth } = event.currentTarget;
    setCurrentIndex(Math.round(scrollLeft / Math.max(clientWidth, 1)));
  }

  const slides = imageUrls.map((imageUrl, index) => {
    return (
      <div key={`${imageUrl}-${index}`} className="relative aspect-square w-full shrink-0 snap-center bg-slate-100">
        <Image
          src={imageUrl}
          alt={alt}
          fill
          priority={priorityImage && index === 0}
          loading={priorityImage && index === 0 ? "eager" : "lazy"}
          fetchPriority={priorityImage && index === 0 ? "high" : "auto"}
          sizes={sizes}
          className="object-cover"
          unoptimized={imageUrl.startsWith("data:") || imageUrl.startsWith("blob:")}
        />
        {href && !hasMultipleImages ? (
          <Link href={href} className="absolute inset-0" aria-label={alt} />
        ) : null}
      </div>
    );
  });

  return (
    <div className={`relative ${className}`}>
      {hasMultipleImages ? (
        <div
          className="flex aspect-square snap-x snap-mandatory overflow-x-auto scroll-smooth [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          onScroll={handleScroll}
        >
          {slides}
        </div>
      ) : (
        <div className="aspect-square overflow-hidden bg-slate-100">{slides[0]}</div>
      )}

      {hasMultipleImages ? (
        <div className="absolute inset-x-0 bottom-3 flex justify-center gap-1.5">
          {imageUrls.map((imageUrl, index) => (
            <span
              key={`${imageUrl}-dot-${index}`}
              className={`h-2 rounded-full transition-all ${
                currentIndex === index ? "w-5 bg-white" : "w-2 bg-white/55"
              }`}
            />
          ))}
        </div>
      ) : null}
    </div>
  );
}
