'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';

export default function ModernCulturalSection() {
    const [isVisible, setIsVisible] = useState(false);
    const sectionRef = useRef<HTMLElement>(null);

    // Intersection Observer for scroll-based animation
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setIsVisible(true);
                    }
                });
            },
            { threshold: 0.2 }
        );

        if (sectionRef.current) {
            observer.observe(sectionRef.current);
        }

        return () => {
            if (sectionRef.current) {
                observer.unobserve(sectionRef.current);
            }
        };
    }, []);

    return (
        <section ref={sectionRef} className="relative w-full h-screen min-h-[600px] overflow-hidden flex items-center justify-center pt-[70px]">
            {/* Background Image - Desktop */}
            <div className="absolute inset-0 z-0 hidden md:block">
                <Image
                    src="/ui/bgimage3.png"
                    alt="Modern Cultural Ethiopian Clothes"
                    fill
                    className="object-cover"
                    quality={100}
                    priority
                />
                {/* Slight overlay for text readability */}
                <div className="absolute inset-0 bg-black/10" />
            </div>

            {/* Background Image - Mobile */}
            <div className="absolute inset-0 z-0 md:hidden">
                <Image
                    src="/modernculturemobilebg.png"
                    alt="Modern Cultural Mobile Background"
                    fill
                    className="object-cover"
                    quality={100}
                    priority
                />
                {/* Slight overlay for text readability */}
                <div className="absolute inset-0 bg-black/10" />
            </div>

            {/* SALE NOW Badge - Top Center with Bounce Animation */}
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 z-20">
                <div
                    className={`bg-white border-[3px] border-[#310101] px-4 py-6 rounded-b-3xl shadow-lg flex flex-col items-center justify-center leading-tight transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0 animate-bounce' : 'opacity-0 -translate-y-10'
                        }`}
                >
                    <span className="text-[#310101] font-black text-xl uppercase" style={{ fontFamily: 'Fredoka One, cursive' }}>
                        SALE
                    </span>
                    <span className="text-[#310101] font-bold text-sm uppercase" style={{ fontFamily: 'Fredoka One, cursive' }}>
                        NOW
                    </span>
                </div>
            </div>

            {/* Main Text Content - Fade In with Scale */}
            <div
                className={`relative z-10 text-center px-4 max-w-5xl mx-auto mt-20 transition-all duration-1000 ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-90'
                    }`}
            >
                <h2
                    className="text-white text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-normal tracking-wide leading-tight drop-shadow-2xl mb-12"
                    style={{ fontFamily: 'Abril Fatface, cursive' }}
                >
                    MODERN CULTURAL<br />
                    ETHIOPIAN CLOTHES
                </h2>

                {/* Shop Now Button with Floating Animation */}
                <div
                    className={`transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                        }`}
                >
                    <a
                        href="/products"
                        className="inline-block bg-white text-[#310101] px-12 py-4 rounded-full font-black text-lg md:text-xl uppercase hover:bg-[#310101] hover:text-white transition-all duration-300 shadow-2xl hover:shadow-[0_0_30px_rgba(49,1,1,0.5)] hover:scale-110 animate-float border-4 border-[#310101]"
                        style={{ fontFamily: 'Fredoka One, cursive' }}
                    >
                        SHOP NOW
                    </a>
                </div>
            </div>

            {/* 25% OFF Circle Badge - Right Side with Infinite Spin Animation */}
            <div className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-1/3 z-20 hidden md:block">
                <div
                    className={`w-64 h-64 md:w-80 md:h-80 bg-white rounded-full border-[12px] border-[#310101] flex flex-col items-center justify-center shadow-2xl relative right-12 transition-all duration-1000 animate-spin-slow ${isVisible ? 'opacity-100' : 'opacity-0'
                        }`}
                >
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

            {/* Mobile 25% OFF Badge - Right Side with Infinite Spin */}
            <div className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-1/4 z-20 md:hidden">
                <div
                    className={`w-32 h-32 sm:w-40 sm:h-40 bg-white rounded-full border-[6px] sm:border-[8px] border-[#310101] flex flex-col items-center justify-center shadow-2xl transition-all duration-1000 animate-spin-slow ${isVisible ? 'opacity-100' : 'opacity-0'
                        }`}
                >
                    <div className="text-center">
                        <span className="block text-[#310101] font-serif font-bold text-3xl sm:text-4xl leading-none">
                            25%
                        </span>
                        <span className="block text-[#310101] font-serif font-bold text-lg sm:text-xl tracking-widest mt-1">
                            OFF
                        </span>
                    </div>
                </div>
            </div>

            {/* Animations */}
            <style jsx global>{`
                @keyframes float {
                    0%, 100% {
                        transform: translateY(0px);
                    }
                    50% {
                        transform: translateY(-10px);
                    }
                }
                .animate-float {
                    animation: float 3s ease-in-out infinite;
                }
                @keyframes spin-slow {
                    from {
                        transform: rotate(0deg);
                    }
                    to {
                        transform: rotate(360deg);
                    }
                }
                .animate-spin-slow {
                    animation: spin-slow 20s linear infinite;
                }
            `}</style>
        </section>
    );
}
