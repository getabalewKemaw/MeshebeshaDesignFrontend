'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useCategoryProducts } from './useCategoryProducts';
import NewLandingProductCard from './NewLandingProductCard';

export default function MensCouplesSection() {
    const { products: menProducts, loading: menLoading } = useCategoryProducts('mens', 6);
    const { products: coupleProducts, loading: coupleLoading } = useCategoryProducts('couples', 10);

    const [currentMenIndex, setCurrentMenIndex] = useState(0);
    const [currentCoupleIndex, setCurrentCoupleIndex] = useState(0);
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
            { threshold: 0.1 } // Lower threshold to trigger earlier
        );

        if (sectionRef.current) {
            observer.observe(sectionRef.current);
        }

        return () => {
            if (sectionRef.current) {
                observer.unobserve(sectionRef.current);
            }
        };
    }, []); // Run once on mount

    const handleMenPrev = () => {
        setCurrentMenIndex((prev) => (prev > 0 ? prev - 1 : menProducts.length - 1));
    };

    const handleMenNext = () => {
        setCurrentMenIndex((prev) => (prev < menProducts.length - 1 ? prev + 1 : 0));
    };

    const handleCouplePrev = () => {
        setCurrentCoupleIndex((prev) => (prev > 0 ? prev - 1 : coupleProducts.length - 1));
    };

    const handleCoupleNext = () => {
        setCurrentCoupleIndex((prev) => (prev < coupleProducts.length - 1 ? prev + 1 : 0));
    };

    // Subset for Men's Desktop (Show 3)
    const menDesktop = menProducts.slice(0, 3);
    // Subset for Couple's Desktop (Show 5)
    const coupleDesktop = coupleProducts.slice(0, 5);

    // Removed early return to ensure ref is attached and observer runs
    // if (menLoading || coupleLoading) return null; 

    return (
        <section ref={sectionRef} className="relative w-full  min-h-screen overflow-hidden py-20">
            {/* Background Image - Desktop */}
            <div className="absolute inset-0 z-0 hidden md:block">
                <Image
                    src="/ui/bgimageformensandcouples.png"
                    alt="Background"
                    fill
                    className="object-cover"
                    quality={100}
                    priority
                />
            </div>

            {/* Background Image - Mobile */}
            <div className="absolute inset-0 z-0 md:hidden">
                <Image
                    src="/mensandcouplemobilebg.png"
                    alt="Mobile Background"
                    fill
                    className="object-cover"
                    quality={100}
                    priority
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
                        <div className="absolute left-0 top-1/2 -translate-y-1/2 hidden xl:block z-20">
                            <div
                                className={`w-64 h-64 rounded-full bg-[#310101] flex flex-col items-center justify-center text-white border-4 border-[#D4AF37] shadow-2xl transition-all duration-1000 animate-spin-slow ${isVisible ? 'opacity-100' : 'opacity-0'
                                    }`}
                            >
                                <span className="text-5xl font-black" style={{ fontFamily: 'Fredoka One, cursive' }}>25%</span>
                                <span className="text-3xl font-bold" style={{ fontFamily: 'Fredoka One, cursive' }}>OFF</span>
                            </div>
                        </div>

                        {/* Desktop: Horizontal Slider (3 items visible) */}
                        <div className="hidden md:block w-full max-w-5xl md:ml-64">
                            <div className="relative">
                                <div className="grid grid-cols-3 gap-8">
                                    {menDesktop.map((product, index) => (
                                        <NewLandingProductCard
                                            key={`men-${product.id}`}
                                            product={product}
                                            variant="dark"
                                            className={`transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
                                            style={{ transitionDelay: `${index * 150}ms` }}
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Mobile: Horizontal Slider (1 item at a time) */}
                        {/* Mobile: Horizontal Slider - Track */}
                        <div className="md:hidden relative">
                            <div className="overflow-hidden px-4">
                                <div
                                    className="flex transition-transform duration-500 ease-in-out"
                                    style={{ transform: `translateX(-${currentMenIndex * 100}%)` }}
                                >
                                    {menProducts.map((product) => (
                                        <div key={`men-mobile-${product.id}`} className="min-w-full flex-shrink-0 flex flex-col items-center px-2">
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
                                onClick={handleMenPrev}
                                className="absolute left-0 top-1/2 -translate-y-1/2 p-2 bg-white/80 rounded-full shadow-lg hover:bg-white transition-colors z-10"
                            >
                                <ChevronLeft size={24} className="text-[#310101]" />
                            </button>
                            <button
                                onClick={handleMenNext}
                                className="absolute right-0 top-1/2 -translate-y-1/2 p-2 bg-white/80 rounded-full shadow-lg hover:bg-white transition-colors z-10"
                            >
                                <ChevronRight size={24} className="text-[#310101]" />
                            </button>
                        </div>

                        {/* Mobile 25% Badge */}
                        <div className="flex justify-center mt-8">
                            <div className="w-40 h-40 rounded-full bg-[#310101] flex flex-col items-center justify-center text-white border-4 border-[#D4AF37] shadow-2xl animate-spin-slow">
                                <span className="text-3xl font-black" style={{ fontFamily: 'Fredoka One, cursive' }}>25%</span>
                                <span className="text-xl font-bold" style={{ fontFamily: 'Fredoka One, cursive' }}>OFF</span>
                            </div>
                        </div>
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

                    {/* Desktop: Horizontal Grid (5 items) */}
                    <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-5 gap-6 px-4 md:px-8">
                        {coupleDesktop.map((product, index) => (
                            <NewLandingProductCard
                                key={`couple-${product.id}`}
                                product={product}
                                variant="dark"
                                className={`transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
                                style={{ transitionDelay: `${(index + 3) * 150}ms` }}
                            />
                        ))}
                    </div>

                    {/* Mobile: Horizontal Slider (1 item at a time) */}
                    {/* Mobile: Horizontal Slider - Track */}
                    <div className="md:hidden relative">
                        <div className="overflow-hidden px-4">
                            <div
                                className="flex transition-transform duration-500 ease-in-out"
                                style={{ transform: `translateX(-${currentCoupleIndex * 100}%)` }}
                            >
                                {coupleProducts.map((product) => (
                                    <div key={`couple-mobile-${product.id}`} className="min-w-full flex-shrink-0 flex flex-col items-center px-2">
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
                            onClick={handleCouplePrev}
                            className="absolute left-0 top-1/2 -translate-y-1/2 p-2 bg-white/80 rounded-full shadow-lg hover:bg-white transition-colors z-10"
                        >
                            <ChevronLeft size={24} className="text-[#310101]" />
                        </button>
                        <button
                            onClick={handleCoupleNext}
                            className="absolute right-0 top-1/2 -translate-y-1/2 p-2 bg-white/80 rounded-full shadow-lg hover:bg-white transition-colors z-10"
                        >
                            <ChevronRight size={24} className="text-[#310101]" />
                        </button>

                        {/* Indicator Dots */}
                        <div className="flex justify-center gap-2 mt-6">
                            {coupleProducts.map((_, index) => (
                                <button
                                    key={index}
                                    onClick={() => setCurrentCoupleIndex(index)}
                                    className={`w-2 h-2 rounded-full transition-all ${index === currentCoupleIndex ? 'bg-[#310101] w-6' : 'bg-[#310101]/50'
                                        }`}
                                />
                            ))}
                        </div>
                    </div>
                </div>

            </div>
        </section>
    );
}
