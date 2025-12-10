'use client';

import Image from 'next/image';
import Link from 'next/link';

export default function NewHeroSection() {
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

            {/* Hero Content - Right Side on Desktop, Centered on Mobile */}
            {/* Increased max-width to allow huge text to breathe */}
            <div className="relative z-10 h-full flex items-center justify-center md:justify-end px-8 md:px-16 lg:px-24">
                <div className="max-w-4xl text-center md:text-right space-y-2 md:space-y-4">

                    {/* Tagline - Modern Cinematic Expansion with Rotation */}
                    <div className="overflow-visible transform -rotate-2 origin-bottom-center md:origin-bottom-right">
                        <h2
                            className="text-white text-base sm:text-xl md:text-3xl lg:text-4xl xl:text-5xl font-bold uppercase tracking-[0.2em] animate-tracking-expand"
                            style={{
                                fontFamily: 'ADLaM Display, cursive',
                                opacity: 0,
                                animationFillMode: 'forwards',
                                animationDelay: '0.2s'
                            }}
                        >
                            ALL YOU NEED IS HERE
                        </h2>
                    </div>

                    {/* Main Heading - Masked Rotated Reveal (Shocking Impact) */}
                    <h1 className="text-white font-normal uppercase leading-[0.9] flex flex-col items-center md:items-end w-full">
                        {/* Line 1 */}
                        <span className="block overflow-hidden pb-2 pl-2 pr-2">
                            <span
                                className="block text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl animate-reveal-rotate"
                                style={{
                                    fontFamily: 'Abril Fatface, cursive',
                                    transform: 'translateY(110%) rotate(5deg)',
                                    animationDelay: '0.7s'
                                }}
                            >
                                MASHABESHA
                            </span>
                        </span>

                        {/* Line 2 */}
                        <span className="block overflow-hidden pb-4 pl-2 pr-2">
                            <span
                                className="block text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl animate-reveal-rotate"
                                style={{
                                    fontFamily: 'Abril Fatface, cursive',
                                    transform: 'translateY(110%) rotate(5deg)',
                                    animationDelay: '1.1s'
                                }}
                            >
                                DESIGN
                            </span>
                        </span>
                    </h1>

                    {/* Description - Blur Slide In with Delay */}
                    <p
                        className="text-white text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl font-medium tracking-wide leading-relaxed animate-blur-slide max-w-2xl ml-auto"
                        style={{
                            fontFamily: 'Abhaya Libre, serif',
                            opacity: 0,
                            animationFillMode: 'forwards',
                            animationDelay: '1.5s'
                        }}
                    >
                        Mashabesha Design celebrates culture through beautifully handcrafted
                        traditional clothing made with timeless artistry
                    </p>

                    {/* Sign Up Button & Search - Fade/Blur In with Delay */}
                    <div
                        className="pt-8 flex flex-col items-center md:items-end gap-6 animate-blur-slide"
                        style={{
                            opacity: 0,
                            animationFillMode: 'forwards',
                            animationDelay: '1.8s'
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
                        <div className="w-full max-w-md relative group">
                            <input
                                type="text"
                                placeholder="Search products..."
                                className="w-full h-14 rounded-full bg-white/10 backdrop-blur-md border border-white/30 text-white placeholder-white/70 px-8 pr-14 focus:ring-2 focus:ring-white/50 focus:bg-white/20 outline-none transition-all duration-300 shadow-lg"
                            />
                            <button className="absolute right-4 top-1/2 -translate-y-1/2 text-white/80 group-hover:text-white transition-colors duration-300 transform group-hover:scale-110">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
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
