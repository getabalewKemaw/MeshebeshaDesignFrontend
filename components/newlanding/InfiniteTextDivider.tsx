'use client';

import React from 'react';

export default function InfiniteTextDivider() {
    return (
        <div className="relative w-full overflow-hidden bg-white border-y-4 border-[#310101] py-4 z-20">
            <div className="flex">
                {/* First Marquee Item */}
                <div className="animate-marquee flex shrink-0 gap-12 items-center px-6">
                    <span className="text-[#310101] text-2xl md:text-3xl font-bold tracking-widest uppercase" style={{ fontFamily: 'ADLaM Display, cursive' }}>WEDDING</span>
                    <span className="text-[#310101] text-2xl">•</span>
                    <span className="text-[#310101] text-2xl md:text-3xl font-bold tracking-widest uppercase" style={{ fontFamily: 'ADLaM Display, cursive' }}>EVENTS</span>
                    <span className="text-[#310101] text-2xl">•</span>
                    <span className="text-[#310101] text-2xl md:text-3xl font-bold tracking-widest uppercase" style={{ fontFamily: 'ADLaM Display, cursive' }}>HOLIDAY</span>
                    <span className="text-[#310101] text-2xl">•</span>
                    <span className="text-[#310101] text-2xl md:text-3xl font-bold tracking-widest uppercase" style={{ fontFamily: 'ADLaM Display, cursive' }}>FESTIVALS</span>
                    <span className="text-[#310101] text-2xl">•</span>
                    <span className="text-[#310101] text-2xl md:text-3xl font-bold tracking-widest uppercase" style={{ fontFamily: 'ADLaM Display, cursive' }}>WEDDING</span>
                    <span className="text-[#310101] text-2xl">•</span>
                    <span className="text-[#310101] text-2xl md:text-3xl font-bold tracking-widest uppercase" style={{ fontFamily: 'ADLaM Display, cursive' }}>EVENTS</span>
                    <span className="text-[#310101] text-2xl">•</span>
                    <span className="text-[#310101] text-2xl md:text-3xl font-bold tracking-widest uppercase" style={{ fontFamily: 'ADLaM Display, cursive' }}>HOLIDAY</span>
                    <span className="text-[#310101] text-2xl">•</span>
                    <span className="text-[#310101] text-2xl md:text-3xl font-bold tracking-widest uppercase" style={{ fontFamily: 'ADLaM Display, cursive' }}>FESTIVALS</span>
                    <span className="text-[#310101] text-2xl">•</span>
                </div>

                {/* Duplicate Marquee Item for Seamless Loop */}
                <div className="animate-marquee flex shrink-0 gap-12 items-center px-6">
                    <span className="text-[#310101] text-2xl md:text-3xl font-bold tracking-widest uppercase" style={{ fontFamily: 'ADLaM Display, cursive' }}>WEDDING</span>
                    <span className="text-[#310101] text-2xl">•</span>
                    <span className="text-[#310101] text-2xl md:text-3xl font-bold tracking-widest uppercase" style={{ fontFamily: 'ADLaM Display, cursive' }}>EVENTS</span>
                    <span className="text-[#310101] text-2xl">•</span>
                    <span className="text-[#310101] text-2xl md:text-3xl font-bold tracking-widest uppercase" style={{ fontFamily: 'ADLaM Display, cursive' }}>HOLIDAY</span>
                    <span className="text-[#310101] text-2xl">•</span>
                    <span className="text-[#310101] text-2xl md:text-3xl font-bold tracking-widest uppercase" style={{ fontFamily: 'ADLaM Display, cursive' }}>FESTIVALS</span>
                    <span className="text-[#310101] text-2xl">•</span>
                    <span className="text-[#310101] text-2xl md:text-3xl font-bold tracking-widest uppercase" style={{ fontFamily: 'ADLaM Display, cursive' }}>WEDDING</span>
                    <span className="text-[#310101] text-2xl">•</span>
                    <span className="text-[#310101] text-2xl md:text-3xl font-bold tracking-widest uppercase" style={{ fontFamily: 'ADLaM Display, cursive' }}>EVENTS</span>
                    <span className="text-[#310101] text-2xl">•</span>
                    <span className="text-[#310101] text-2xl md:text-3xl font-bold tracking-widest uppercase" style={{ fontFamily: 'ADLaM Display, cursive' }}>HOLIDAY</span>
                    <span className="text-[#310101] text-2xl">•</span>
                    <span className="text-[#310101] text-2xl md:text-3xl font-bold tracking-widest uppercase" style={{ fontFamily: 'ADLaM Display, cursive' }}>FESTIVALS</span>
                    <span className="text-[#310101] text-2xl">•</span>
                </div>
            </div>
        </div>
    );
}
