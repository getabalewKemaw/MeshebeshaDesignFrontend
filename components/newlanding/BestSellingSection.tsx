'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useCategoryProducts } from './useCategoryProducts';
import NewLandingProductCard from './NewLandingProductCard';

export default function BestSellingSection() {
    const { products, loading } = useCategoryProducts('best-sellings', 8);

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 4;
    const totalPages = Math.ceil((products.length || 1) / itemsPerPage);

    const [currentMobileIndex, setCurrentMobileIndex] = useState(0);
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

    const handlePrevious = () => {
        setCurrentPage((prev) => (prev > 1 ? prev - 1 : totalPages));
    };

    const handleNext = () => {
        setCurrentPage((prev) => (prev < totalPages ? prev + 1 : 1));
    };

    const handleMobilePrevious = () => {
        setCurrentMobileIndex((prev) => (prev > 0 ? prev - 1 : products.length - 1));
    };

    const handleMobileNext = () => {
        setCurrentMobileIndex((prev) => (prev < products.length - 1 ? prev + 1 : 0));
    };

    // Derived products for current desktop page
    const currentDesktopProducts = products.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    // Removed early return to ensure ref is attached and observer runs
    // if (loading) return null;

    return (
        <section ref={sectionRef} className="relative w-full h-screen min-h-[600px] overflow-hidden pt-[70px]">
            {/* Background Image - Desktop */}
            <div className="absolute inset-0 z-0 hidden md:block">
                <Image
                    src="/ui/bgimage2.png"
                    alt="Best Selling Background"
                    fill
                    className="object-cover"
                    quality={100}
                    priority
                />
            </div>

            {/* Background Image - Mobile */}
            <div className="absolute inset-0 z-0 md:hidden">
                <Image
                    src="/bestsellinmobilebg.png"
                    alt="Best Selling Mobile Background"
                    fill
                    className="object-cover"
                    quality={100}
                    priority
                />
            </div>

            {/* Content Container - Scrollable with Left Spacing */}
            <div className="relative z-10 w-full h-full overflow-y-auto overflow-x-hidden">
                <div className="max-w-[1400px] mx-auto px-4 md:px-16 lg:px-24 py-8 md:ml-16 lg:ml-24 sm:ml-24">

                    {/* Section Title */}
                    <div className="text-center mb-12 relative">
                        <h2
                            className={`text-white text-4xl md:text-5xl lg:text-6xl font-bold uppercase tracking-wider inline-block border-b-4 border-white pb-2 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                                }`}
                            style={{ fontFamily: 'ADLaM Display, cursive' }}
                        >
                            BEST SELLING
                        </h2>
                    </div>

                    {/* 25% OFF Badge - Infinite Pulse Animation */}
                    <div className="absolute top-8 right-8 md:right-16">
                        <div
                            className={`bg-white px-6 py-2 rounded-full shadow-lg transform rotate-[-2deg] transition-all duration-700 ${isVisible ? 'opacity-100 scale-100 animate-pulse' : 'opacity-0 scale-50'
                                }`}
                        >
                            <span className="text-[#310101] font-black text-2xl md:text-3xl" style={{ fontFamily: 'Fredoka One, cursive' }}>
                                25% off
                            </span>
                        </div>
                    </div>

                    {/* Desktop: Products Horizontal Grid */}
                    <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                        {currentDesktopProducts.map((product, index) => (
                            <NewLandingProductCard
                                key={product.id}
                                product={product}
                                variant="light"
                                className={`transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
                                style={{
                                    transitionDelay: `${(index + 1) * 150}ms`
                                }}
                            />
                        ))}
                    </div>

                    {/* Mobile: Single Product Slider - Smooth Track Style */}
                    <div className="md:hidden mb-12 relative">
                        <div className="overflow-hidden px-4">
                            <div
                                className="flex transition-transform duration-500 ease-in-out"
                                style={{ transform: `translateX(-${currentMobileIndex * 100}%)` }}
                            >
                                {products.map((product) => (
                                    <div
                                        key={product.id}
                                        className="min-w-full flex-shrink-0 flex flex-col items-center transition-all duration-700"
                                    >
                                        <div className="w-full max-w-[280px] sm:max-w-sm mx-auto">
                                            <NewLandingProductCard
                                                product={product}
                                                variant="light"
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Mobile Navigation Arrows */}
                        <button
                            onClick={handleMobilePrevious}
                            className="absolute left-0 top-1/2 -translate-y-1/2 text-white hover:text-gray-300 transition-colors p-2 hover:bg-white/10 rounded-full z-10"
                            aria-label="Previous product"
                        >
                            <ChevronLeft size={28} />
                        </button>
                        <button
                            onClick={handleMobileNext}
                            className="absolute right-0 top-1/2 -translate-y-1/2 text-white hover:text-gray-300 transition-colors p-2 hover:bg-white/10 rounded-full z-10"
                            aria-label="Next product"
                        >
                            <ChevronRight size={28} />
                        </button>
                    </div>

                    {/* Mobile Product Indicator Dots */}
                    <div className="flex justify-center gap-2 mt-6">
                        {products.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => setCurrentMobileIndex(index)}
                                className={`w-2 h-2 rounded-full transition-all ${index === currentMobileIndex ? 'bg-white w-6' : 'bg-white/50'
                                    }`}
                                aria-label={`Go to product ${index + 1}`}
                            />
                        ))}
                    </div>
                </div>

                {/* Pagination / Navigation */}
                <div className="flex items-center justify-center gap-4 text-white pb-8">
                    <button
                        onClick={handlePrevious}
                        className="hover:text-gray-300 transition-colors p-2 hover:bg-white/10 rounded-full"
                        aria-label="Previous page"
                    >
                        <ChevronLeft size={32} />
                    </button>
                    <span className="text-xl font-medium tracking-widest min-w-[60px] text-center">
                        {currentPage}/{totalPages}
                    </span>
                    <button
                        onClick={handleNext}
                        className="hover:text-gray-300 transition-colors p-2 hover:bg-white/10 rounded-full"
                        aria-label="Next page"
                    >
                        <ChevronRight size={32} />
                    </button>
                </div>
            </div>

        </section>
    );
}
