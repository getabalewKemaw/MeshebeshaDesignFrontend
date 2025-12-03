'use client';

import Image from 'next/image';
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
    {
        id: 5,
        image: '/ui/DRESS1.png', // Repeating for the 5th item as requested/implied by layout
        description: 'A handwoven fetel dress decorated with colorful tibeb patterns, worn for special cultural occasions.',
    },
];

export default function EventHolidaySection() {
    return (
        <section className="relative w-full min-h-screen overflow-hidden py-20">
            {/* Main Background Image for Page 4 & 5 */}
            <div className="absolute inset-0 z-0">
                <Image
                    src="/ui/bgimagefor4and5.png"
                    alt="Background"
                    fill
                    className="object-cover"
                    quality={100}
                />
            </div>

            {/* Content Container */}
            <div className="relative z-10 w-full max-w-[1600px] mx-auto px-4 md:px-8">

                {/* --- FIRST ROW --- */}
                <div className="mb-24 relative">
                    {/* Divider Background behind images - Centered vertically relative to the grid */}
                    <div className="absolute top-[60%] left-0 right-0 h-[200px] -translate-y-1/2 -z-10 opacity-90">
                        <Image
                            src="/ui/page4deviderimage.png"
                            alt="Divider Pattern"
                            fill
                            className="object-cover"
                        />
                    </div>

                    {/* Header Area */}
                    <div className="flex flex-col md:flex-row items-center justify-between mb-8 px-8">
                        {/* 25% OFF Badge - Left */}
                        <div className="bg-[#310101] text-white px-6 py-2 rounded-full border-2 border-[#310101] shadow-lg transform rotate-[-2deg]">
                            <span className="font-black text-xl md:text-2xl" style={{ fontFamily: 'Fredoka One, cursive' }}>
                                25% OFF
                            </span>
                        </div>

                        {/* Title */}
                        <div className="text-center mt-4 md:mt-0">
                            <h2
                                className="text-[#310101] text-3xl md:text-5xl font-bold uppercase tracking-wider border-b-4 border-[#310101] pb-2 inline-block"
                                style={{
                                    fontFamily: 'ADLaM Display, cursive',
                                    WebkitTextStroke: '1px #310101'
                                }}
                            >
                                EVENT/ HOLIDAY DRESSES
                            </h2>
                        </div>

                        {/* Spacer for alignment */}
                        <div className="w-[120px] hidden md:block"></div>
                    </div>

                    {/* Product Grid - Added padding x for free space on sides */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 px-8 md:px-16">
                        {products.map((product, index) => (
                            <div key={`row1-${index}`} className="flex flex-col items-center group">
                                {/* Image Card */}
                                <div className="relative w-full aspect-[3/4] rounded-3xl overflow-hidden mb-4 border-4 border-[#310101]/10 bg-white shadow-xl transform transition-transform hover:-translate-y-2">
                                    <Image
                                        src={product.image}
                                        alt="Dress"
                                        fill
                                        className="object-cover"
                                    />
                                    <div className="absolute bottom-3 left-3 bg-[#310101] text-white px-3 py-1 rounded text-xs font-bold">
                                        SALE
                                    </div>
                                </div>

                                {/* Description */}
                                <p className="text-[#310101] text-center text-xs font-semibold mb-3 leading-tight px-2 line-clamp-3 bg-white/80 backdrop-blur-sm rounded p-1" style={{ fontFamily: 'Abhaya Libre, serif' }}>
                                    {product.description}
                                </p>

                                {/* Shop Button */}
                                <button className="bg-[#310101] text-white px-6 py-1.5 rounded-full font-bold text-xs uppercase hover:bg-[#4a0202] transition-colors shadow-md" style={{ fontFamily: 'Fredoka One, cursive' }}>
                                    SHOP
                                </button>
                            </div>
                        ))}
                    </div>

                    {/* Pagination */}
                    <div className="flex items-center justify-center gap-4 mt-8 text-[#310101]">
                        <ChevronLeft size={24} className="cursor-pointer hover:scale-110 transition-transform" />
                        <span className="text-lg font-bold">1/20</span>
                        <ChevronRight size={24} className="cursor-pointer hover:scale-110 transition-transform" />
                    </div>
                </div>


                {/* --- MIDDLE DIVIDER --- */}
                <div className="w-full h-16 md:h-24 relative mb-24 my-12">
                    <Image
                        src="/ui/page4deviderimage.png"
                        alt="Section Divider"
                        fill
                        className="object-cover"
                    />
                </div>


                {/* --- SECOND ROW --- */}
                <div className="relative">
                    {/* Divider Background behind images - Centered vertically relative to the grid */}
                    <div className="absolute top-[60%] left-0 right-0 h-[200px] -translate-y-1/2 -z-10 opacity-90">
                        <Image
                            src="/ui/page4deviderimage.png"
                            alt="Divider Pattern"
                            fill
                            className="object-cover"
                        />
                    </div>

                    {/* Header Area */}
                    <div className="flex flex-col md:flex-row items-center justify-between mb-8 px-8">
                        {/* Spacer for alignment */}
                        <div className="w-[120px] hidden md:block"></div>

                        {/* Title */}
                        <div className="text-center mt-4 md:mt-0">
                            <h2
                                className="text-[#310101] text-3xl md:text-5xl font-bold uppercase tracking-wider border-b-4 border-[#310101] pb-2 inline-block"
                                style={{
                                    fontFamily: 'ADLaM Display, cursive',
                                    WebkitTextStroke: '1px #310101'
                                }}
                            >
                                EVENT/ HOLIDAY DRESSES
                            </h2>
                        </div>

                        {/* 25% OFF Badge - Right */}
                        <div className="bg-[#310101] text-white px-6 py-2 rounded-full border-2 border-[#310101] shadow-lg transform rotate-[2deg] mt-4 md:mt-0">
                            <span className="font-black text-xl md:text-2xl" style={{ fontFamily: 'Fredoka One, cursive' }}>
                                25% OFF
                            </span>
                        </div>
                    </div>

                    {/* Product Grid - Added padding x for free space on sides */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 px-8 md:px-16">
                        {products.map((product, index) => (
                            <div key={`row2-${index}`} className="flex flex-col items-center group">
                                {/* Image Card */}
                                <div className="relative w-full aspect-[3/4] rounded-3xl overflow-hidden mb-4 border-4 border-[#310101]/10 bg-white shadow-xl transform transition-transform hover:-translate-y-2">
                                    <Image
                                        src={product.image}
                                        alt="Dress"
                                        fill
                                        className="object-cover"
                                    />
                                    <div className="absolute bottom-3 left-3 bg-[#310101] text-white px-3 py-1 rounded text-xs font-bold">
                                        SALE
                                    </div>
                                </div>

                                {/* Description */}
                                <p className="text-[#310101] text-center text-xs font-semibold mb-3 leading-tight px-2 line-clamp-3 bg-white/80 backdrop-blur-sm rounded p-1" style={{ fontFamily: 'Abhaya Libre, serif' }}>
                                    {product.description}
                                </p>

                                {/* Shop Button */}
                                <button className="bg-[#310101] text-white px-6 py-1.5 rounded-full font-bold text-xs uppercase hover:bg-[#4a0202] transition-colors shadow-md" style={{ fontFamily: 'Fredoka One, cursive' }}>
                                    SHOP
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

            </div>
        </section>
    );
}
