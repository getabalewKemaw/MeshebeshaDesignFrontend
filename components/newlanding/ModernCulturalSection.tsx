'use client';

import Image from 'next/image';

export default function ModernCulturalSection() {
    return (
        <section className="relative w-full h-screen min-h-[600px] overflow-hidden flex items-center justify-center">
            {/* Background Image */}
            <div className="absolute inset-0 z-0">
                <Image
                    src="/ui/bgimage3.png"
                    alt="Modern Cultural Ethiopian Clothes"
                    fill
                    className="object-cover"
                    quality={100}
                />
                {/* Slight overlay for text readability if needed */}
                <div className="absolute inset-0 bg-black/10" />
            </div>

            {/* Decorative Left Border Pattern */}
            <div className="absolute left-0 top-0 bottom-0 w-24 z-10 hidden md:block">
                <div
                    className="w-full h-full bg-repeat-y opacity-90"
                    style={{
                        backgroundImage: 'url(/ui/pattern-border.png)',
                        backgroundSize: 'contain',
                    }}
                />
            </div>

            {/* SALE NOW Badge - Top Center */}
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 z-20">
                <div className="bg-white border-[3px] border-[#310101] px-4 py-6 rounded-b-3xl shadow-lg flex flex-col items-center justify-center leading-tight">
                    <span className="text-[#310101] font-black text-xl uppercase" style={{ fontFamily: 'Fredoka One, cursive' }}>
                        SALE
                    </span>
                    <span className="text-[#310101] font-bold text-sm uppercase" style={{ fontFamily: 'Fredoka One, cursive' }}>
                        NOW
                    </span>
                </div>
            </div>

            {/* Main Text Content */}
            <div className="relative z-10 text-center px-4 max-w-5xl mx-auto mt-20">
                <h2
                    className="text-white text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-normal tracking-wide leading-tight drop-shadow-lg"
                    style={{ fontFamily: 'Abril Fatface, cursive' }}
                >
                    MODERN CULTURAL<br />
                    ETHIOPIAN CLOTHES
                </h2>
            </div>

            {/* 25% OFF Circle Badge - Right Side */}
            <div className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-1/3 z-20 hidden md:block">
                <div className="w-64 h-64 md:w-80 md:h-80 bg-white rounded-full border-[12px] border-[#310101] flex flex-col items-center justify-center shadow-2xl relative right-12">
                    <div className="text-center transform -translate-x-4">
                        <span className="block text-[#310101] font-serif font-bold text-6xl md:text-7xl leading-none">
                            25%
                        </span>
                        <span className="block text-[#310101] font-serif font-bold text-3xl md:text-4xl tracking-widest mt-2">
                            OFF
                        </span>
                    </div>
                </div>
            </div>
        </section>
    );
}
