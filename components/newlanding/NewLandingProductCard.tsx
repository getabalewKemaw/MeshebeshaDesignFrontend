'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ProductWithDetails } from '@/types/product';

interface NewLandingProductCardProps {
    product: ProductWithDetails;
    variant?: 'light' | 'dark';
    className?: string;
    style?: React.CSSProperties;
}

export default function NewLandingProductCard({
    product,
    variant = 'dark',
    className = '',
    style
}: NewLandingProductCardProps) {
    // Determine image
    const image = product.media?.[0]?.url || '/placeholder.png'; // Fallback

    // Determine description or title
    // Prefer description if available, otherwise title
    const description = product.description || product.title;

    const isLight = variant === 'light';

    return (
        <div
            className={`flex flex-col items-center group transition-all duration-700 ${className}`}
            style={style}
        >
            {/* Image Container */}
            <div className={`relative w-full aspect-[3/4] rounded-3xl overflow-hidden mb-4 border-2 border-white/20 shadow-2xl group-hover:shadow-3xl transition-shadow ${!isLight ? 'bg-white border-[#310101]/20' : ''}`}>
                <Image
                    src={image}
                    alt={product.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
                {/* SALE Tag */}
                <div className="absolute bottom-3 left-3 bg-[#310101] text-white px-3 py-1 rounded text-xs font-bold tracking-wider">
                    SALE
                </div>
            </div>

            {/* Description with Scrollbar */}
            <div
                className={`text-center mb-4 leading-relaxed px-2 font-serif transition-colors max-h-20 overflow-y-auto custom-product-scrollbar
                    ${isLight
                        ? 'text-white text-sm'
                        : 'text-[#310101] text-xs font-semibold bg-white/60 backdrop-blur-sm rounded p-2'
                    }`}
                style={{ fontFamily: 'Abhaya Libre, serif' }}
            >
                {description}
            </div>

            {/* Custom Scrollbar for Product Description */}
            <style jsx global>{`
                .custom-product-scrollbar::-webkit-scrollbar {
                    width: 4px;
                }
                .custom-product-scrollbar::-webkit-scrollbar-track {
                    background: rgba(49, 1, 1, 0.1);
                    border-radius: 10px;
                }
                .custom-product-scrollbar::-webkit-scrollbar-thumb {
                    background: #310101;
                    border-radius: 10px;
                }
                .custom-product-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: #500202;
                }
            `}</style>

            {/* Shop Button */}
            <Link
                href={`/products/${product.id}`}
                className={`px-8 py-2 rounded-full font-bold text-xs uppercase transition-all shadow-lg transform hover:-translate-y-1 hover:shadow-2xl inline-block
                    ${isLight
                        ? 'bg-white text-[#310101] hover:bg-gray-100'
                        : 'bg-[#310101] text-white hover:bg-[#4a0202]'
                    }`}
                style={{ fontFamily: 'Fredoka One, cursive' }}
            >
                SHOP
            </Link>
        </div>
    );
}
