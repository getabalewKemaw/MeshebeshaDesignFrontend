'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const menProducts = [
    {
        id: 1,
        image: '/ui/men1.png',
        description: 'Traditional Ethiopian men\'s attire with modern styling and cultural patterns.',
    },
    {
        id: 2,
        image: '/ui/men2.png',
        description: 'Traditional Ethiopian men\'s attire with modern styling and cultural patterns.',
    },
    {
        id: 3,
        image: '/ui/men1.png',
        description: 'Traditional Ethiopian men\'s attire with modern styling and cultural patterns.',
    },
];

const coupleProducts = [
    {
        id: 1,
        image: '/ui/couple1.png',
        description: 'Matching couple\'s traditional Ethiopian outfits for special occasions.',
    },
    {
        id: 2,
        image: '/ui/couple3.png',
        description: 'Matching couple\'s traditional Ethiopian outfits for special occasions.',
    },
    {
        id: 3,
        image: '/ui/couple2.png',
        description: 'Matching couple\'s traditional Ethiopian outfits for special occasions.',
    },
    {
        id: 4,
        image: '/ui/couple.png',
        description: 'Matching couple\'s traditional Ethiopian outfits for special occasions.',
    },
    {
        id: 5,
        image: '/ui/couple3.png',
        description: 'Matching couple\'s traditional Ethiopian outfits for special occasions.',
    },
];

export default function MensCouplesSection() {
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
                                    {menProducts.map((product, index) => (
                                        <div
                                            key={`men-${index}`}
                                            className={`flex flex-col items-center group transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                                                }`}
                                            style={{ transitionDelay: `${index * 150}ms` }}
                                        >
                                            <div className="relative w-full aspect-[3/4] rounded-3xl overflow-hidden mb-4 border-4 border-[#310101]/20 bg-white shadow-xl transform transition-transform hover:-translate-y-2">
                                                <Image
                                                    src={product.image}
                                                    alt="Men's Collection"
                                                    fill
                                                    className="object-cover"
                                                />
                                                <div className="absolute bottom-3 left-3 bg-[#310101] text-white px-3 py-1 rounded text-xs font-bold">
                                                    SALE
                                                </div>
                                            </div>
                                            <p className="text-[#310101] text-center text-xs font-semibold mb-3 leading-tight px-2 line-clamp-3 bg-white/60 backdrop-blur-sm rounded p-1" style={{ fontFamily: 'Abhaya Libre, serif' }}>
                                                {product.description}
                                            </p>
                                            <button className="bg-[#310101] text-white px-6 py-1.5 rounded-full font-bold text-xs uppercase hover:bg-[#4a0202] transition-colors shadow-md" style={{ fontFamily: 'Fredoka One, cursive' }}>
                                                SHOP
                                            </button>
                                        </div>
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
                                            <div className="relative w-full max-w-sm aspect-[3/4] rounded-3xl overflow-hidden mb-4 border-4 border-[#310101]/20 bg-white shadow-xl mx-auto">
                                                <Image
                                                    src={product.image}
                                                    alt="Men's Collection"
                                                    fill
                                                    className="object-cover"
                                                />
                                                <div className="absolute bottom-3 left-3 bg-[#310101] text-white px-3 py-1 rounded text-xs font-bold">
                                                    SALE
                                                </div>
                                            </div>
                                            <p className="text-[#310101] text-center text-xs font-semibold mb-3 leading-tight px-4 max-w-sm bg-white/60 backdrop-blur-sm rounded p-2" style={{ fontFamily: 'Abhaya Libre, serif' }}>
                                                {product.description}
                                            </p>
                                            <button className="bg-[#310101] text-white px-6 py-1.5 rounded-full font-bold text-xs uppercase hover:bg-[#4a0202] transition-colors shadow-md" style={{ fontFamily: 'Fredoka One, cursive' }}>
                                                SHOP
                                            </button>
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
                        {coupleProducts.map((product, index) => (
                            <div
                                key={`couple-${index}`}
                                className={`flex flex-col items-center group transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                                    }`}
                                style={{ transitionDelay: `${(index + 3) * 150}ms` }}
                            >
                                <div className="relative w-full aspect-[3/4] rounded-3xl overflow-hidden mb-4 border-4 border-[#310101]/20 bg-white shadow-xl transform transition-transform hover:-translate-y-2">
                                    <Image
                                        src={product.image}
                                        alt="Couple's Collection"
                                        fill
                                        className="object-cover"
                                    />
                                    <div className="absolute bottom-3 left-3 bg-[#310101] text-white px-3 py-1 rounded text-xs font-bold">
                                        SALE
                                    </div>
                                </div>
                                <p className="text-[#310101] text-center text-xs font-semibold mb-3 leading-tight px-2 line-clamp-3 bg-white/60 backdrop-blur-sm rounded p-1" style={{ fontFamily: 'Abhaya Libre, serif' }}>
                                    {product.description}
                                </p>
                                <button className="bg-[#310101] text-white px-6 py-1.5 rounded-full font-bold text-xs uppercase hover:bg-[#4a0202] transition-colors shadow-md" style={{ fontFamily: 'Fredoka One, cursive' }}>
                                    SHOP
                                </button>
                            </div>
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
                                        <div className="relative w-full max-w-sm aspect-[3/4] rounded-3xl overflow-hidden mb-4 border-4 border-[#310101]/20 bg-white shadow-xl mx-auto">
                                            <Image
                                                src={product.image}
                                                alt="Couple's Collection"
                                                fill
                                                className="object-cover"
                                            />
                                            <div className="absolute bottom-3 left-3 bg-[#310101] text-white px-3 py-1 rounded text-xs font-bold">
                                                SALE
                                            </div>
                                        </div>
                                        <p className="text-[#310101] text-center text-xs font-semibold mb-3 leading-tight px-4 max-w-sm bg-white/60 backdrop-blur-sm rounded p-2" style={{ fontFamily: 'Abhaya Libre, serif' }}>
                                            {product.description}
                                        </p>
                                        <button className="bg-[#310101] text-white px-6 py-1.5 rounded-full font-bold text-xs uppercase hover:bg-[#4a0202] transition-colors shadow-md" style={{ fontFamily: 'Fredoka One, cursive' }}>
                                            SHOP
                                        </button>
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
