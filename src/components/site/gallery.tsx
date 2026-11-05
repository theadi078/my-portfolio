"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import type { Media } from "@/models/common";

export function Gallery({ images, title }: { images: Media[]; title: string }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  useEffect(() => {
    if (openIndex === null) return;
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") setOpenIndex(null);
      if (event.key === "ArrowRight") setOpenIndex((i) => (i === null ? i : (i + 1) % images.length));
      if (event.key === "ArrowLeft") setOpenIndex((i) => (i === null ? i : (i - 1 + images.length) % images.length));
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [openIndex, images.length]);

  if (!images.length) return null;

  return (
    <>
      <ul className="grid gap-4 sm:grid-cols-2">
        {images.map((image, index) => (
          <li key={image.url}>
            <button
              type="button"
              onClick={() => setOpenIndex(index)}
              className="group relative block aspect-[16/10] w-full overflow-hidden rounded-card border border-line bg-raised"
            >
              <Image
                src={image.url}
                alt={image.alt || `${title} screenshot ${index + 1}`}
                fill
                sizes="(max-width: 640px) 100vw, 520px"
                className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
              />
            </button>
          </li>
        ))}
      </ul>

      {openIndex !== null ? (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`${title} screenshots`}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4"
          onClick={() => setOpenIndex(null)}
        >
          <div className="relative max-h-full w-full max-w-5xl" onClick={(event) => event.stopPropagation()}>
            <div className="relative aspect-[16/10] w-full">
              <Image
                src={images[openIndex].url}
                alt={images[openIndex].alt || `${title} screenshot ${openIndex + 1}`}
                fill
                sizes="90vw"
                className="rounded-card object-contain"
              />
            </div>
            <div className="mt-4 flex items-center justify-between">
              <button
                type="button"
                aria-label="Previous screenshot"
                onClick={() => setOpenIndex((i) => (i === null ? i : (i - 1 + images.length) % images.length))}
                className="grid h-10 w-10 place-items-center rounded-btn border border-white/25 text-white/80 hover:text-white"
              >
                <ChevronLeft size={18} />
              </button>
              <span className="text-[13px] text-white/70">
                {openIndex + 1} / {images.length}
              </span>
              <button
                type="button"
                aria-label="Next screenshot"
                onClick={() => setOpenIndex((i) => (i === null ? i : (i + 1) % images.length))}
                className="grid h-10 w-10 place-items-center rounded-btn border border-white/25 text-white/80 hover:text-white"
              >
                <ChevronRight size={18} />
              </button>
            </div>
            <button
              type="button"
              aria-label="Close"
              onClick={() => setOpenIndex(null)}
              className="absolute -top-12 right-0 grid h-10 w-10 place-items-center rounded-btn border border-white/25 text-white/80 hover:text-white"
            >
              <X size={18} />
            </button>
          </div>
        </div>
      ) : null}
    </>
  );
}
