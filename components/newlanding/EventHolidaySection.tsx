'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useCategoryProducts } from './useCategoryProducts';
import NewLandingProductCard from './NewLandingProductCard';

export default function EventHolidaySection() {
    const { products: eventProducts, loading: eventLoading } = useCategoryProducts('eventholiday-dress', 10);
    const { products: weddingProducts, loading: weddingLoading } = useCategoryProducts('weddiing', 10);

    const [currentEventIndex, setCurrentEventIndex] = useState(0);
    const [currentWeddingIndex, setCurrentWeddingIndex] = useState(0);
    const [isVisible, setIsVisible] = useState(false);
    const sectionRef = useRef<HTMLElement>(null);
    const eventScrollRef = useRef<HTMLDivElement>(null);
    const weddingScrollRef = useRef<HTMLDivElement>(null);

    // Intersection Observer for scroll-based animation
    useEffect(() => {
        // Fallback to ensure visibility
        const timer = setTimeout(() => setIsVisible(true), 100);

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
            clearTimeout(timer);
            if (sectionRef.current) {
                observer.unobserve(sectionRef.current);
            }
        };
    }, []);

    const handleEventPrev = () => {
        setCurrentEventIndex((prev) => (prev > 0 ? prev - 1 : eventProducts.length - 1));
    };

    const handleEventNext = () => {
        setCurrentEventIndex((prev) => (prev < eventProducts.length - 1 ? prev + 1 : 0));
    };

    const handleWeddingPrev = () => {
        setCurrentWeddingIndex((prev) => (prev > 0 ? prev - 1 : weddingProducts.length - 1));
    };

    const handleWeddingNext = () => {
        setCurrentWeddingIndex((prev) => (prev < weddingProducts.length - 1 ? prev + 1 : 0));
    };

    // Desktop scroll functions
    const scrollDesktop = (ref: React.RefObject<HTMLDivElement>, direction: 'left' | 'right') => {
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

    if (eventLoading || weddingLoading) return null;

    return (
        <section ref={sectionRef} className="relative w-full min-h-screen overflow-hidden py-20">
            {/* Background Image - Same for Desktop and Mobile */}
            <div className="absolute inset-0 z-0">
                <Image
                    src="/ui/bgimagefor4and5.png"
                    alt="Background"
                    fill
                    className="object-cover"
                    quality={100}
                    priority
                />
            </div>

            {/* Content Container */}
            <div className="relative z-10 w-full max-w-[1600px] mx-auto px-4 md:px-8">

                {/* --- FIRST ROW: EVENT/HOLIDAY DRESSES --- */}
                <div className="mb-24 relative">
                    {/* Divider Background - Now visible on mobile */}
                    <div className="absolute top-[60%] left-0 right-0 h-[150px] md:h-[200px] -translate-y-1/2 -z-10 opacity-90">
                        <Image
                            src="/ui/page4deviderimage.png"
                            alt="Divider Pattern"
                            fill
                            className="object-cover"
                        />
                    </div>

                    {/* Header */}
                    <div className="flex flex-col md:flex-row items-center justify-between mb-8 px-4 md:px-8">
                        {/* 25% OFF Badge - Left - Always Animated */}
                        <div
                            className="bg-[#310101] text-white px-6 py-2 rounded-full border-2 border-[#310101] shadow-lg transform rotate-[-2deg] animate-pulse"
                        >
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

                        <div className="w-[120px] hidden md:block"></div>
                    </div>

                    {/* Desktop Slider (Matches Couples Collection Style) */}
                    <div className="hidden md:block">
                        <div className="relative group">
                            <div
                                ref={eventScrollRef}
                                className="flex gap-6 overflow-x-auto scrollbar-hide scroll-smooth pb-4 px-4"
                                style={{
                                    scrollSnapType: 'x mandatory',
                                    WebkitOverflowScrolling: 'touch'
                                }}
                            >
                                {eventProducts.map((product, index) => (
                                    <div
                                        key={`event-${product.id}`}
                                        className={`flex-shrink-0 w-[280px] transition-all duration-1000 hover:scale-105 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
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

                            {/* Navigation Arrows */}
                            <button
                                onClick={() => scrollDesktop(eventScrollRef, 'left')}
                                className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 bg-white/90 hover:bg-white text-[#310101] p-3 rounded-full shadow-xl opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110 z-10"
                                aria-label="Scroll left"
                            >
                                <ChevronLeft size={28} />
                            </button>
                            <button
                                onClick={() => scrollDesktop(eventScrollRef, 'right')}
                                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 bg-white/90 hover:bg-white text-[#310101] p-3 rounded-full shadow-xl opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110 z-10"
                                aria-label="Scroll right"
                            >
                                <ChevronRight size={28} />
                            </button>
                        </div>
                    </div>

                    {/* Mobile Horizontal Slider */}
                    <div className="md:hidden relative">
                        <div className="overflow-hidden px-4">
                            <div
                                className="flex transition-transform duration-500 ease-in-out"
                                style={{ transform: `translateX(-${currentEventIndex * 100}%)` }}
                            >
                                {eventProducts.map((product) => (
                                    <div key={`event-mobile-${product.id}`} className="min-w-full flex-shrink-0 flex flex-col items-center px-2">
                                        <div className="w-full max-w-sm mx-auto">
                                            <NewLandingProductCard
                                                product={product}
                                                variant="dark"
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Navigation Arrows */}
                        <button
                            onClick={handleEventPrev}
                            className="absolute left-0 top-1/2 -translate-y-1/2 p-2 bg-white/80 rounded-full shadow-lg hover:bg-white transition-colors z-10"
                        >
                            <ChevronLeft size={24} className="text-[#310101]" />
                        </button>
                        <button
                            onClick={handleEventNext}
                            className="absolute right-0 top-1/2 -translate-y-1/2 p-2 bg-white/80 rounded-full shadow-lg hover:bg-white transition-colors z-10"
                        >
                            <ChevronRight size={24} className="text-[#310101]" />
                        </button>
                    </div>

                    {/* Indicator Dots */}
                    <div className="flex justify-center gap-2 mt-6">
                        {eventProducts.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => setCurrentEventIndex(index)}
                                className={`w-2 h-2 rounded-full transition-all ${index === currentEventIndex ? 'bg-[#310101] w-6' : 'bg-[#310101]/50'
                                    }`}
                            />
                        ))}
                    </div>
                </div>



                {/* --- SECOND ROW: WEDDING DRESSES --- */}
                <div className="relative">
                    {/* Divider Background - Now visible on mobile */}
                    <div className="absolute top-[60%] left-0 right-0 h-[150px] md:h-[200px] -translate-y-1/2 z-0 opacity-90">
                        <Image
                            src="/ui/page4deviderimage.png"
                            alt="Divider Pattern"
                            fill
                            className="object-cover"
                        />
                    </div>

                    {/* Header */}
                    <div className="flex flex-col md:flex-row items-center justify-between mb-8 px-4 md:px-8">
                        <div className="w-[120px] hidden md:block"></div>

                        {/* Title */}
                        <div
                            className="text-center mt-9 md:mt-9 relative z-20"
                        >
                            <h2
                                className="text-[#310101] text-3xl md:text-5xl font-bold uppercase tracking-wider border-b-4 border-[#310101] pb-2 inline-block"
                                style={{
                                    fontFamily: 'ADLaM Display, cursive',
                                    WebkitTextStroke: '1px #310101'
                                }}
                            >
                                WEDDING DRESSES
                            </h2>
                        </div>

                        {/* 25% OFF Badge - Right - Animated */}
                        <div
                            className={`bg-[#310101] text-white  py-2 rounded-full border-2 border-[#310101] shadow-lg transform rotate-[2deg] mt-7 md:mt-9 transition-all duration-700 delay-300 mr-0 animate-pulse ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-50'
                                }`}
                        >
                            <span className="font-black text-xl md:text-2xl" style={{ fontFamily: 'Fredoka One, cursive' }}>
                                25% OFF
                            </span>
                        </div>
                    </div>

                    {/* Desktop Slider (Matches Couples Collection Style) */}
                    <div className="hidden md:block">
                        <div className="relative group">
                            <div
                                ref={weddingScrollRef}
                                className="flex gap-6 overflow-x-auto scrollbar-hide scroll-smooth pb-4 px-4"
                                style={{
                                    scrollSnapType: 'x mandatory',
                                    WebkitOverflowScrolling: 'touch'
                                }}
                            >
                                {weddingProducts.map((product, index) => (
                                    <div
                                        key={`wedding-${product.id}`}
                                        className={`flex-shrink-0 w-[280px] transition-all duration-1000 hover:scale-105 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
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

                            {/* Navigation Arrows */}
                            <button
                                onClick={() => scrollDesktop(weddingScrollRef, 'left')}
                                className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 bg-white/90 hover:bg-white text-[#310101] p-3 rounded-full shadow-xl opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110 z-10"
                                aria-label="Scroll left"
                            >
                                <ChevronLeft size={28} />
                            </button>
                            <button
                                onClick={() => scrollDesktop(weddingScrollRef, 'right')}
                                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 bg-white/90 hover:bg-white text-[#310101] p-3 rounded-full shadow-xl opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110 z-10"
                                aria-label="Scroll right"
                            >
                                <ChevronRight size={28} />
                            </button>
                        </div>
                    </div>

                    {/* Mobile Horizontal Slider */}
                    <div className="md:hidden relative">
                        <div className="overflow-hidden px-4">
                            <div
                                className="flex transition-transform duration-500 ease-in-out"
                                style={{ transform: `translateX(-${currentWeddingIndex * 100}%)` }}
                            >
                                {weddingProducts.map((product) => (
                                    <div key={`wedding-mobile-${product.id}`} className="min-w-full flex-shrink-0 flex flex-col items-center px-2">
                                        <div className="w-full max-w-sm mx-auto">
                                            <NewLandingProductCard
                                                product={product}
                                                variant="dark"
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Navigation Arrows */}
                        <button
                            onClick={handleWeddingPrev}
                            className="absolute left-0 top-1/2 -translate-y-1/2 p-2 bg-white/80 rounded-full shadow-lg hover:bg-white transition-colors z-10"
                        >
                            <ChevronLeft size={24} className="text-[#310101]" />
                        </button>
                        <button
                            onClick={handleWeddingNext}
                            className="absolute right-0 top-1/2 -translate-y-1/2 p-2 bg-white/80 rounded-full shadow-lg hover:bg-white transition-colors z-10"
                        >
                            <ChevronRight size={24} className="text-[#310101]" />
                        </button>
                    </div>

                    {/* Indicator Dots */}
                    <div className="flex justify-center gap-2 mt-6">
                        {weddingProducts.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => setCurrentWeddingIndex(index)}
                                className={`w-2 h-2 rounded-full transition-all ${index === currentWeddingIndex ? 'bg-[#310101] w-6' : 'bg-[#310101]/50'
                                    }`}
                            />
                        ))}
                    </div>
                </div>

            </div>

            {/* Styles for hiding scrollbar */}
            <style jsx global>{`
                .scrollbar-hide::-webkit-scrollbar {
                    display: none;
                }
                .scrollbar-hide {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
            `}</style>
        </section>
    );
}
