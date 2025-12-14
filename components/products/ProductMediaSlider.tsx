"use client";

import type { ReactNode } from "react";
import type { ProductMedia } from "@/types/product";
import Image from "next/image";
interface ProductMediaSliderProps {
  media: ProductMedia[];
  activeIndex: number;
  onChangeActiveIndex: (index: number) => void;
  fallbackAlt?: string;
  contextNote?: ReactNode;
}

export default function ProductMediaSlider({
  media,
  activeIndex,
  onChangeActiveIndex,
  fallbackAlt,
  contextNote,
}: ProductMediaSliderProps) {
  if (!media || media.length === 0) {
    return (
      <div className="w-full h-72 bg-gray-100 rounded-xl flex items-center justify-center text-gray-500">
        No media available yet.
      </div>
    );
  }

  const clampedIndex = Math.min(Math.max(activeIndex, 0), media.length - 1);
  const activeMedia = media[clampedIndex];

  const handleChange = (nextIndex: number) => {
    if (!media || media.length === 0) return;
    const length = media.length;
    const wrappedIndex = ((nextIndex % length) + length) % length;
    onChangeActiveIndex(wrappedIndex);
  };

  const handlePrev = () => handleChange(clampedIndex - 1);
  const handleNext = () => handleChange(clampedIndex + 1);

  return (
    <div>
      <div className="relative mb-4 overflow-hidden rounded-xl border border-gray-200 bg-white">
        <div className="aspect-4/5 w-full bg-gray-50">
          {activeMedia.mediaType === "video" ? (
            <video
              src={activeMedia.url}
              controls
              className="h-full w-full object-cover"
            />
          ) : (
            <Image
            width={500}
            height={500}
              src={activeMedia.url}
              alt={activeMedia.altText || fallbackAlt || "Product media"}
              className="h-full w-full object-cover"
            />
          )}
        </div>

        {media.length > 1 && (
          <div className="pointer-events-none absolute inset-y-0 flex w-full items-center justify-between px-3">
            <button
              type="button"
              onClick={handlePrev}
              className="pointer-events-auto inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-gray-700 shadow hover:bg-white"
              aria-label="Previous media"
            >
              <span className="-ml-px text-lg">&lsaquo;</span>
            </button>
            <button
              type="button"
              onClick={handleNext}
              className="pointer-events-auto inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-gray-700 shadow hover:bg-white"
              aria-label="Next media"
            >
              <span className="ml-px text-lg">&rsaquo;</span>
            </button>
          </div>
        )}
      </div>

      {media.length > 1 && (
        <div className="flex gap-3 overflow-x-auto pb-2">
          {media.map((item, index) => (
            <button
              key={item.id}
              type="button"
              onClick={() => onChangeActiveIndex(index)}
              className={`h-20 w-20 shrink-0 overflow-hidden rounded-lg border ${
                index === clampedIndex
                  ? "border-[#310101] ring-2 ring-[#310101]/20"
                  : "border-transparent"
              }`}
            >
              {item.mediaType === "video" ? (
                <video
                  src={item.url}
                  className="h-full w-full object-cover"
                  muted
                />
              ) : (
                <Image
                  width={500}
                  height={500}
                  src={item.url}
                  alt={item.altText || fallbackAlt || "Product media"}
                  className="h-full w-full object-cover"
                />
              )}
            </button>
          ))}
        </div>
      )}

      {contextNote}
    </div>
  );
}
