"use client";

import Image from "next/image";
import { useState } from "react";

const testimonials = [
  {
    name: "Selamawit T.",
    location: "Addis Ababa",
    quote:
      "The detailing is couture-level. I wore the custom netela for my wedding brunch and the compliments have not stopped.",
    rating: 5,
    image: "https://ui-avatars.com/api/?name=Selamawit+T&background=CFAE56&color=1E2A55&size=200",
  },
  {
    name: "Kaleb G.",
    location: "Washington DC",
    quote:
      "Finally a Habesha brand that ships fast and respects the craft. The couple set fit perfectly straight out of the box.",
    rating: 5,
    image: "https://ui-avatars.com/api/?name=Kaleb+G&background=1E2A55&color=CFAE56&size=200",
  },
  {
    name: "Hanna M.",
    location: "Bahir Dar",
    quote:
      "I loved that they captured northern patterns but modernized the cut. Their stylist guided me through every step.",
    rating: 5,
    image: "https://ui-avatars.com/api/?name=Hanna+M&background=CFAE56&color=1E2A55&size=200",
  },
];

export default function Testimonials() {
  const [activeIndex, setActiveIndex] = useState(0);

  const renderStars = (rating: number) => {
    return (
      <div className="flex gap-1">
        {[...Array(5)].map((_, i) => (
          <svg
            key={i}
            className={`h-5 w-5 ${i < rating ? "text-yellow-400" : "text-gray-300"}`}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>
    );
  };

  return (
    <section className="bg-gradient-to-b from-white to-[#FFF9F0] px-4 py-20 font-body sm:px-6 lg:px-8" aria-labelledby="testimonials-heading">
      {/* Header */}
      <div className="mx-auto max-w-7xl text-center mb-16">
        <p className="font-heading text-sm uppercase tracking-[0.35em] text-[#CFAE56]">
          Customer Stories
        </p>
        <h2 id="testimonials-heading" className="mt-4 font-heading text-4xl font-bold text-[#1E2A55] sm:text-5xl lg:text-6xl">
          Loved by Habesha Trendsetters
        </h2>
        <p className="mt-4 text-lg text-[#1E2A55]/70 max-w-3xl mx-auto">
          Real reviews from our community of satisfied customers across the globe.
        </p>
      </div>

      {/* Testimonials Grid */}
      <div className="mx-auto max-w-7xl grid gap-8 md:grid-cols-3">
        {testimonials.map((testimonial, index) => (
          <article
            key={testimonial.name}
            className="relative bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-shadow border border-gray-100"
          >
            {/* Quote Icon */}
            <div className="absolute top-6 right-6 opacity-10">
              <svg className="h-16 w-16 text-[#CFAE56]" fill="currentColor" viewBox="0 0 24 24">
                <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
              </svg>
            </div>

            {/* Rating */}
            <div className="mb-4">
              {renderStars(testimonial.rating)}
            </div>

            {/* Quote */}
            <p className="text-base text-[#1E2A55]/80 leading-relaxed mb-6 italic">
              "{testimonial.quote}"
            </p>

            {/* Author */}
            <div className="flex items-center gap-4 pt-6 border-t border-gray-100">
              <div className="relative h-14 w-14 overflow-hidden rounded-full ring-2 ring-[#CFAE56]/20">
                <Image
                  src={testimonial.image}
                  alt={testimonial.name}
                  fill
                  sizes="56px"
                  className="object-cover"
                />
              </div>
              <div>
                <p className="font-heading text-base font-bold text-[#1E2A55]">
                  {testimonial.name}
                </p>
                <p className="text-sm text-[#1E2A55]/60 flex items-center gap-1">
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  {testimonial.location}
                </p>
              </div>
            </div>
          </article>
        ))}
      </div>

      {/* Overall Rating */}
      <div className="mx-auto max-w-4xl mt-16 bg-white rounded-2xl p-8 shadow-lg text-center">
        <div className="flex flex-col md:flex-row items-center justify-center gap-8">
          <div>
            <p className="text-6xl font-bold text-[#1E2A55]">4.9</p>
            <div className="flex gap-1 mt-2 justify-center">
              {renderStars(5)}
            </div>
            <p className="text-sm text-gray-600 mt-2">Based on 1,234 reviews</p>
          </div>
          <div className="h-16 w-px bg-gray-200 hidden md:block" />
          <div className="text-left">
            <p className="text-lg font-semibold text-[#1E2A55] mb-2">Excellent Service</p>
            <p className="text-sm text-gray-600 max-w-md">
              Join thousands of satisfied customers who trust us for authentic Habesha fashion.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
