"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

const collections = [
  {
    title: "Royal Union",
    description: "Statement pieces for couples, woven with gold-thread details.",
    image: "/ui/couple.png",
    tag: "Signature Drop",
    href: "/products?category=couples",
  },
  {
    title: "Modern Minimal",
    description: "Neutral tones with architectural pleats for city moments.",
    image: "/ui/couple2.png",
    tag: "City Edit",
    href: "/products?category=modern",
  },
  {
    title: "Wollo Amhara Heritage",
    description: "An homage to northern artistry, reimagined for today.",
    image: "/ui/wolloamhara.png",
    tag: "Heritage Capsule",
    href: "/products?category=heritage",
  },
  {
    title: "Femina Luxe",
    description: "Fluid silhouettes finished with hand-stitched necklines.",
    image: "/ui/femaledress.png",
    tag: "Evening Wear",
    href: "/products?category=women",
  },
];

export default function FeaturedCollections() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <section
      id="collections"
      className="bg-gradient-to-b from-[#FFF9F0] to-white px-4 py-20 font-body sm:px-6 lg:px-8"
      aria-labelledby="collections-heading"
    >
      {/* Header */}
      <div className="mx-auto max-w-7xl space-y-4 text-center mb-16">
        <p className="font-heading text-sm uppercase tracking-[0.35em] text-[#CFAE56]">
          Collections
        </p>
        <h2
          id="collections-heading"
          className="font-heading text-4xl font-bold text-[#1E2A55] sm:text-5xl lg:text-6xl"
        >
          Featured Habesha Capsules
        </h2>
        <p className="mx-auto max-w-3xl text-lg text-[#1E2A55]/70">
          Discover artisanal drops that celebrate Ethiopian craft, luxury fabrics, and silhouettes made for the modern diaspora.
        </p>
      </div>

      {/* Collections Grid */}
      <div className="mx-auto max-w-7xl grid gap-8 md:grid-cols-2 lg:grid-cols-4">
        {collections.map((collection, index) => (
          <Link
            key={collection.title}
            href={collection.href}
            className="group block"
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(null)}
          >
            <article className="relative overflow-hidden bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-shadow">
              {/* Image */}
              <div className="relative aspect-[3/4] w-full overflow-hidden">
                <Image
                  src={collection.image}
                  alt={collection.title}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  className={`object-cover transition-transform duration-500 ${hoveredIndex === index ? "scale-110" : "scale-100"
                    }`}
                />

                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

                {/* Tag */}
                <div className="absolute top-6 left-4">
                  <span className="inline-flex rounded-full bg-white/95 backdrop-blur-sm px-3 py-1.5 text-[10px] font-bold uppercase tracking-wide text-[#1E2A55] shadow-md">
                    {collection.tag}
                  </span>
                </div>

                {/* Content Overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                  <h3 className="text-2xl font-bold mb-2">{collection.title}</h3>
                  <p className="text-sm text-white/90 mb-4">{collection.description}</p>

                  <div className="flex items-center gap-2 text-[#CFAE56] font-semibold">
                    <span>Explore Collection</span>
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </div>
                </div>
              </div>
            </article>
          </Link>
        ))}
      </div>

      {/* CTA */}
      <div className="text-center mt-12">
        <Link
          href="/products"
          className="inline-flex items-center justify-center rounded-full bg-[#1E2A55] px-8 py-4 font-heading text-base font-semibold text-white shadow-lg hover:bg-[#2A3A65] transition-colors"
        >
          View All Collections
          <svg className="ml-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </Link>
      </div>
    </section>
  );
}
