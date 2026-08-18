'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useCategoryProducts } from './useCategoryProducts';
import NewLandingProductCard from './NewLandingProductCard';

export default function MensCouplesSection() {
    const { products: menProducts, loading: menLoading } = useCategoryProducts('mens', 6);
    const { products: coupleProducts, loading: coupleLoading } = useCategoryProducts('couples', 10);

    const [isVisible, setIsVisible] = useState(false);
    const sectionRef = useRef<HTMLElement>(null);
    const menScrollRef = useRef<HTMLDivElement>(null);
    const coupleScrollRef = useRef<HTMLDivElement>(null);
    const menMobileScrollRef = useRef<HTMLDivElement>(null);
    const coupleMobileScrollRef = useRef<HTMLDivElement>(null);

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
    const scrollDesktop = (ref: React.RefObject<HTMLDivElement | null>, direction: 'left' | 'right') => {
        if (ref.current) {
            const scrollAmount = 350;
            const newScrollLeft = direction === 'left'
                ? ref.current.scrollLeft - scrollAmount
                : ref.current.scrollLeft + scrollAmount;

            ref.current.scrollTo({
                left: newScrollLeft,
                behavior: 'smooth'
            });
        }
    };

    // Mobile scroll functions
    const scrollMobile = (ref: React.RefObject<HTMLDivElement | null>, direction: 'left' | 'right') => {
        if (ref.current) {
            const cardWidth = ref.current.offsetWidth * 0.85;
            const newScrollLeft = direction === 'left'
                ? ref.current.scrollLeft - cardWidth
                : ref.current.scrollLeft + cardWidth;

            ref.current.scrollTo({
                left: newScrollLeft,
                behavior: 'smooth'
            });
        }
    };

    return (
        <section ref={sectionRef} className="relative w-full min-h-screen  overflow-hidden py-20">
            {/* Background Image - Desktop */}
            <div className="absolute inset-0 z-0 hidden md:block">
                <Image
                    src="/ui/bgimageformensandcouples.png"
                    alt="Background"
                    fill
                    className="object-cover"
                    quality={75}
                    sizes="100vw"
                />
            </div>

            {/* Background Image - Mobile */}
            <div className="absolute inset-0 z-0 md:hidden">
                <Image
                    src="/mensandcouplemobilebg.png"
                    alt="Mobile Background"
                    fill
                    className="object-cover"
                    quality={75}
                    sizes="100vw"
                />
            </div>

            {/* Content Container */}
            <div className="relative z-10 w-full max-w-[1600px] mx-auto px-4 md:px-8">

                {/* --- MEN'S COLLECTION --- */}
                <div className="mb-32 relative">
                    {/* Title */}
                    <div
                        className={`text-center mb-16 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                            }`}
                    >
                        <h2
                            className="text-[#310101] text-4xl md:text-6xl font-bold uppercase tracking-wider border-b-4 border-[#310101] pb-2 inline-block"
                            style={{
                                fontFamily: 'ADLaM Display, cursive',
                                WebkitTextStroke: '1px #310101'
                            }}
                        >
                            MEN'S COLLECTION
                        </h2>
                    </div>

                    <div className="flex flex-col lg:flex-row items-center justify-center gap-12 relative">
                        {/* 25% Badge - Left - Infinite Spin Animation */}
                        <div className="absolute left-0 top-1/2 -translate-y-1/2 hidden xl:block z-20 sm:hidden">
                            <div
                                className={`w-64 h-64 rounded-full bg-[#310101] flex flex-col items-center justify-center text-white  border-white   border-9  shadow-2xl transition-all duration-1000 animate-spin-slow ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-50'
                                    }`}
                            >
                                <span className="text-5xl font-black" style={{ fontFamily: 'Fredoka One, cursive' }}>25%</span>
                                <span className="text-3xl font-bold" style={{ fontFamily: 'Fredoka One, cursive' }}>OFF</span>
                            </div>
                        </div>

                        {/* Desktop: Horizontal Scroll */}
                        <div className="hidden md:block w-full max-w-5xl md:ml-64">
                            <div className="relative group">
                                <div
                                    ref={menScrollRef}
                                    className="flex gap-6 overflow-x-auto scrollbar-hide scroll-smooth pb-4"
                                    style={{
                                        scrollSnapType: 'x mandatory',
                                        WebkitOverflowScrolling: 'touch'
                                    }}
                                >
                                    {menProducts.map((product, index) => (
                                        <div
                                            key={`men-${product.id}`}
                                            className={`flex-shrink-0 w-[300px] transition-all duration-1000 hover:scale-105 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                                                }`}
                                            style={{
                                                transitionDelay: `${index * 150}ms`,
                                                scrollSnapAlign: 'start'
                                            }}
                                        >
                                            <NewLandingProductCard
                                                product={product}
                                                variant="dark"
                                            />
                                        </div>
                                    ))}
                                </div>

                                {/* Desktop Navigation Arrows */}
                                <button
                                    onClick={() => scrollDesktop(menScrollRef, 'left')}
                                    className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 bg-white/90 hover:bg-white text-[#310101] p-3 rounded-full shadow-xl opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110 z-10"
                                    aria-label="Scroll left"
                                >
                                    <ChevronLeft size={28} />
                                </button>
                                <button
                                    onClick={() => scrollDesktop(menScrollRef, 'right')}
                                    className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 bg-white/90 hover:bg-white text-[#310101] p-3 rounded-full shadow-xl opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110 z-10"
                                    aria-label="Scroll right"
                                >
                                    <ChevronRight size={28} />
                                </button>
                            </div>
                        </div>

                        {/* Mobile: Horizontal Scroll with Peek Effect */}
                        <div className="md:hidden relative w-full">
                            <div className="relative group">
                                <div
                                    ref={menMobileScrollRef}
                                    className="flex gap-4 overflow-x-auto scrollbar-hide scroll-smooth px-6 pb-4"
                                    style={{
                                        scrollSnapType: 'x mandatory',
                                        WebkitOverflowScrolling: 'touch'
                                    }}
                                >
                                    {menProducts.map((product, index) => (
                                        <div
                                            key={`men-mobile-${product.id}`}
                                            className={`flex-shrink-0 w-[85%] max-w-[320px] transition-all duration-500 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'
                                                }`}
                                            style={{
                                                transitionDelay: `${index * 100}ms`,
                                                scrollSnapAlign: 'start'
                                            }}
                                        >
                                            <NewLandingProductCard
                                                product={product}
                                                variant="dark"
                                            />
                                        </div>
                                    ))}
                                </div>

                                {/* Mobile Navigation Arrows */}
                                <button
                                    onClick={() => scrollMobile(menMobileScrollRef, 'left')}
                                    className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/90 text-[#310101] p-2 rounded-full shadow-lg hover:bg-white transition-all duration-300 hover:scale-110 z-10"
                                    aria-label="Scroll left"
                                >
                                    <ChevronLeft size={24} />
                                </button>
                                <button
                                    onClick={() => scrollMobile(menMobileScrollRef, 'right')}
                                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/90 text-[#310101] p-2 rounded-full shadow-lg hover:bg-white transition-all duration-300 hover:scale-110 z-10"
                                    aria-label="Scroll right"
                                >
                                    <ChevronRight size={24} />
                                </button>
                            </div>
                        </div>

                        {/* Mobile 25% Badge */}
                  {/*       <div className="md:hidden flex justify-center mt-8">
                            <div className="w-40 h-40 rounded-full bg-[#310101] flex flex-col items-center justify-center text-white border-4 border-[#D4AF37] shadow-2xl animate-spin-slow">
                                <span className="text-3xl font-black" style={{ fontFamily: 'Fredoka One, cursive' }}>25%</span>
                                <span className="text-xl font-bold" style={{ fontFamily: 'Fredoka One, cursive' }}>OFF</span>
                            </div>
                        </div> */}
                    </div>
                </div>

                {/* --- COUPLE'S COLLECTION --- */}
                <div className="relative">
                    {/* Title */}
                    <div
                        className={`text-center mb-16 transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                            }`}
                    >
                        <h2
                            className="text-[#310101] text-4xl md:text-6xl font-bold uppercase tracking-wider border-b-4 border-[#310101] pb-2 inline-block"
                            style={{
                                fontFamily: 'ADLaM Display, cursive',
                                WebkitTextStroke: '1px #310101'
                            }}
                        >
                            COUPLE'S COLLECTION
                        </h2>
                    </div>

                    {/* Desktop: Horizontal Scroll */}
                    <div className="hidden md:block">
                        <div className="relative group">
                            <div
                                ref={coupleScrollRef}
                                className="flex gap-6 overflow-x-auto scrollbar-hide scroll-smooth pb-4 px-4"
                                style={{
                                    scrollSnapType: 'x mandatory',
                                    WebkitOverflowScrolling: 'touch'
                                }}
                            >
                                {coupleProducts.map((product, index) => (
                                    <div
                                        key={`couple-${product.id}`}
                                        className={`flex-shrink-0 w-[280px] transition-all duration-1000 hover:scale-105 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                                            }`}
                                        style={{
                                            transitionDelay: `${(index + 3) * 150}ms`,
                                            scrollSnapAlign: 'start'
                                        }}
                                    >
                                        <NewLandingProductCard
                                            product={product}
                                            variant="dark"
                                        />
                                    </div>
                                ))}
                            </div>

                            {/* Desktop Navigation Arrows */}
                            <button
                                onClick={() => scrollDesktop(coupleScrollRef, 'left')}
                                className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 bg-white/90 hover:bg-white text-[#310101] p-3 rounded-full shadow-xl opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110 z-10"
                                aria-label="Scroll left" 
                            >
                                <ChevronLeft size={28} />
                            </button>
                            <button
                                onClick={() => scrollDesktop(coupleScrollRef, 'right')}
                                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 bg-white/90 hover:bg-white text-[#310101] p-3 rounded-full shadow-xl opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110 z-10"
                                aria-label="Scroll right"
                            >
                                <ChevronRight size={28} />
                            </button>
                        </div>
                    </div>

                    {/* Mobile: Horizontal Scroll with Peek Effect */}
                    <div className="md:hidden relative">
                        <div className="relative group">
                            <div
                                ref={coupleMobileScrollRef}
                                className="flex gap-4 overflow-x-auto scrollbar-hide scroll-smooth px-6 pb-4"
                                style={{
                                    scrollSnapType: 'x mandatory',
                                    WebkitOverflowScrolling: 'touch'
                                }}
                            >
                                {coupleProducts.map((product, index) => (
                                    <div
                                        key={`couple-mobile-${product.id}`}
                                        className={`flex-shrink-0 w-[85%] max-w-[320px] transition-all duration-500 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'
                                            }`}
                                        style={{
                                            transitionDelay: `${index * 100}ms`,
                                            scrollSnapAlign: 'start'
                                        }}
                                    >
                                        <NewLandingProductCard
                                            product={product}
                                            variant="dark"
                                        />
                                    </div>
                                ))}
                            </div>

                            {/* Mobile Navigation Arrows */}
                            <button
                                onClick={() => scrollMobile(coupleMobileScrollRef, 'left')}
                                className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/90 text-[#310101] p-2 rounded-full shadow-lg hover:bg-white transition-all duration-300 hover:scale-110 z-10"
                                aria-label="Scroll left"
                            >
                                <ChevronLeft size={24} />
                            </button>
                            <button
                                onClick={() => scrollMobile(coupleMobileScrollRef, 'right')}
                                className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/90 text-[#310101] p-2 rounded-full shadow-lg hover:bg-white transition-all duration-300 hover:scale-110 z-10"
                                aria-label="Scroll right"
                            >
                                <ChevronRight size={24} />
                            </button>
                        </div>
                    </div>
                </div>

            </div>

            {/* Custom Scrollbar Hide */}
            <style jsx global>{`
                .scrollbar-hide::-webkit-scrollbar {
                    display: none;
                }
                .scrollbar-hide {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
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
