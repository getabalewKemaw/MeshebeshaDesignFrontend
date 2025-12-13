'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useCategoryProducts } from './useCategoryProducts';
import NewLandingProductCard from './NewLandingProductCard';

export default function JewelrySection() {
    const { products, loading } = useCategoryProducts('jewlerys', 12);

    const [isVisible, setIsVisible] = useState(false);
    const sectionRef = useRef<HTMLElement>(null);
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const mobileScrollRef = useRef<HTMLDivElement>(null);

    // Observer for animation
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
            const scrollAmount = 350;
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
        <section ref={sectionRef} className="relative w-full min-h-screen overflow-hidden bg-[#310101] py-20">
            {/* Main Background */}
            <div className="absolute inset-0 z-0">
                <Image
                    src="/ui/jewlerybg.png"
                    alt="Jewelry Background"
                    fill
                    className="object-cover opacity-50"
                    quality={100}
                />
            </div>

            {/* Top Curved Section (Dark Brown) */}
            <div className="relative z-10 w-[85%] max-w-[1400px] mx-auto h-[55vh] bg-[#310101] border-white text-white border-b-4 border-l-5 border-r-5 border-t-5 rounded-b-[100%] flex flex-col items-center justify-start pt-24 shadow-2xl mt-[-100px] box-border"
                style={{
                    borderBottomLeftRadius: '50% 100%',
                    borderBottomRightRadius: '50% 100%',
                    borderBottomWidth: '6px',
                    borderColor: 'white'
                }}
            >
                <div
                    className={`text-center transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                        }`}
                >
                    <h3
                        className="text-xl md:text-5xl font-bold tracking-widest mb-2 pl-15"
                        style={{
                            fontFamily: 'Abhaya Libre, serif',
                            WebkitTextStroke: '0.5px #310101'
                        }}
                    >
                        TRADITIONAL CULTURAL
                    </h3>
                    <h1
                        className="text-5xl md:text-8xl lg:text-8xl font-bold serif mb-2 text-white"
                        style={{
                            fontFamily: 'Abril Fatface',
                            WebkitTextStroke: '2px #310101'
                        }}
                    >
                        JEWELRY
                    </h1>
                    <h3
                        className="text-xl md:text-2xl font-bold tracking-widest"
                        style={{
                            fontFamily: 'Abhaya Libre, serif',
                            WebkitTextStroke: '0.5px #310101'
                        }}
                    >
                        ON MASHABESHA
                    </h3>
                </div>

                {/* Decorative Leafs - Arranged in a curve along the bottom edge */}
            {/*     <div
                    className={`relative bottom-[10%] left-0 right-0  -top-10 flex justify-center items-end gap-2 md:gap-4 overflow-hidden px-4 transition-all duration-1000 delay-300  pt-10 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                        }`}
                >
                    {[...Array(9)].map((_, i) => (
                        <div key={i} className={`relative ${i % 2 === 0 ? 'w-16 h-20 md:w-24 md:h-32' : 'w-12 h-16 md:w-16 md:h-24'} transform ${i < 4 ? `rotate-[${(4 - i) * 10}deg] translate-y-${(4 - i) * 10}px` : i > 4 ? `rotate-[-${(i - 4) * 10}deg] translate-y-${(i - 4) * 10}px` : 'translate-y-4'}`}>
                            <Image
                                src={i % 2 === 0 ? "/ui/jewlearyleafs.png" : "/ui/smalljewleryleafs.png"}
                                alt="Decorative Leaf"
                                fill
                                className="object-contain"
                            />
                        </div>
                    ))}
                </div> */}
            </div>

            {/* Desktop: Horizontal Scroll Container with Curved Layout */}
            <div className="hidden md:block relative z-10 w-full max-w-[1600px] mx-auto px-4 -mt-20">
                <div
                    className={`relative px-12 transition-all duration-1000 delay-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                        }`}
                >
                    <div className="relative group">
                        <div
                            ref={scrollContainerRef}
                            className="flex gap-4 overflow-x-auto scrollbar-hide scroll-smooth pb-20 pt-32 px-10"
                            style={{
                                scrollSnapType: 'x mandatory',
                                WebkitOverflowScrolling: 'touch'
                            }}
                        >
                            {products.map((product, index) => {
                                // Implement "U-shape" / Bowl curve: Edges High, Center Low
                                const totalProducts = products.length;
                                const middle = (totalProducts - 1) / 2;
                                const indexFromMiddle = index - middle;

                                // Angle spread - fanning out slightly
                                const angleStep = 4;
                                const rotateAngle = indexFromMiddle * angleStep;

                                // Parabolic Curve: y = k * x^2
                                // We want edges to be HIGHER (negative Y relative to center).
                                // Let's use a standard U-shape.
                                // We will push the center DOWN (positive Y) or edges UP (negative Y).
                                // To avoid overlap with the banner above, let's push edges UP (negative Y).
                                const yOffset = Math.abs(indexFromMiddle) * Math.abs(indexFromMiddle) * 10;

                                return (
                                    <div
                                        key={product.id}
                                        className={`flex-shrink-0 w-[260px] transition-all duration-700 hover:scale-110 hover:z-20 ${isVisible ? 'opacity-100' : 'opacity-0'
                                            }`}
                                        style={{
                                            transitionDelay: `${(index % 5) * 100}ms`,
                                            scrollSnapAlign: 'center',
                                            transform: `rotate(${rotateAngle}deg) translateY(-${yOffset}px)`, // Negative Y pushes edges UP
                                            transformOrigin: 'center 150%', // Pivot point below
                                            zIndex: 10
                                        }}
                                    >
                                        <NewLandingProductCard
                                            product={product}
                                            variant="light"
                                        />
                                    </div>
                                );
                            })}
                        </div>

                        {/* Desktop Navigation Arrows */}
                        <button
                            onClick={() => scrollDesktop('left')}
                            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 bg-white/90 hover:bg-white text-[#310101] p-3 rounded-full shadow-xl opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110 z-10"
                            aria-label="Scroll left"
                            disabled={!scrollContainerRef.current}
                        >
                            <ChevronLeft size={28} />
                        </button>
                        <button
                            onClick={() => scrollDesktop('right')}
                            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 bg-white/90 hover:bg-white text-[#310101] p-3 rounded-full shadow-xl opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110 z-10"
                            aria-label="Scroll right"
                            disabled={!scrollContainerRef.current}
                        >
                            <ChevronRight size={28} />
                        </button>
                    </div>
                </div>
            </div>



            {/* Mobile: Horizontal Scroll with Peek Effect */}
            <div className="md:hidden relative z-10 w-full mt-24">
                <div
                    className={`relative transition-all duration-1000 delay-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                        }`}
                >
                    <div className="relative group">
                        <div
                            ref={mobileScrollRef}
                            className="flex gap-4 overflow-x-auto scrollbar-hide scroll-smooth px-6 pb-8"
                            style={{
                                scrollSnapType: 'x mandatory',
                                WebkitOverflowScrolling: 'touch'
                            }}
                        >
                            {products.map((product, index) => (
                                <div
                                    key={product.id}
                                    className={`flex-shrink-0 w-[85%] max-w-[320px] transition-all duration-500 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'
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

            {/* Free Shipping Text */}
            <div
                className={`text-center mt-20 transition-all duration-1000 delay-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                    }`}
            >
                <h2 className="text-white text-4xl md:text-5xl font-bold" style={{ fontFamily: 'Fredoka One, cursive' }}>
                    Free shipping
                </h2>
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
            `}</style>
        </section>
    );
}
