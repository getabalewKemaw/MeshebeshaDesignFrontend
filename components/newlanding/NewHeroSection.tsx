'use client';

import Image from 'next/image';
import Link from 'next/link';

export default function NewHeroSection() {
    return (
        <section className="relative w-full h-screen min-h-[600px] overflow-hidden pt-[70px]">
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

            {/* Hero Content - Right Side on Desktop, Centered on Mobile */}
            <div className="relative z-10 h-full flex items-center justify-center md:justify-end px-8 md:px-16 lg:px-24">
                <div className="max-w-2xl text-center md:text-right space-y-4 md:space-y-6">
                    {/* Tagline - Animated */}
                    <h2
                        className="text-white text-sm sm:text-lg md:text-2xl lg:text-6xl xl:text-4xl font-normal uppercase tracking-[0.2em] animate-fade-in-up"
                        style={{
                            fontFamily: 'ADLaM Display, cursive',
                            animationDelay: '0.2s',
                            opacity: 0,
                            animationFillMode: 'forwards'
                        }}
                    >
                        ALL YOU NEED IS HERE
                    </h2>

                    {/* Main Heading - Animated */}
                    <h1
                        className="text-white text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-normal uppercase tracking-wider leading-tight animate-fade-in-up"
                        style={{
                            fontFamily: 'Abril Fatface, cursive',
                            animationDelay: '0.4s',
                            opacity: 0,
                            animationFillMode: 'forwards'
                        }}
                    >
                        MASHABESHA<br />DESIGN
                    </h1>

                    {/* Description - Animated */}
                    <p
                        className="text-white text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl font-semibold tracking-wide leading-relaxed animate-fade-in-up"
                        style={{
                            fontFamily: 'Abhaya Libre, serif',
                            animationDelay: '0.6s',
                            opacity: 0,
                            animationFillMode: 'forwards'
                        }}
                    >
                        Mashabesha Design celebrates culture through beautifully handcrafted
                        traditional clothing made with timeless artistry
                    </p>

                    {/* Sign Up Button & Search - Animated */}
                    <div
                        className="pt-4 flex flex-col items-center md:items-end gap-6 animate-fade-in-up"
                        style={{
                            animationDelay: '0.8s',
                            opacity: 0,
                            animationFillMode: 'forwards'
                        }}
                    >
                        <Link
                            href="/auth/sign-up"
                            className="inline-block bg-white text-[#310101] px-8 py-3 rounded-full font-bold text-base md:text-lg uppercase hover:bg-gray-100 hover:scale-105 transition-all shadow-lg hover:shadow-2xl"
                            style={{ fontFamily: 'Fredoka One, cursive' }}
                        >
                            SIGN UP
                        </Link>

                        {/* Search Bar */}
                        <div className="w-full max-w-md relative">
                            <input
                                type="text"
                                placeholder="Search products..."
                                className="w-full h-12 rounded-full bg-white/80 backdrop-blur-sm border-none px-6 pr-12 focus:ring-2 focus:ring-white/50 outline-none transition-all focus:bg-white"
                            />
                            <button className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-600 hover:text-black transition-colors">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <circle cx="11" cy="11" r="8"></circle>
                                    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
