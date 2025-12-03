'use client';

import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const menProducts = [
    {
        id: 1,
        image: '/ui/men1.png',
        description: 'A handwoven fetel dress decorated with colorful tibeb patterns, worn for special cultural occasions.',
    },
    {
        id: 2,
        image: '/ui/men2.png',
        description: 'A handwoven fetel dress decorated with colorful tibeb patterns, worn for special cultural occasions.',
    },
    {
        id: 3,
        image: '/ui/men1.png', // Repeated
        description: 'A handwoven fetel dress decorated with colorful tibeb patterns, worn for special cultural occasions.',
    },
];

const coupleProducts = [
    {
        id: 1,
        image: '/ui/couple1.png',
        description: 'A handwoven fetel dress decorated with colorful tibeb patterns, worn for special cultural occasions.',
    },
    {
        id: 2,
        image: '/ui/couple3.png',
        description: 'A handwoven fetel dress decorated with colorful tibeb patterns, worn for special cultural occasions.',
    },
    {
        id: 3,
        image: '/ui/couple2.png',
        description: 'A handwoven fetel dress decorated with colorful tibeb patterns, worn for special cultural occasions.',
    },
    {
        id: 4,
        image: '/ui/couple.png',
        description: 'A handwoven fetel dress decorated with colorful tibeb patterns, worn for special cultural occasions.',
    },
    {
        id: 5,
        image: '/ui/couple3.png', // Repeated
        description: 'A handwoven fetel dress decorated with colorful tibeb patterns, worn for special cultural occasions.',
    },
];

export default function MensCouplesSection() {
    return (
        <section className="relative w-full min-h-screen overflow-hidden py-20">
            {/* Background Image */}
            <div className="absolute inset-0 z-0">
                <Image
                    src="/ui/bgimageformensandcouples.png"
                    alt="Background"
                    fill
                    className="object-cover"
                    quality={100}
                />
            </div>

            {/* Content Container */}
            <div className="relative z-10 w-full max-w-[1600px] mx-auto px-4 md:px-8">

                {/* --- MEN'S COLLECTION --- */}
                <div className="mb-32 relative">
                    {/* Title */}
                    <div className="text-center mb-16">
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
                        {/* Large Flower/Mandala Badge - Left */}
                        <div className="absolute left-0 top-1/2 -translate-y-1/2 hidden xl:block z-20">
                            <div className="w-64 h-64 rounded-full bg-[#310101] flex flex-col items-center justify-center text-white border-4 border-[#D4AF37] shadow-2xl">
                                <span className="text-5xl font-black" style={{ fontFamily: 'Fredoka One, cursive' }}>25%</span>
                                <span className="text-3xl font-bold" style={{ fontFamily: 'Fredoka One, cursive' }}>OFF</span>
                            </div>
                        </div>

                        {/* Men's Product Grid (3 items) - Shifted to the right */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 z-10 w-full max-w-4xl ml-auto mr-4 md:mr-12">
                            {menProducts.map((product, index) => (
                                <div key={`men-${index}`} className="flex flex-col items-center group w-full">
                                    {/* Image Card */}
                                    <div className="relative w-full aspect-[3/4] rounded-3xl overflow-hidden mb-4 border-4 border-[#310101]/20 bg-white shadow-xl">
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

                                    {/* Description */}
                                    <p className="text-[#310101] text-center text-xs font-semibold mb-3 leading-tight px-2 line-clamp-3 bg-white/60 backdrop-blur-sm rounded p-1" style={{ fontFamily: 'Abhaya Libre, serif' }}>
                                        {product.description}
                                    </p>

                                    {/* Shop Button */}
                                    <button className="bg-[#310101] text-white px-6 py-1.5 rounded-full font-bold text-xs uppercase hover:bg-[#4a0202] transition-colors shadow-md" style={{ fontFamily: 'Fredoka One, cursive' }}>
                                        SHOP
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Pagination */}
                    <div className="flex items-center justify-center gap-4 mt-8 text-[#310101]">
                        <ChevronLeft size={24} className="cursor-pointer hover:scale-110 transition-transform" />
                        <span className="text-lg font-bold">1/20</span>
                        <ChevronRight size={24} className="cursor-pointer hover:scale-110 transition-transform" />
                    </div>
                </div>


                {/* --- COUPLE'S COLLECTION --- */}
                <div className="relative">
                    {/* Title */}
                    <div className="text-center mb-16">
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

                    {/* Couple's Product Grid (5 items) - Moved up to overlap/align with bg */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 px-4 md:px-8 mt-[-60px]">
                        {coupleProducts.map((product, index) => (
                            <div key={`couple-${index}`} className="flex flex-col items-center group">
                                {/* Image Card */}
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

                                {/* Description */}
                                <p className="text-[#310101] text-center text-xs font-semibold mb-3 leading-tight px-2 line-clamp-3 bg-white/60 backdrop-blur-sm rounded p-1" style={{ fontFamily: 'Abhaya Libre, serif' }}>
                                    {product.description}
                                </p>

                                {/* Shop Button */}
                                <button className="bg-[#310101] text-white px-6 py-1.5 rounded-full font-bold text-xs uppercase hover:bg-[#4a0202] transition-colors shadow-md" style={{ fontFamily: 'Fredoka One, cursive' }}>
                                    SHOP
                                </button>
                            </div>
                        ))}
                    </div>

                    {/* Pagination */}
                    <div className="flex items-center justify-center gap-4 mt-8 text-[#310101]">
                        <ChevronLeft size={24} className="cursor-pointer hover:scale-110 transition-transform" />
                        <span className="text-lg font-bold">1/20</span>
                        <ChevronRight size={24} className="cursor-pointer hover:scale-110 transition-transform" />
                    </div>
                </div>

            </div>
        </section>
    );
}
