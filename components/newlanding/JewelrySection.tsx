'use client';

import Image from 'next/image';

const jewelryItems = [
    { id: 1, image: '/ui/jewlery1.png', title: 'JEWELRY JKCBSD' },
    { id: 2, image: '/ui/jewlery2.png', title: 'JEWELRY JKCBSD' },
    { id: 3, image: '/ui/jewlery1.png', title: 'JEWELRY JKCBSD' },
    { id: 4, image: '/ui/jewlery1.png', title: 'JEWELRY JKCBSD' },
    { id: 5, image: '/ui/jewlery1.png', title: 'JEWELRY JKCBSD' },
    { id: 6, image: '/ui/jewlery1.png', title: 'JEWELRY JKCBSD' },
];

export default function JewelrySection() {
    return (
        <section className="relative w-full min-h-screen overflow-hidden bg-[#310101]">
            {/* Main Background */}
            <div className="absolute inset-0 z-0">
                <Image
                    src="/ui/jewlerybg.png"
                    alt="Jewelry Background"
                    fill
                    className="object-cover opacity-50"
                />
            </div>

            {/* Top Curved Section (Dark Brown) */}
            <div className="relative z-10 w-full h-[50vh] bg-[#310101] rounded-b-[50%] flex flex-col items-center justify-center shadow-2xl">
                <div className="text-center text-white mt-[-50px]">
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
                        className="text-6xl md:text-8xl font-bold serif mb-2" 
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
                <div className="absolute bottom-[-40px] left-0 right-0 flex justify-center items-end gap-2 md:gap-4 overflow-hidden px-4">
                    {/* We'll place a series of leafs to mimic the curve. 
                        This is a simplified approach using a flex row, 
                        but we can adjust positions if needed for a perfect arc. */}
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

            {/* Jewelry Grid - Arranged in an arc/curve below the top section */}
            <div className="relative z-10 w-full max-w-7xl mx-auto px-4 mt-24 pb-20">
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 items-end">
                    {jewelryItems.map((item, index) => (
                        <div
                            key={item.id}
                            className={`flex flex-col items-center transform hover:scale-105 transition-transform duration-300 ${index === 0 || index === 5 ? 'lg:-translate-y-0' :
                                    index === 1 || index === 4 ? 'lg:translate-y-12' :
                                        'lg:translate-y-24'
                                }`}
                        >
                            <div className="relative w-full aspect-[3/4] bg-white/10 backdrop-blur-sm rounded-2xl border-2 border-white p-2 shadow-lg">
                                <div className="relative w-full h-full rounded-xl overflow-hidden">
                                    <Image
                                        src={item.image}
                                        alt={item.title}
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                            </div>
                            <p className="text-white text-xs font-bold mt-4 uppercase tracking-wider">
                                {item.title}
                            </p>
                        </div>
                    ))}
                </div>

                {/* Free Shipping Text */}
                <div className="text-center mt-32">
                    <h2 className="text-white text-4xl md:text-5xl font-bold" style={{ fontFamily: 'Fredoka One, cursive' }}>
                        Free shiping
                    </h2>
                </div>
            </div>
        </section>
    );
}
