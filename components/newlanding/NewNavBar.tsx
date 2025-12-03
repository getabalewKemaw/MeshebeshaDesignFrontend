'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { User } from 'lucide-react';
import { useSession } from '@/lib/auth-client';

export default function NewNavBar() {
    const { data: session } = useSession();
    const [activeLink, setActiveLink] = useState('home');

    const navLinks = [
        { id: 'home', label: 'HOME', href: '/newlanding' },
        { id: 'dress', label: 'DRESS', href: '/products?category=dress' },
        { id: 'mens', label: "MEN'S", href: '/products?category=mens' },
        { id: 'couples', label: 'COUPLES', href: '/products?category=couples' },
        { id: 'jewelry', label: 'JEWELRY', href: '/products?category=jewelry' },
        { id: 'feedback', label: 'CUSTOMER FEEDBACK', href: '/newlanding#feedback' },
        { id: 'custom', label: 'CUSTOM', href: '/custom-request' },
        { id: 'about', label: 'ABOUT US', href: '/newlanding#about' },
    ];

    return (
        <nav className="fixed top-[27px] left-0 right-0 z-50 w-full bg-white border-b-[3px] border-[#310101] shadow-md">
            <div className="max-w-[1280px] mx-auto h-[56px] px-6 flex items-center justify-between">
                {/* Logo and Brand */}
                <div className="flex items-center gap-3">
                    <Image
                        src="/ui/logoimage.png"
                        alt="logo image"
                        width={60}
                        height={45}
                        className="object-contain"
                        priority
                    />
                    <div className="flex flex-col leading-tight">
                        <span
                            className="text-[#310101] font-bold text-sm uppercase"
                            style={{ fontFamily: 'Fredoka One, cursive' }}
                        >
                            MASHABESHA
                        </span>
                        <span
                            className="text-[#310101] font-bold text-sm uppercase"
                            style={{ fontFamily: 'Fredoka One, cursive' }}
                        >
                            DESIGN
                        </span>
                    </div>
                </div>

                {/* Navigation Links - Desktop */}
                <div className="hidden lg:flex items-center gap-5">
                    {navLinks.map((link) => (
                        <Link
                            key={link.id}
                            href={link.href}
                            onClick={() => setActiveLink(link.id)}
                            className={`relative uppercase text-xs font-bold transition-all hover:text-[#310101] ${activeLink === link.id ? 'text-[#310101]' : 'text-[#310101]/80'
                                }`}
                            style={{ fontFamily: 'Fredoka One, cursive' }}
                        >
                            {link.label}
                            {activeLink === link.id && (
                                <span className="absolute left-0 right-0 -bottom-1 h-[2px] bg-[#310101]" />
                            )}
                        </Link>
                    ))}
                </div>

                {/* Right Side - Language & Avatar */}
                <div className="flex items-center gap-4">
                    {/* Language Selector */}
                    <div className="flex items-center gap-1 text-[#310101] text-xs font-semibold">
                        <button className="hover:underline">Eg</button>
                        <span>/</span>
                        <button className="hover:underline">Am</button>
                    </div>

                    {/* Avatar Icon */}
                    <Link href={session ? '/profile' : '/auth/sign-in'}>
                        <div className="w-10 h-10 rounded-full bg-[#310101] flex items-center justify-center cursor-pointer hover:bg-[#310101]/90 transition-colors">
                            {session?.user?.image ? (
                                <Image
                                    src={session.user.image}
                                    alt="Profile"
                                    width={24}
                                    height={24}
                                    className="rounded-full object-cover"
                                />
                            ) : (
                                <User className="w-5 h-5 text-white" />
                            )}
                        </div>
                    </Link>
                </div>
            </div>
        </nav>
    );
}
