'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const eventProducts = [
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
        image: '/ui/DRESS1.png',
        description: 'A handwoven fetel dress decorated with colorful tibeb patterns, worn for special cultural occasions.',
    },
];

const weddingProducts = [
    {
        id: 1,
        image: '/ui/DRESS2.png',
        description: 'Elegant wedding dress with traditional Ethiopian embroidery and modern design.',
    },
    {
        id: 2,
        image: '/ui/DRESS3.png',
        description: 'Elegant wedding dress with traditional Ethiopian embroidery and modern design.',
    },
    {
        id: 3,
        image: '/ui/DRESS4.png',
        description: 'Elegant wedding dress with traditional Ethiopian embroidery and modern design.',
    },
    {
        id: 4,
        image: '/ui/DRESS1.png',
        description: 'Elegant wedding dress with traditional Ethiopian embroidery and modern design.',
    },
    {
        id: 5,
        image: '/ui/DRESS2.png',
        description: 'Elegant wedding dress with traditional Ethiopian embroidery and modern design.',
    },
];

export default function EventHolidaySection() {
    const [currentEventIndex, setCurrentEventIndex] = useState(0);
    const [currentWeddingIndex, setCurrentWeddingIndex] = useState(0);
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

                    {/* Desktop Grid */}
                    <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-5 gap-6 px-8 md:px-16">
                        {eventProducts.map((product, index) => (
                            <div
                                key={`event-${index}`}
                                className="flex flex-col items-center group"
                            >
                                <div className="relative w-full aspect-[3/4] rounded-3xl overflow-hidden mb-4 border-4 border-[#310101]/10 bg-white shadow-xl transform transition-transform hover:-translate-y-2">
                                    <Image
                                        src={product.image}
                                        alt="Event Dress"
                                        fill
                                        className="object-cover"
                                    />
                                    <div className="absolute bottom-3 left-3 bg-[#310101] text-white px-3 py-1 rounded text-xs font-bold">
                                        SALE
                                    </div>
                                </div>
                                <p className="text-[#310101] text-center text-xs font-semibold mb-3 leading-tight px-2 line-clamp-3 bg-white/80 backdrop-blur-sm rounded p-1" style={{ fontFamily: 'Abhaya Libre, serif' }}>
                                    {product.description}
                                </p>
                                <button className="bg-[#310101] text-white px-6 py-1.5 rounded-full font-bold text-xs uppercase hover:bg-[#4a0202] transition-colors shadow-md" style={{ fontFamily: 'Fredoka One, cursive' }}>
                                    SHOP
                                </button>
                            </div>
                        ))}
                    </div>

                    {/* Mobile Horizontal Slider */}
                    <div className="md:hidden relative px-4">
                        <div className="flex flex-col items-center">
                            <div className="relative w-full max-w-sm aspect-[3/4] rounded-3xl overflow-hidden mb-4 border-4 border-[#310101]/10 bg-white shadow-xl">
                                <Image
                                    src={eventProducts[currentEventIndex].image}
                                    alt="Event Dress"
                                    fill
                                    className="object-cover"
                                />
                                <div className="absolute bottom-3 left-3 bg-[#310101] text-white px-3 py-1 rounded text-xs font-bold">
                                    SALE
                                </div>
                            </div>
                            <p className="text-[#310101] text-center text-xs font-semibold mb-3 leading-tight px-4 max-w-sm bg-white/80 backdrop-blur-sm rounded p-2" style={{ fontFamily: 'Abhaya Libre, serif' }}>
                                {eventProducts[currentEventIndex].description}
                            </p>
                            <button className="bg-[#310101] text-white px-6 py-1.5 rounded-full font-bold text-xs uppercase hover:bg-[#4a0202] transition-colors shadow-md" style={{ fontFamily: 'Fredoka One, cursive' }}>
                                SHOP
                            </button>
                        </div>

                        {/* Navigation Arrows */}
                        <button
                            onClick={handleEventPrev}
                            className="absolute left-0 top-1/2 -translate-y-1/2 p-2 bg-white/80 rounded-full shadow-lg hover:bg-white transition-colors"
                        >
                            <ChevronLeft size={24} className="text-[#310101]" />
                        </button>
                        <button
                            onClick={handleEventNext}
                            className="absolute right-0 top-1/2 -translate-y-1/2 p-2 bg-white/80 rounded-full shadow-lg hover:bg-white transition-colors"
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
                        className={`text-center mt-9 md:mt-9 transition-all duration-1000 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                            }`}
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
                        className={`bg-[#310101] text-white px-6 py-2 rounded-full border-2 border-[#310101] shadow-lg transform rotate-[2deg] mt-4 md:mt-0 transition-all duration-700 delay-300 animate-pulse ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-50'
                            }`}
                    >
                        <span className="font-black text-xl md:text-2xl" style={{ fontFamily: 'Fredoka One, cursive' }}>
                            25% OFF
                        </span>
                    </div>
                </div>

                {/* Desktop Grid */}
                <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-5 gap-6 px-8 md:px-16">
                    {weddingProducts.map((product, index) => (
                        <div
                            key={`wedding-${index}`}
                            className="flex flex-col items-center group"
                        >
                            <div className="relative w-full aspect-[3/4] rounded-3xl overflow-hidden mb-4 border-4 border-[#310101]/10 bg-white shadow-xl transform transition-transform hover:-translate-y-2">
                                <Image
                                    src={product.image}
                                    alt="Wedding Dress"
                                    fill
                                    className="object-cover"
                                />
                                <div className="absolute bottom-3 left-3 bg-[#310101] text-white px-3 py-1 rounded text-xs font-bold">
                                    SALE
                                </div>
                            </div>
                            <p className="text-[#310101] text-center text-xs font-semibold mb-3 leading-tight px-2 line-clamp-3 bg-white/80 backdrop-blur-sm rounded p-1" style={{ fontFamily: 'Abhaya Libre, serif' }}>
                                {product.description}
                            </p>
                            <button className="bg-[#310101] text-white px-6 py-1.5 rounded-full font-bold text-xs uppercase hover:bg-[#4a0202] transition-colors shadow-md" style={{ fontFamily: 'Fredoka One, cursive' }}>
                                SHOP
                            </button>
                        </div>
                    ))}
                </div>

                {/* Mobile Horizontal Slider */}
                <div className="md:hidden relative px-4">
                    <div className="flex flex-col items-center">
                        <div className="relative w-full max-w-sm aspect-[3/4] rounded-3xl overflow-hidden mb-4 border-4 border-[#310101]/10 bg-white shadow-xl">
                            <Image
                                src={weddingProducts[currentWeddingIndex].image}
                                alt="Wedding Dress"
                                fill
                                className="object-cover"
                            />
                            <div className="absolute bottom-3 left-3 bg-[#310101] text-white px-3 py-1 rounded text-xs font-bold">
                                SALE
                            </div>
                        </div>
                        <p className="text-[#310101] text-center text-xs font-semibold mb-3 leading-tight px-4 max-w-sm bg-white/80 backdrop-blur-sm rounded p-2" style={{ fontFamily: 'Abhaya Libre, serif' }}>
                            {weddingProducts[currentWeddingIndex].description}
                        </p>
                        <button className="bg-[#310101] text-white px-6 py-1.5 rounded-full font-bold text-xs uppercase hover:bg-[#4a0202] transition-colors shadow-md" style={{ fontFamily: 'Fredoka One, cursive' }}>
                            SHOP
                        </button>
                    </div>

                    {/* Navigation Arrows */}
                    <button
                        onClick={handleWeddingPrev}
                        className="absolute left-0 top-1/2 -translate-y-1/2 p-2 bg-white/80 rounded-full shadow-lg hover:bg-white transition-colors"
                    >
                        <ChevronLeft size={24} className="text-[#310101]" />
                    </button>
                    <button
                        onClick={handleWeddingNext}
                        className="absolute right-0 top-1/2 -translate-y-1/2 p-2 bg-white/80 rounded-full shadow-lg hover:bg-white transition-colors"
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

        </section>
    );
}
