'use client';
import Image from 'next/image';
import Link from 'next/link';
import { Facebook, Instagram, Linkedin } from 'lucide-react';

export default function FooterSection() {
    return (
        <footer className="relative w-full overflow-hidden bg-black">
            {/* Background Image - Desktop */}
            <div className="absolute inset-0 z-0 opacity-30 hidden md:block">
                <Image
                    src="/footerbg.png"
                    alt="Footer Background"
                    fill
                    className="object-cover"
                    quality={100}
                />
            </div>
            {/* Background Image - Mobile */}
            <div className="absolute inset-0 z-0 opacity-30 md:hidden">
                <Image
                    src="/footermobilebg.png"
                    alt="Footer Background Mobile"
                    fill
                    className="object-cover"
                    quality={100}
                />
            </div>

            {/* Content Container - Added top padding for free space */}
            <div className="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-12 pt-32 md:pt-48 pb-12 md:pb-16">

                {/* Main Footer Content */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 md:gap-12 mb-12">

                    {/* Column 1: Proudly Ethiopian */}
                    <div className="lg:col-span-1 text-center md:text-left">
                        <h3 className="text-white text-lg md:text-xl font-bold mb-4 uppercase" style={{ fontFamily: 'Fredoka One, cursive' }}>
                            PROUDLY ETHIOPIAN
                        </h3>
                        <p className="text-gray-300 text-sm leading-relaxed" style={{ fontFamily: 'Abhaya Libre, serif' }}>
                            Founded in 2025, Mashabesha Dessign offers the largest online collection of authentic Ethiopian dresses, Habesha kemis, honoring tradition while embracing modern style. Explore our curated selection and celebrate the elegance of Ethiopian culture.
                        </p>

                        {/* Social Media Icons */}
                        <div className="flex gap-4 mt-6 justify-center md:justify-start">
                            <Link href="https://facebook.com" target="_blank" className="w-10 h-10 bg-white rounded flex items-center justify-center hover:bg-gray-200 transition-colors">
                                <Facebook size={20} className="text-[#310101]" />
                            </Link>
                            <Link href="https://tiktok.com" target="_blank" className="w-10 h-10 bg-white rounded flex items-center justify-center hover:bg-gray-200 transition-colors">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" fill="#310101" />
                                </svg>
                            </Link>
                            <Link href="https://instagram.com" target="_blank" className="w-10 h-10 bg-white rounded flex items-center justify-center hover:bg-gray-200 transition-colors">
                                <Instagram size={20} className="text-[#310101]" />
                            </Link>
                            <Link href="https://linkedin.com" target="_blank" className="w-10 h-10 bg-white rounded flex items-center justify-center hover:bg-gray-200 transition-colors">
                                <Linkedin size={20} className="text-[#310101]" />
                            </Link>
                        </div>
                    </div>

                    {/* Column 2: Contact Us */}
                    <div className="lg:col-span-1 text-center md:text-left">
                        <h3 className="text-white text-lg md:text-xl font-bold mb-4 uppercase" style={{ fontFamily: 'Fredoka One, cursive' }}>
                            CONTACT US
                        </h3>
                        <div className="space-y-3 text-gray-300 text-sm" style={{ fontFamily: 'Abhaya Libre, serif' }}>
                            <div>
                                <p className="font-semibold text-white">Mashabesha Design</p>
                                <p>WhatsApp: +251 912393</p>
                            </div>
                            <div>
                                <p>Email: <a href="mailto:mashabeshadesign@gmail.com" className="hover:text-white transition-colors">mashabeshadesign@gmail.com</a></p>
                                <p>Phone number: +25198875757</p>
                            </div>
                            <div className="mt-4">
                                <p className="font-semibold text-white mb-1">Bahr dar, Warkaw Building 2nd floor no-015</p>
                                <p>Addis Ababa, Ethiopia</p>
                            </div>
                        </div>
                    </div>

                    {/* Column 3: Products */}
                    <div className="lg:col-span-1 text-center md:text-left">
                        <h3 className="text-white text-lg md:text-xl font-bold mb-4 uppercase" style={{ fontFamily: 'Fredoka One, cursive' }}>
                            PRODUCTS
                        </h3>
                        <ul className="space-y-2 text-gray-300 text-sm" style={{ fontFamily: 'Abhaya Libre, serif' }}>
                            <li><Link href="/products?category=dresses" className="hover:text-white transition-colors">Dresses</Link></li>
                            <li><Link href="/products?category=mens" className="hover:text-white transition-colors">Men's collection</Link></li>
                            <li><Link href="/products?category=couples" className="hover:text-white transition-colors">Couple's Collection</Link></li>
                            <li><Link href="/products?category=jewelry" className="hover:text-white transition-colors">Jewelry</Link></li>
                        </ul>
                    </div>

                    {/* Column 4: Support */}
                    <div className="lg:col-span-1 text-center md:text-left">
                        <h3 className="text-white text-lg md:text-xl font-bold mb-4 uppercase" style={{ fontFamily: 'Fredoka One, cursive' }}>
                            SUPPORT
                        </h3>
                        <ul className="space-y-2 text-gray-300 text-sm" style={{ fontFamily: 'Abhaya Libre, serif' }}>
                            <li><Link href="/refund-policy" className="hover:text-white transition-colors">- Refund policy</Link></li>
                            <li><Link href="/privacy-policy" className="hover:text-white transition-colors">- Privacy policy</Link></li>
                            <li><Link href="/terms-of-service" className="hover:text-white transition-colors">- Terms of service</Link></li>
                            <li><Link href="/shipping" className="hover:text-white transition-colors">- Shipping policy</Link></li>
                            <li><Link href="/faq" className="hover:text-white transition-colors">- FAQ</Link></li>
                            <li><Link href="/contact" className="hover:text-white transition-colors">- Contact information</Link></li>
                        </ul>
                    </div>

                    {/* Column 5: Company */}
                    <div className="lg:col-span-1 text-center md:text-left">
                        <h3 className="text-white text-lg md:text-xl font-bold mb-4 uppercase" style={{ fontFamily: 'Fredoka One, cursive' }}>
                            COMPANY
                        </h3>
                        <ul className="space-y-2 text-gray-300 text-sm" style={{ fontFamily: 'Abhaya Libre, serif' }}>
                            <li><Link href="/about" className="hover:text-white transition-colors">About us</Link></li>
                            <li><Link href="/privacy-policy" className="hover:text-white transition-colors">privacy</Link></li>
                            <li><Link href="/press" className="hover:text-white transition-colors">press</Link></li>
                            <li><Link href="/careers" className="hover:text-white transition-colors">careers</Link></li>
                        </ul>
                    </div>
                </div>

                {/* Design Credit */}
                <div className="text-center mb-6">
                    <p className="text-gray-400 text-sm" style={{ fontFamily: 'Abhaya Libre, serif' }}>
                        Design & Development
                    </p>
                    <p className="text-white text-base font-bold" style={{ fontFamily: 'Fredoka One, cursive' }}>
                        BT PRODUCTIONS
                    </p>
                </div>

                {/* Copyright */}
                <div className="text-center border-t border-gray-700 pt-6">
                    <p className="text-gray-400 text-sm" style={{ fontFamily: 'Abhaya Libre, serif' }}>
                        © 2025, <span className="font-bold text-white">MASHABESHA DESIGN</span>. All rights reserved
                    </p>
                </div>
            </div>
        </footer>
    );
}
