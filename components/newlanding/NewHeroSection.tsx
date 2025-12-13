'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { getProductSuggestions } from '@/lib/api/products';
import { ProductWithDetails } from '@/types/product';
import { Loader2, Search } from 'lucide-react';
import { useTypingAnimation } from '@/hooks/useTypingAnimation';

export default function NewHeroSection() {
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState('');
    const [suggestions, setSuggestions] = useState<ProductWithDetails[]>([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const wrapperRef = useRef<HTMLDivElement>(null);

    // Typing animations for text elements
    const taglineText = "ALL YOU NEED IS HERE";
    const brandName1 = "MASHABESHA";
    const brandName2 = "DESIGN";
    const descriptionText = "Mashabesha Design celebrates culture through beautifully handcrafted traditional clothing made with timeless artistry";

    const { displayedText: displayedTagline } = useTypingAnimation({
        text: taglineText,
        speed: 80,
        delay: 200,
    });

    const { displayedText: displayedBrand1 } = useTypingAnimation({
        text: brandName1,
        speed: 100,
        delay: 700,
    });

    const { displayedText: displayedBrand2 } = useTypingAnimation({
        text: brandName2,
        speed: 100,
        delay: 1100,
    });

    const { displayedText: displayedDescription } = useTypingAnimation({
        text: descriptionText,
        speed: 30,
        delay: 1500,
    });

    // Debounce logic
    useEffect(() => {
        const timer = setTimeout(() => {
            if (searchQuery.length >= 2) {
                fetchSuggestions(searchQuery);
            } else {
                setSuggestions([]);
            }
        }, 300); // 300ms debounce

        return () => clearTimeout(timer);
    }, [searchQuery]);

    // Close suggestions on outside click
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
                setShowSuggestions(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [wrapperRef]);

    const fetchSuggestions = async (query: string) => {
        setIsLoading(true);
        try {
            const response = await getProductSuggestions(query, 5);
            if (response.success && response.data) {
                setSuggestions(response.data);
                setShowSuggestions(true);
            }
        } catch (error) {
            console.error('Error fetching suggestions:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSearchSubmit = (e?: React.FormEvent) => {
        e?.preventDefault();
        if (searchQuery.trim()) {
            router.push(`/products?q=${encodeURIComponent(searchQuery)}`);
            setShowSuggestions(false);
        }
    };

    const handleSuggestionClick = (productId: string) => {
        router.push(`/products/${productId}`);
        setShowSuggestions(false);
    };

    return (
        <section className="relative w-full h-screen min-h-[750px] overflow-hidden pt-[70px]">
            {/* Background Image - Desktop */}
            <div className="absolute inset-0 hidden md:block">
                <Image
                    src="/ui/Artboard1.jpg"
                    alt="Mashabesha Design Background"
                    fill
                    className="object-cover"
                    priority
                    quality={100}
                />
            </div>

            {/* Background Image - Mobile */}
            <div className="absolute inset-0 block md:hidden">
                <Image
                    src="/heromobilebg.png"
                    alt="Mashabesha Design Mobile Background"
                    fill
                    className="object-cover"
                    priority
                    quality={100}
                />
            </div>

            {/* Hero Content - Top/Center on Mobile, Right/Center on Desktop */}
            <div className="relative z-10 h-full flex flex-col justify-between md:flex-row md:items-center md:justify-end px-6 md:px-12 lg:px-20 py-2 md:py-0">
                {/* Text Content - Top/Center on Mobile, Right on Desktop */}
                <div className="max-w-4xl text-center md:text-right space-y-2 md:space-y-4 flex-1 flex flex-col md:block">

                    {/* Tagline - Typing Animation */}
                    <div className="overflow-visible origin-center md:origin-bottom-right">
                        <h2
                            className="text-white text-base sm:text-xl md:text-2xl lg:text-4xl xl:text-5xl font-bold uppercase tracking-[0.2em]"
                            style={{
                                fontFamily: 'ADLaM Display, cursive',
                            }}
                        >
                            {displayedTagline}
                            {displayedTagline.length < taglineText.length && (
                                <span className="animate-pulse">|</span>
                            )}
                        </h2>
                    </div>

                    {/* Main Heading - Typing Animation */}
                    <h1 className="text-white uppercase leading-[0.9] flex flex-col items-center md:items-end w-full">
                        {/* Line 1 */}
                        <span className="block pb-2">
                            <span
                                className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl"
                                style={{
                                    fontFamily: 'Abril Fatface, cursive',
                                }}
                            >
                                {displayedBrand1}
                                {displayedBrand1.length < brandName1.length && (
                                    <span className="animate-pulse">|</span>
                                )}
                            </span>
                        </span>

                        {/* Line 2 */}
                        <span className="block pb-4">
                            <span
                                className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl"
                                style={{
                                    fontFamily: 'Abril Fatface, cursive',
                                }}
                            >
                                {displayedBrand2}
                                {displayedBrand2.length < brandName2.length && (
                                    <span className="animate-pulse">|</span>
                                )}
                            </span>
                        </span>
                    </h1>

                    {/* Description - Typing Animation */}
                    <p
                        className="text-white text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl font-medium tracking-wide leading-relaxed max-w-2xl mx-auto md:ml-auto md:mr-0"
                        style={{
                            fontFamily: 'Abhaya Libre, serif',
                        }}
                    >
                        {displayedDescription}
                        {displayedDescription.length < descriptionText.length && (
                            <span className="animate-pulse">|</span>
                        )}
                    </p>

                    {/* Sign Up Button & Search - Bottom Center on Mobile, Right on Desktop */}
                    <div
                        className="pt-8 flex flex-col items-center md:items-end gap-6 md:pt-8 animate-fade-in-up mt-auto md:mt-0"
                        style={{
                            animationDelay: '2.5s',
                            opacity: 0,
                            animationFillMode: 'forwards',
                        }}
                    >
                        <Link
                            href="/auth/sign-up"
                            className="inline-block bg-white text-[#310101] px-10 py-4 rounded-full font-black text-lg md:text-xl uppercase hover:bg-gray-100 hover:scale-105 transition-all shadow-xl hover:shadow-2xl hover:tracking-widest duration-300"
                            style={{ fontFamily: 'Fredoka One, cursive' }}
                        >
                            SIGN UP
                        </Link>

                        {/* Search Bar - Modern Glassmorphism */}
                        <div ref={wrapperRef} className="w-full max-w-md relative group">
                            <div className="relative">
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    onFocus={() => searchQuery.length >= 2 && setShowSuggestions(true)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleSearchSubmit()}
                                    placeholder="Search products..."
                                    className="w-full h-14 rounded-full bg-white/56 backdrop-blur-md border border-white/30 text-white placeholder-white/70 px-8 pr-14 focus:ring-2 focus:ring-white/50 focus:bg-white/20 outline-none transition-all duration-300 shadow-lg"
                                />
                                <button
                                    onClick={() => handleSearchSubmit()}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-white/80 group-hover:text-white transition-colors duration-300 transform group-hover:scale-110"
                                >
                                    {isLoading ? (
                                        <Loader2 className="w-6 h-6 animate-spin" />
                                    ) : (
                                        <Search className="w-6 h-6" />
                                    )}
                                </button>
                            </div>

                            {/* Suggestions Dropdown */}
                            {showSuggestions && suggestions.length > 0 && (
                                <div className="absolute w-full bottom-full mb-2 bg-white rounded-2xl shadow-xl overflow-hidden z-50 text-left animate-in fade-in slide-in-from-bottom-2 duration-200">
                                    {suggestions.map((product) => (
                                        <div
                                            key={product.id}
                                            onClick={() => handleSuggestionClick(product.id)}
                                            className="flex items-center gap-4 p-3 hover:bg-gray-50 cursor-pointer border-b last:border-none border-gray-100 transition-colors"
                                        >
                                            <div className="relative h-12 w-12 rounded-lg overflow-hidden shrink-0 bg-gray-100">
                                                {product.media && product.media[0] ? (
                                                    <Image
                                                        src={product.media[0].url}
                                                        alt={product.title}
                                                        fill
                                                        className="object-cover"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                                                        <Search className="h-5 w-5" />
                                                    </div>
                                                )}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h4 className="text-sm font-semibold text-gray-900 truncate">
                                                    {product.title}
                                                </h4>
                                                <p className="text-xs text-gray-500 truncate">
                                                    {product.category?.name || 'Uncategorized'}
                                                </p>
                                            </div>
                                            <div className="text-xs font-bold text-[#310101]">
                                                {new Intl.NumberFormat('en-ET', {
                                                    style: 'currency',
                                                    currency: 'ETB'
                                                }).format(product.price)}
                                            </div>
                                        </div>
                                    ))}
                                    <div
                                        onClick={() => handleSearchSubmit()}
                                        className="p-3 text-center text-sm font-medium text-indigo-600 hover:text-indigo-800 hover:bg-gray-50 cursor-pointer border-t border-gray-100"
                                    >
                                        View all results for {searchQuery}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
