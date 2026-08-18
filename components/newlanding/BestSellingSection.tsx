'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useCategoryProducts } from './useCategoryProducts';
import NewLandingProductCard from './NewLandingProductCard';

export default function BestSellingSection() {
    const { products, loading } = useCategoryProducts('best-sellings', 8);

    const [isVisible, setIsVisible] = useState(false);
    const sectionRef = useRef<HTMLElement>(null);
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const mobileScrollRef = useRef<HTMLDivElement>(null);

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
            { threshold: 0.1 }
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

    // Desktop scroll functions
    const scrollDesktop = (direction: 'left' | 'right') => {
        if (scrollContainerRef.current) {
            const scrollAmount = 400;
            const newScrollLeft = direction === 'left'
                ? scrollContainerRef.current.scrollLeft - scrollAmount
                : scrollContainerRef.current.scrollLeft + scrollAmount;

            scrollContainerRef.current.scrollTo({
                left: newScrollLeft,
                behavior: 'smooth'
            });
        }
    };

    // Mobile scroll functions
    const scrollMobile = (direction: 'left' | 'right') => {
        if (mobileScrollRef.current) {
            const cardWidth = mobileScrollRef.current.offsetWidth * 0.85;
            const newScrollLeft = direction === 'left'
                ? mobileScrollRef.current.scrollLeft - cardWidth
                : mobileScrollRef.current.scrollLeft + cardWidth;

            mobileScrollRef.current.scrollTo({
                left: newScrollLeft,
                behavior: 'smooth'
            });
        }
    };

    return (
        <section ref={sectionRef} className="relative w-full h-screen min-h-[600px] overflow-hidden pt-0">
            {/* Background Image - Desktop */}
            <div className="absolute inset-0 z-0 hidden md:block">
                <Image
                    src="/ui/bgimage2.png"
                    alt="Best Selling Background"
                    fill
                    className="object-cover"
                    quality={75}
                    sizes="100vw"
                />
            </div>

            {/* Background Image - Mobile */}
            <div className="absolute inset-0 z-0 md:hidden">
                <Image
                    src="/bestsellinmobilebg.png"
                    alt="Best Selling Mobile Background"
                    fill
                    className="object-cover"
                    quality={75}
                    sizes="100vw"
                />
            </div>



            {/* Content Container */}
            <div className="relative z-10 w-full h-full flex flex-col">
                <div className="max-w-[1400px] w-full mx-auto px-2 md:px-16 lg:px-24 py-8 md:ml-16 lg:ml-24 sm:ml-24">
         {/* Section Title */}
                    <div className="text-center mb-45 relative">
                        <h2
                            className={`text-white text-4xl md:text-5xl lg:text-6xl font-bold uppercase tracking-wider inline-block border-b-4 border-white pb-2 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                                }`}
                            style={{ fontFamily: 'ADLaM Display, cursive' }}
                        >
                            BEST SELLING
                        </h2>
                    </div>
              

                    {/* 25% OFF Badge - Infinite Pulse Animation */}
                    <div className="absolute top-8 right-0  z-20">
                        <div
                            className={`bg-white px-6 py-2 rounded-full shadow-lg transform rotate-[-2deg] transition-all duration-700 ${isVisible ? 'opacity-100 scale-100 animate-pulse' : 'opacity-0 scale-50'
                                }`}
                        >
                            <span className="text-[#310101] font-black text-2xl md:text-3xl" style={{ fontFamily: 'Fredoka One, cursive' }}>
                                25% off
                            </span>
                        </div>
                    </div>
                </div>

                {/* Desktop: Scrollable Container with Fixed Height */}
                <div className="hidden md:block flex-1 relative">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full px-4 md:px-16 lg:px-24 md:ml-16 lg:ml-24">
                            <div className="relative group">
                                {/* Scrollable Container - Fixed Height */}
                                <div className="h-[700px] overflow-y-auto custom-vertical-scrollbar">
                                    <div
                                        ref={scrollContainerRef}
                                        className="flex gap-6 overflow-x-auto custom-scrollbar scroll-smooth pb-8"
                                        style={{
                                            scrollSnapType: 'x mandatory',
                                            WebkitOverflowScrolling: 'touch'
                                        }}
                                    >
                                        {products.map((product, index) => (
                                            <div
                                                key={product.id}
                                                className={`flex-shrink-0 w-[300px] scroll-snap-align-start transition-all duration-700 hover:scale-105 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                                                    }`}
                                                style={{
                                                    transitionDelay: `${(index % 4) * 150}ms`,
                                                    scrollSnapAlign: 'start'
                                                }}
                                            >
                                                <NewLandingProductCard
                                                    product={product}
                                                    variant="light"
                                                />
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Desktop Navigation Arrows */}
                                <button
                                    onClick={() => scrollDesktop('left')}
                                    className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 bg-white/90 hover:bg-white text-[#310101] p-3 rounded-full shadow-xl opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110 z-10"
                                    aria-label="Scroll left"
                                >
                                    <ChevronLeft size={28} />
                                </button>
                                <button
                                    onClick={() => scrollDesktop('right')}
                                    className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 bg-white/90 hover:bg-white text-[#310101] p-3 rounded-full shadow-xl opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110 z-10"
                                    aria-label="Scroll right"
                                >
                                    <ChevronRight size={28} />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Mobile: Scrollable Container with Left Margin */}
                <div className="md:hidden flex-1 relative">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full">
                            {/* Scrollable Container - Fixed Height */}
                            <div className="h-[500px] overflow-y-auto custom-vertical-scrollbar">
                                <div className="relative group">
                                    {/* Scroll Container with Left Margin */}
                                    <div
                                        ref={mobileScrollRef}
                                        className="flex gap-4 overflow-x-auto scrollbar-hide scroll-smooth ml-20 pb-8"
                                        style={{
                                            scrollSnapType: 'x mandatory',
                                            WebkitOverflowScrolling: 'touch'
                                        }}
                                    >
                                        {products.map((product, index) => (
                                            <div
                                                key={product.id}
                                                className={`flex-shrink-0 w-[85%] max-w-[320px] scroll-snap-align-start transition-all duration-500 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'
                                                    }`}
                                                style={{
                                                    transitionDelay: `${index * 100}ms`,
                                                    scrollSnapAlign: 'start'
                                                }}
                                            >
                                                <NewLandingProductCard
                                                    product={product}
                                                    variant="light"
                                                />
                                            </div>
                                        ))}
                                    </div>

                                    {/* Mobile Navigation Arrows */}
                                    <button
                                        onClick={() => scrollMobile('left')}
                                        className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/90 text-[#310101] p-2 rounded-full shadow-lg hover:bg-white transition-all duration-300 hover:scale-110 z-10"
                                        aria-label="Scroll left"
                                    >
                                        <ChevronLeft size={24} />
                                    </button>
                                    <button
                                        onClick={() => scrollMobile('right')}
                                        className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/90 text-[#310101] p-2 rounded-full shadow-lg hover:bg-white transition-all duration-300 hover:scale-110 z-10"
                                        aria-label="Scroll right"
                                    >
                                        <ChevronRight size={24} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Custom Scrollbar Styling */}
            <style jsx global>{`
                /* Vertical Scrollbar for Container */
                .custom-vertical-scrollbar::-webkit-scrollbar {
                    width: 8px;
                }
                .custom-vertical-scrollbar::-webkit-scrollbar-track {
                    background: rgba(255, 255, 255, 0.1);
                    border-radius: 10px;
                }
                .custom-vertical-scrollbar::-webkit-scrollbar-thumb {
                    background: rgba(255, 255, 255, 0.3);
                    border-radius: 10px;
                }
                .custom-vertical-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: rgba(255, 255, 255, 0.5);
                }

                /* Desktop Horizontal Scrollbar */
                .custom-scrollbar::-webkit-scrollbar {
                    height: 12px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: rgba(255, 255, 255, 0.1);
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: #310101;
                    border-radius: 10px;
                    border: 2px solid rgba(255, 255, 255, 0.2);
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: #500202;
                }

                /* Mobile - Hide horizontal scrollbar */
                @media (max-width: 768px) {
                    .scrollbar-hide::-webkit-scrollbar {
                        display: none;
                    }
                    .scrollbar-hide {
                        -ms-overflow-style: none;
                        scrollbar-width: none;
                    }
                }
            `}</style>
        </section>
    );
}
