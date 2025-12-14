'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, Star } from 'lucide-react';
import { getRecentReviews, Review } from '@/lib/api/reviews';

export default function CustomerFeedbackSection() {
    const [reviews, setReviews] = useState<Review[]>([]);
    const [loading, setLoading] = useState(true);
    const scrollRef = useRef<HTMLDivElement>(null);
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(true);

    useEffect(() => {
        const fetchReviews = async () => {
            try {
                // Fetch 10 recent 5-star reviews to ensure we have enough for the slider
                const res = await getRecentReviews(10, 5);
                if (res.success && res.data) {
                    setReviews(res.data);
                }
            } catch (error) {
                console.error('Failed to load reviews:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchReviews();
    }, []);

    const checkScroll = () => {
        if (scrollRef.current) {
            const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
            setCanScrollLeft(scrollLeft > 0);
            setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
        }
    };

    useEffect(() => {
        const ref = scrollRef.current;
        if (ref) {
            ref.addEventListener('scroll', checkScroll);
            checkScroll(); // Initial check
        }
        return () => ref?.removeEventListener('scroll', checkScroll);
    }, [reviews]);

    const scroll = (direction: 'left' | 'right') => {
        if (scrollRef.current) {
            const scrollAmount = 320; // Card width + gap
            const newScrollLeft = direction === 'left'
                ? scrollRef.current.scrollLeft - scrollAmount
                : scrollRef.current.scrollLeft + scrollAmount;

            scrollRef.current.scrollTo({
                left: newScrollLeft,
                behavior: 'smooth'
            });
        }
    };

    if (loading) return null;
    if (reviews.length === 0) return null;

    return (
        <section className="w-full py-16 bg-[#310101] text-white overflow-hidden relative">
            <div className="max-w-7xl mx-auto px-4 md:px-8">
                {/* Title */}
                <div className="text-center mb-12">
                    <h2
                        className="text-3xl md:text-5xl font-bold uppercase tracking-wider inline-block border-b-2 border-white pb-2"
                        style={{ fontFamily: 'Fredoka One, cursive' }}
                    >
                        CUSTOMER FEEDBACK
                    </h2>
                </div>

                {/* Slider Container */}
                <div className="relative group px-4">
                    {/* Navigation Buttons (Desktop) */}
                    <button
                        onClick={() => scroll('left')}
                        disabled={!canScrollLeft}
                        className={`hidden md:block absolute left-0 top-1/2 -translate-y-1/2 z-10 p-3 bg-white text-[#310101] rounded-full shadow-xl transition-all hover:scale-110 disabled:opacity-0 disabled:cursor-default transform -translate-x-1/2`}
                        aria-label="Scroll left"
                    >
                        <ChevronLeft size={32} strokeWidth={3} />
                    </button>

                    <button
                        onClick={() => scroll('right')}
                        disabled={!canScrollRight}
                        className={`hidden md:block absolute right-0 top-1/2 -translate-y-1/2 z-10 p-3 bg-white text-[#310101] rounded-full shadow-xl transition-all hover:scale-110 disabled:opacity-0 disabled:cursor-default transform translate-x-1/2`}
                        aria-label="Scroll right"
                    >
                        <ChevronRight size={32} strokeWidth={3} />
                    </button>

                    {/* Scrollable Area */}
                    <div
                        ref={scrollRef}
                        className="flex gap-6 overflow-x-auto scrollbar-hide scroll-smooth py-8 px-2"
                        style={{
                            scrollSnapType: 'x mandatory',
                            WebkitOverflowScrolling: 'touch'
                        }}
                    >
                        {reviews.map((review, index) => (
                            <div
                                key={review.id}
                                className="flex-shrink-0 w-[280px] md:w-[320px] bg-white text-[#310101] rounded-xl shadow-2xl p-6 flex flex-col items-center text-center transform transition-transform hover:-translate-y-2 duration-300"
                                style={{
                                    scrollSnapAlign: 'center'
                                }}
                            >
                                {/* Avatar */}
                                <div className="w-20 h-20 rounded-full bg-[#310101] mb-4 overflow-hidden border-4 border-[#310101]/10 flex items-center justify-center">
                                    {review.user.image ? (
                                        <Image
                                            src={review.user.image}
                                            alt={review.user.name}
                                            width={80}
                                            height={80}
                                            className="object-cover w-full h-full"
                                        />
                                    ) : (
                                        <span className="text-white text-2xl font-bold uppercase">
                                            {review.user.name.charAt(0)}
                                        </span>
                                    )}
                                </div>

                                {/* Name */}
                                <h3 className="font-bold text-lg mb-2" style={{ fontFamily: 'Abhaya Libre, serif' }}>
                                    {review.user.name}
                                </h3>

                                {/* Stars */}
                                <div className="flex gap-1 mb-4 text-yellow-400">
                                    {[...Array(5)].map((_, i) => (
                                        <Star
                                            key={i}
                                            size={16}
                                            fill={i < review.rating ? "currentColor" : "none"}
                                            strokeWidth={i < review.rating ? 0 : 2}
                                            className={i < review.rating ? "text-yellow-400" : "text-gray-300"}
                                        />
                                    ))}
                                </div>

                                {/* Comment (Optional, truncated) */}
                                {review.comment && (
                                    <p className="text-sm text-gray-600 line-clamp-3 italic" style={{ fontFamily: 'Abhaya Libre, serif' }}>
                                        "{review.comment}"
                                    </p>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Mobile Scroll Indicator */}
                <div className="flex md:hidden justify-center gap-2 mt-4">
                    {[...Array(Math.min(reviews.length, 5))].map((_, i) => (
                        <div key={i} className="w-1.5 h-1.5 rounded-full bg-white/30" />
                    ))}
                </div>
            </div>

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
