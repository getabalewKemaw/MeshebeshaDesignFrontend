'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const jewelryItems = [
    { id: 1, image: '/ui/jewlery1.png', title: 'JEWELRY JKCBSD' },
    { id: 2, image: '/ui/jewlery2.png', title: 'JEWELRY JKCBSD' },
    { id: 3, image: '/ui/jewlery1.png', title: 'JEWELRY JKCBSD' },
    { id: 4, image: '/ui/jewlery1.png', title: 'JEWELRY JKCBSD' },
    { id: 5, image: '/ui/jewlery1.png', title: 'JEWELRY JKCBSD' },
    { id: 6, image: '/ui/jewlery1.png', title: 'JEWELRY JKCBSD' },
];

export default function JewelrySection() {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [itemsToShow, setItemsToShow] = useState(1);
    const [isVisible, setIsVisible] = useState(false);
    const sectionRef = useRef<HTMLElement>(null);

    // Responsive items per view
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 1024) setItemsToShow(3);
            else if (window.innerWidth >= 640) setItemsToShow(2);
            else setItemsToShow(1);
        };

        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

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

    const nextSlide = () => {
        setCurrentIndex((prev) => {
            const maxIndex = jewelryItems.length - itemsToShow;
            return prev >= maxIndex ? 0 : prev + 1;
        });
    };

    const prevSlide = () => {
        setCurrentIndex((prev) => {
            const maxIndex = jewelryItems.length - itemsToShow;
            return prev <= 0 ? maxIndex : prev - 1;
        });
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
            <div className="relative z-10 w-full h-[50vh] bg-[#310101] rounded-b-[50%] flex flex-col items-center justify-center shadow-2xl mt-[-80px]">
                <div
                    className={`text-center text-white mt-10 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                        }`}
                >
                    <h3
                        className="text-xl md:text-2xl font-bold tracking-widest mb-2"
                        style={{
                            fontFamily: 'Abhaya Libre, serif',
                            WebkitTextStroke: '0.5px #310101'
                        }}
                    >
                        TRADITIONAL CULTURAL
                    </h3>
                    <h1
                        className="text-5xl md:text-7xl lg:text-8xl font-bold serif mb-2"
                        style={{
                            fontFamily: 'Abril Fatface, cursive',
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
                <div
                    className={`absolute bottom-[-40px] left-0 right-0 flex justify-center items-end gap-2 md:gap-4 overflow-hidden px-4 transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
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
                </div>
            </div>

            {/* Slider Container */}
            <div className="relative z-10 w-full max-w-7xl mx-auto px-4 mt-24">
                <div
                    className={`relative px-12 transition-all duration-1000 delay-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                        }`}
                >
                    {/* Added overflow-visible and padding to allow for curve items to stick out */}
                    <div className="overflow-visible py-12 md:py-20 no-scrollbar">
                        <div
                            className="flex transition-transform duration-500 ease-in-out"
                            style={{
                                transform: `translateX(-${currentIndex * (100 / itemsToShow)}%)`,
                            }}
                        >
                            {jewelryItems.map((item, index) => (
                                <div
                                    key={item.id}
                                    style={{ flex: `0 0 ${100 / itemsToShow}%` }}
                                    className={`px-4 transform transition-all duration-500 ${
                                        // Curve Logic: Apply translation based on index pattern
                                        // This creates the "wave" look on desktop similar to the original grid
                                        index % 6 === 0 || index % 6 === 5 ? 'lg:-translate-y-12' :
                                            index % 6 === 1 || index % 6 === 4 ? 'lg:translate-y-0' :
                                                'lg:translate-y-12'
                                        }`}
                                >
                                    <div className="flex flex-col items-center group">
                                        <div className="relative w-full aspect-[3/4] bg-white/10 backdrop-blur-sm rounded-2xl border-2 border-white p-2 shadow-lg transform transition-transform duration-300 group-hover:scale-105">
                                            <div className="relative w-full h-full rounded-xl overflow-hidden">
                                                <Image
                                                    src={item.image}
                                                    alt={item.title}
                                                    fill
                                                    className="object-cover"
                                                />
                                            </div>
                                        </div>
                                        <p className="text-white text-xs font-bold mt-4 uppercase tracking-wider text-center">
                                            {item.title}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Navigation Arrows */}
                    <button
                        onClick={prevSlide}
                        className="absolute left-0 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 text-white p-2 rounded-full backdrop-blur-sm transition-all border border-white/20 z-20"
                    >
                        <ChevronLeft size={32} />
                    </button>
                    <button
                        onClick={nextSlide}
                        className="absolute right-0 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 text-white p-2 rounded-full backdrop-blur-sm transition-all border border-white/20 z-20"
                    >
                        <ChevronRight size={32} />
                    </button>
                </div>

                {/* Free Shipping Text */}
                <div
                    className={`text-center mt-20 transition-all duration-1000 delay-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                        }`}
                >
                    <h2 className="text-white text-4xl md:text-5xl font-bold" style={{ fontFamily: 'Fredoka One, cursive' }}>
                        Free shiping
                    </h2>
                </div>
            </div>
        </section>
    );
}
