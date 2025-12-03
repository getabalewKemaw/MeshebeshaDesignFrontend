'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const products = [
    {
        id: 1,
        image: '/ui/DRESS1.png',
        description: 'A handwoven fetel dress decorated with colorful tibeb patterns, worn for special cultural occasions.',
    },
    {
        id: 2,
        image: '/ui/DRESS2.png',
        description: 'A handwoven fetel dress decorated with colorful tibeb patterns, worn for special cultural occasions.',
    },
    {
        id: 3,
        image: '/ui/DRESS3.png',
        description: 'A handwoven fetel dress decorated with colorful tibeb patterns, worn for special cultural occasions.',
    },
    {
        id: 4,
        image: '/ui/DRESS4.png',
        description: 'A handwoven fetel dress decorated with colorful tibeb patterns, worn for special cultural occasions.',
    },
];

export default function BestSellingSection() {
    return (
        <section className="relative w-full min-h-screen overflow-hidden flex flex-col justify-center py-20">
            {/* Background Image - Original Orientation */}
            <div className="absolute inset-0 z-0">
                <Image
                    src="/ui/bgimage2.png"
                    alt="Best Selling Background"
                    fill
                    className="object-cover"
                    quality={100}
                />
                {/* Dark overlay for better contrast */}
                <div className="absolute inset-0 bg-black/20" />
            </div>

            {/* Decorative Left Border Pattern (Continuing from Hero) */}
            <div className="absolute left-0 top-0 bottom-0 w-24 z-10 hidden md:block">
                <div
                    className="w-full h-full bg-repeat-y opacity-90"
                    style={{
                        backgroundImage: 'url(/ui/pattern-border.png)',
                        backgroundSize: 'contain',
                    }}
                />
            </div>

            {/* Content Container */}
            <div className="relative z-10 w-full max-w-[1400px] mx-auto px-4 md:px-16 lg:px-24">

                {/* Section Title */}
                <div className="text-center mb-12 relative">
                    <h2
                        className="text-white text-4xl md:text-5xl lg:text-6xl font-bold uppercase tracking-wider inline-block border-b-4 border-white pb-2"
                        style={{ fontFamily: 'ADLaM Display, cursive' }}
                    >
                        BEST SELLING
                    </h2>
                </div>

                {/* 25% OFF Badge */}
                <div className="absolute top-0 right-8 md:right-16">
                    <div className="bg-white px-6 py-2 rounded-full shadow-lg transform rotate-[-2deg]">
                        <span className="text-[#310101] font-black text-2xl md:text-3xl" style={{ fontFamily: 'Fredoka One, cursive' }}>
                            25% off
                        </span>
                    </div>
                </div>

                {/* Products Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                    {products.map((product) => (
                        <div key={product.id} className="flex flex-col items-center group">
                            {/* Image Container */}
                            <div className="relative w-full aspect-[3/4] rounded-3xl overflow-hidden mb-4 border-2 border-white/20 shadow-2xl">
                                <Image
                                    src={product.image}
                                    alt="Traditional Dress"
                                    fill
                                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                                />
                                {/* SALE Tag */}
                                <div className="absolute bottom-4 left-4 bg-[#310101] text-white px-3 py-1 rounded text-sm font-bold tracking-wider">
                                    SALE
                                </div>
                            </div>

                            {/* Description */}
                            <p
                                className="text-white text-center text-sm mb-4 leading-relaxed line-clamp-3 px-2"
                                style={{ fontFamily: 'Abhaya Libre, serif' }}
                            >
                                {product.description}
                            </p>

                            {/* Shop Button */}
                            <button
                                className="bg-white text-[#310101] px-8 py-2 rounded-full font-bold text-sm uppercase hover:bg-gray-100 transition-colors shadow-lg transform hover:-translate-y-1"
                                style={{ fontFamily: 'Fredoka One, cursive' }}
                            >
                                SHOP
                            </button>
                        </div>
                    ))}
                </div>

                {/* Pagination / Navigation */}
                <div className="flex items-center justify-center gap-4 text-white">
                    <button className="hover:text-gray-300 transition-colors">
                        <ChevronLeft size={32} />
                    </button>
                    <span className="text-xl font-medium tracking-widest">1/20</span>
                    <button className="hover:text-gray-300 transition-colors">
                        <ChevronRight size={32} />
                    </button>
                </div>
            </div>
        </section>
    );
}
