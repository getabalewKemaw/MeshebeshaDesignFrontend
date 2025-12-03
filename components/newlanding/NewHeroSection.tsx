'use client';

import Image from 'next/image';
import Link from 'next/link';

export default function NewHeroSection() {
    return (
        <section className="relative w-full h-screen min-h-[600px] overflow-hidden">
            {/* Decorative Left Border Pattern */}


            {/* Background Image */}
            <div className="absolute inset-0">
                <Image
                    src="/ui/Artboard1.jpg"
                    alt="Mashabesha Design Background"
                    fill
                    className="object-cover"
                    priority
                    quality={100}
                />
            </div>

            {/* Hero Content - Right Side */}
            <div className="relative z-10 h-full flex items-center justify-end px-8 md:px-16 lg:px-24  pt-19">
                <div className="max-w-2xl text-right space-y-6">
                    {/* Tagline */}
                    <h2
                        className="text-white text-2xl md:text-3xl lg:text-4xl font-normal uppercase tracking-[0.2em]"
                        style={{ fontFamily: 'ADLaM Display, cursive' }}
                    >
                        ALL YOU NEED IS HERE
                    </h2>

                    {/* Main Heading */}
                    <h1
                        className="text-white text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-normal uppercase tracking-wider leading-tight"
                        style={{ fontFamily: 'Abril Fatface, cursive' }}
                    >
                        MASHABESHA<br />DESIGN
                    </h1>

                    {/* Description */}
                    <p
                        className="text-white text-base md:text-lg lg:text-xl font-semibold tracking-wide leading-relaxed"
                        style={{ fontFamily: 'Abhaya Libre, serif' }}
                    >
                        Mashabesha Design celebrates culture through beautifully handcrafted
                        traditional clothing made with timeless artistry
                    </p>

                    {/* Sign Up Button */}
                    <div className="pt-4 flex flex-col items-end gap-8">
                        <Link
                            href="/auth/sign-up"
                            className="inline-block bg-white text-[#310101] px-8 py-3 rounded-full font-bold text-lg uppercase hover:bg-gray-100 transition-colors shadow-lg"
                            style={{ fontFamily: 'Fredoka One, cursive' }}
                        >
                            SIGN UP
                        </Link>

                        {/* Search Bar */}
                        <div className="w-full max-w-md relative">
                            <input
                                type="text"
                                placeholder=""
                                className="w-full h-12 rounded-full bg-white/80 backdrop-blur-sm border-none px-6 pr-12 focus:ring-2 focus:ring-white/50 outline-none"
                            />
                            <button className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-600 hover:text-black">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <circle cx="11" cy="11" r="8"></circle>
                                    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Decorative Stars/Sparkles (Optional - can be added with CSS animations) */}
            <div className="absolute inset-0 pointer-events-none">
                {/* Add sparkle animations here if needed */}
            </div>
        </section>
    );
}
