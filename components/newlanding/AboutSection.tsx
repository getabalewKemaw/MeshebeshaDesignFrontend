'use client';

import Image from 'next/image';

export default function AboutSection() {
    return (
        <section className="relative w-full min-h-screen overflow-hidden py-12 md:py-20">
            {/* Background Image */}
            <div className="absolute inset-0 z-0">
                <Image
                    src="/ui/aboutbg.png"
                    alt="About Us Background"
                    fill
                    className="object-cover"
                    quality={100}
                />
                {/* Overlay for better text readability */}
                <div className="absolute inset-0 bg-black/10" />
            </div>

            {/* Content Container */}
            <div className="relative z-10 w-full max-w-5xl mx-auto px-6 md:px-12">

                {/* Title */}
                <div className="mb-12">
                    <h2
                        className="text-white text-4xl md:text-5xl font-bold uppercase tracking-wider border-b-4 border-white pb-2 inline-block"
                        style={{
                            fontFamily: 'Fredoka One, cursive',
                            WebkitTextStroke: '1px #310101'
                        }}
                    >
                        ABOUT US
                    </h2>
                </div>

                {/* Logo and Brand Section */}
                <div className="flex items-center gap-6 mb-8">
                    {/* Logo */}
                    <div className="relative w-20 h-20 md:w-28 md:h-28 flex-shrink-0 bg-white rounded-full border-4 border-[#310101] overflow-hidden shadow-xl">
                        <Image
                            src="/ui/logoimage.png"
                            alt="Mashabesha Design Logo"
                            fill
                            className="object-contain p-2"
                        />
                    </div>

                    {/* Brand Name */}
                    <div>
                        <h1
                            className="text-[#310101] text-3xl md:text-5xl font-bold uppercase leading-tight"
                            style={{ fontFamily: 'Fredoka One, cursive' }}
                        >
                            MASHABESHA<br />DESIGN
                        </h1>
                    </div>
                </div>

                {/* Tagline */}
                <div className="mb-8">
                    <p className="text-[#310101] text-xl md:text-2xl font-semibold italic" style={{ fontFamily: 'Abhaya Libre, serif' }}>
                        Where Ethiopian Tradition Meets Timeless Style
                    </p>
                </div>

                {/* Main Content */}
                <div className="space-y-6 text-[#310101]">

                    {/* Introduction */}
                    <p className="text-base md:text-lg leading-relaxed" style={{ fontFamily: 'Abhaya Libre, serif' }}>
                        Welcome to Mashabeshta Design – your home for handmade traditional Ethiopian clothing crafted with passion,
                        precision, and cultural pride.
                    </p>
                    <p className="text-base md:text-lg leading-relaxed" style={{ fontFamily: 'Abhaya Libre, serif' }}>
                        Born from a deep love for Ethiopia's vibrant heritage, Mashabesha Design brings the elegance of traditional craftsmanship
                        to the modern world. Every piece we create celebrates the artistry, spirit, and stories woven into Ethiopian culture.
                    </p>

                    {/* Our Mission */}
                    <div className="mt-8">
                        <h3 className="text-2xl md:text-3xl font-bold mb-3" style={{ fontFamily: 'Fredoka One, cursive' }}>
                            Our Mission
                        </h3>
                        <p className="text-base md:text-lg leading-relaxed mb-3" style={{ fontFamily: 'Abhaya Libre, serif' }}>
                            At Mashabesha Design, our mission is to preserve and promote the beauty of Ethiopian craftsmanship through
                            authentic, handmade clothing.
                        </p>
                        <p className="text-base md:text-lg leading-relaxed" style={{ fontFamily: 'Abhaya Libre, serif' }}>
                            We believe that every garment tells a story – of identity, history, and artistry. Our goal is to share these stories with the
                            world, empowering local artisans and inspiring appreciation for Ethiopia's timeless design traditions.
                        </p>
                    </div>

                    {/* Our Collection */}
                    <div className="mt-8">
                        <h3 className="text-2xl md:text-3xl font-bold mb-3" style={{ fontFamily: 'Fredoka One, cursive' }}>
                            Our Collection
                        </h3>
                        <p className="text-base md:text-lg leading-relaxed mb-3" style={{ fontFamily: 'Abhaya Libre, serif' }}>
                            Explore our curated selection of handcrafted garments, including:
                        </p>
                        <ul className="list-disc list-inside space-y-2 text-base md:text-lg ml-4" style={{ fontFamily: 'Abhaya Libre, serif' }}>
                            <li>Elegant traditional dresses for every occasion</li>
                            <li>Beautifully woven shawls and scarves</li>
                            <li>Authentic cultural attire with care and precision</li>
                        </ul>
                        <p className="text-base md:text-lg leading-relaxed mt-3" style={{ fontFamily: 'Abhaya Libre, serif' }}>
                            Each piece is handmade by skilled Ethiopian artisans, using time-honored weaving and embroidery techniques. With every
                            design, you'll find vibrant colors, intricate patterns, and premium natural fabrics – a true reflection of Ethiopia's cultural
                            richness.
                        </p>
                    </div>

                    {/* Our Values */}
                    <div className="mt-8">
                        <h3 className="text-2xl md:text-3xl font-bold mb-3" style={{ fontFamily: 'Fredoka One, cursive' }}>
                            Our Values
                        </h3>
                        <div className="space-y-3 text-base md:text-lg" style={{ fontFamily: 'Abhaya Libre, serif' }}>
                            <div>
                                <span className="font-bold">🌟 Heritage</span>
                                <p className="ml-6">
                                    We celebrate Ethiopia's cultural legacy by preserving traditional craftsmanship and supporting the continuation of ancient
                                    techniques.
                                </p>
                            </div>
                            <div>
                                <span className="font-bold">🌿 Sustainability</span>
                                <p className="ml-6">
                                    We are committed to ethical practices – supporting local artisans, fair wages, and environmentally conscious production.
                                </p>
                            </div>
                            <div>
                                <span className="font-bold">🤝 Community</span>
                                <p className="ml-6">
                                    We believe in building bridges between cultures through fashion – creating garments that unite people in appreciation of
                                    Ethiopian and Eritrean heritage.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Join the Journey */}
                    <div className="mt-8 bg-white/80 backdrop-blur-sm rounded-2xl p-6 md:p-8 shadow-xl">
                        <h3 className="text-2xl md:text-3xl font-bold mb-3" style={{ fontFamily: 'Fredoka One, cursive' }}>
                            Join the Mashabesha Journey
                        </h3>
                        <p className="text-base md:text-lg leading-relaxed mb-3" style={{ fontFamily: 'Abhaya Libre, serif' }}>
                            When you wear Mashabesha, you're wearing more than a garment – you're wearing a story.
                        </p>
                        <p className="text-base md:text-lg leading-relaxed mb-3" style={{ fontFamily: 'Abhaya Libre, serif' }}>
                            Each piece connects you to the artisans who lovingly created it, the culture that inspired it, and the traditions that continue to
                            thrive through every stitch.
                        </p>
                        <p className="text-base md:text-lg leading-relaxed font-semibold" style={{ fontFamily: 'Abhaya Libre, serif' }}>
                            Discover the world of Mashabesha Design – and help us celebrate the beauty of Ethiopia, one handmade garment at a time.
                        </p>
                    </div>

                </div>
            </div>
        </section>
    );
}
