"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

interface ProductCardProps {
    id: string;
    title: string;
    price: number;
    currency?: string;
    image?: string;
    averageRating?: number;
    totalReviews?: number;
}

export default function ProductCard({
    id,
    title,
    price,
    currency = "ETB",
    image,
    averageRating,
    totalReviews,
}: ProductCardProps) {
    const [imageError, setImageError] = useState(false);

    // Format price
    const formattedPrice = new Intl.NumberFormat("en-ET", {
        style: "decimal",
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(price);

    // Render star rating
    const renderStars = () => {
        if (!averageRating) return null;

        const stars = [];
        const fullStars = Math.floor(averageRating);
        const hasHalfStar = averageRating % 1 >= 0.5;

        for (let i = 0; i < 5; i++) {
            if (i < fullStars) {
                stars.push(
                    <span key={i} className="text-yellow-400">
                        ★
                    </span>
                );
            } else if (i === fullStars && hasHalfStar) {
                stars.push(
                    <span key={i} className="text-yellow-400">
                        ★
                    </span>
                );
            } else {
                stars.push(
                    <span key={i} className="text-gray-300">
                        ★
                    </span>
                );
            }
        }

        return (
            <div className="flex items-center gap-1.5">
                <div className="flex text-sm">{stars}</div>
                {totalReviews && totalReviews > 0 && (
                    <span className="text-xs text-gray-500">({totalReviews})</span>
                )}
            </div>
        );
    };

    return (
        <Link
            href={`/products/${id}`}
            className="group block overflow-hidden transition-all duration-300 hover:scale-[1.02]"
        >
            {/* Full Image Container - No borders, no rounded corners */}
            <div className="relative aspect-square w-full overflow-hidden bg-gray-100">
                {image && !imageError ? (
                    <Image
                        src={image}
                        alt={title}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                        onError={() => setImageError(true)}
                        priority={false}
                    />
                ) : (
                    <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
                        <svg
                            className="h-20 w-20 text-gray-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={1.5}
                                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                            />
                        </svg>
                    </div>
                )}

                {/* Gradient overlay on hover for better text readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>

            {/* Product Info - Minimal, clean */}
            <div className="mt-3 space-y-2">
                {/* Title */}
                <h3 className="font-heading text-base font-semibold text-[#1E2A55] line-clamp-2 min-h-[3rem] group-hover:text-[#CFAE56] transition-colors">
                    {title}
                </h3>

                {/* Rating */}
                {renderStars()}

                {/* Price */}
                <p className="text-xl font-bold text-[#1E2A55]">
                    {formattedPrice}
                    <span className="ml-1 text-sm font-normal text-gray-600">
                        {currency}
                    </span>
                </p>
            </div>
        </Link>
    );
}
