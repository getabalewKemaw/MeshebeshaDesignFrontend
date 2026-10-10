'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { User, ShoppingCart, Menu, X } from 'lucide-react';
import { useAuth } from '@/lib/hooks/useAuth';
import { authClient } from '@/lib/auth-client';
import { useCartStore } from '@/stores/cart';
import NotificationBell from '@/components/NotificationBell';
import { fetchCategories, Category } from '@/lib/api/categories';

import { ChevronDown } from 'lucide-react';

export default function NewNavBar() {
    const pathname = usePathname();
    const router = useRouter();
    const { user, isAuthenticated, isAdmin } = useAuth();
    const { itemCount: cartItems, hasHydrated: cartHydrated } = useCartStore();

    const [open, setOpen] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [signingOut, setSigningOut] = useState(false);
    const [categories, setCategories] = useState<Category[]>([]);
    const [loadingCategories, setLoadingCategories] = useState(true);
    const [scrolled, setScrolled] = useState(false);
    const [visible, setVisible] = useState(true);
    const lastScrollY = useRef(0);
    const [hoveredCategoryId, setHoveredCategoryId] = useState<string | null>(null);
    const [mobileExpandedCategory, setMobileExpandedCategory] = useState<string | null>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Handle scroll effect: hide on scroll down, show on scroll up
    useEffect(() => {
        const handleScroll = () => {
            const currentScrollY = window.scrollY;

            // Always show navbar near the top of the page
            if (currentScrollY < 60) {
                setVisible(true);
                setScrolled(currentScrollY > 20);
                lastScrollY.current = currentScrollY;
                return;
            }

            // Keep navbar visible if mobile drawer or account dropdown is open
            if (open || dropdownOpen) {
                setVisible(true);
                setScrolled(true);
                lastScrollY.current = currentScrollY;
                return;
            }

            const scrollDelta = currentScrollY - lastScrollY.current;

            // Buffer threshold to avoid jitter on micro-scrolls
            if (Math.abs(scrollDelta) > 6) {
                if (scrollDelta > 0) {
                    // Scrolling DOWN -> hide
                    setVisible(false);
                } else {
                    // Scrolling UP -> show
                    setVisible(true);
                }
                lastScrollY.current = currentScrollY;
            }

            setScrolled(true);
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, [open, dropdownOpen]);

    // Fetch categories on mount
    useEffect(() => {
        const loadCategories = async () => {
            setLoadingCategories(true);
            const data = await fetchCategories();
            setCategories(data);
            setLoadingCategories(false);
        };
        loadCategories();
    }, []);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Handle sign out
    const handleSignOut = async () => {
        setSigningOut(true);
        await authClient.signOut();
        setDropdownOpen(false);
        router.push('/');
    };

    const getUserInitials = () => {
        if (!user?.name) return 'U';
        const names = user.name.split(' ');
        if (names.length >= 2) {
            return `${names[0][0]}${names[1][0]}`.toUpperCase();
        }
        return user.name[0].toUpperCase();
    };

    return (
        <nav className={`fixed top-0 left-0 right-0 z-50 w-full bg-white/95 backdrop-blur-md border-b-[3px] border-[#310101] transition-transform duration-300 ease-in-out ${
            scrolled ? 'shadow-xl bg-white' : 'shadow-md'
        } ${visible ? 'translate-y-0' : '-translate-y-full'}`}>
            <div className="max-w-[1400px] mx-auto h-[70px] px-0 md:px-0 flex items-center justify-between">
                {/* Logo and Brand */}
                <Link href="/" className="flex items-center gap-3 group">
                    <Image
                        src="/ui/logoimage.png"
                        alt="Mashabesha Design Logo"
                        width={60}
                        height={45}
                        className="object-contain transition-transform group-hover:scale-105"
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
                </Link>

                {/* Navigation Links - Desktop */}
                <div className="hidden lg:flex items-center gap-6">
                    <Link
                        href="/"
                        className={`relative uppercase text-xs font-bold transition-all hover:text-[#310101] ${pathname === '/' ? 'text-[#310101]' : 'text-[#310101]/70'
                            }`}
                        style={{ fontFamily: 'Fredoka One, cursive' }}
                    >
                        HOME
                        {pathname === '/' && (
                            <span className="absolute left-0 right-0 -bottom-1 h-[2px] bg-[#310101]" />
                        )}
                    </Link>

                    {/* Dynamic Categories - Limit to 4 with Dropdowns */}
                    {!loadingCategories && categories.slice(0, 4).map((category) => {
                        const hasSubCategories = category.children && category.children.length > 0;
                        const isActive = pathname === `/categories/${category.slug}` || 
                                      (category.children?.some(child => pathname === `/categories/${child.slug}`));
                        
                        return (
                            <div
                                key={category.id}
                                className="relative"
                                onMouseEnter={() => hasSubCategories && setHoveredCategoryId(category.id)}
                                onMouseLeave={() => setHoveredCategoryId(null)}
                            >
                                <Link
                                    href={`/categories/${category.slug}`}
                                    className={`relative uppercase text-xs font-bold transition-all hover:text-[#310101] flex items-center gap-1 ${isActive ? 'text-[#310101]' : 'text-[#310101]/70'
                                        }`}
                                    style={{ fontFamily: 'Fredoka One, cursive' }}
                                >
                                    {category.name}
                                    {hasSubCategories && (
                                        <ChevronDown className="h-3 w-3" />
                                    )}
                                    {isActive && (
                                        <span className="absolute left-0 right-0 -bottom-1 h-[2px] bg-[#310101]" />
                                    )}
                                </Link>
                                
                                {/* Dropdown for Sub-Categories */}
                                {hasSubCategories && hoveredCategoryId === category.id && (
                                    <div 
                                        className="absolute top-full left-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50"
                                    >
                                        <div className="py-2">
                                            <Link
                                                href={`/categories/${category.slug}`}
                                                className="block px-4 py-2 text-sm font-semibold text-[#310101] hover:bg-[#310101]/5 transition-colors"
                                                style={{ fontFamily: 'Fredoka One, cursive' }}
                                                onClick={() => setHoveredCategoryId(null)}
                                            >
                                                All {category.name}
                                            </Link>
                                            <div className="h-px bg-gray-200 my-1"></div>
                                            {category.children?.map((subCategory) => (
                                                <Link
                                                    key={subCategory.id}
                                                    href={`/categories/${subCategory.slug}`}
                                                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-[#310101]/5 hover:text-[#310101] transition-colors"
                                                    onClick={() => setHoveredCategoryId(null)}
                                                >
                                                    {subCategory.name}
                                                </Link>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    })}

                    <Link
                        href="/products"
                        className={`relative uppercase text-xs font-bold transition-all hover:text-[#310101] ${pathname === '/products' ? 'text-[#310101]' : 'text-[#310101]/70'
                            }`}
                        style={{ fontFamily: 'Fredoka One, cursive' }}
                    >
                        ALL PRODUCTS
                        {pathname === '/products' && (
                            <span className="absolute left-0 right-0 -bottom-1 h-[2px] bg-[#310101]" />
                        )}
                    </Link>

                    {/* Request Us - Opens Chat */}
                    <button
                        onClick={() => {
                            const chatButton = document.querySelector('button[aria-label="Open chat"]') as HTMLButtonElement;
                            if (chatButton) chatButton.click();
                        }}
                        className="uppercase text-xs font-bold text-[#310101]/70 hover:text-[#310101] transition-all flex items-center gap-1"
                        style={{ fontFamily: 'Fredoka One, cursive' }}
                    >
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                        REQUEST
                    </button>
                </div>

                {/* Right Side - Cart, Notifications, User, Mobile Menu */}
                <div className="flex items-center gap-3">
                    {/* Cart Icon */}
                    <Link
                        href="/cart"
                        className="relative p-2 hover:bg-gray-100 rounded-full transition-colors"
                        aria-label="Shopping cart"
                    >
                        <ShoppingCart className="h-5 w-5 text-[#310101]" />
                        {cartHydrated && cartItems > 0 && (
                            <span className="absolute -top-1 -right-1 bg-[#310101] text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                                {cartItems}
                            </span>
                        )}
                    </Link>

                    {/* Notification Bell */}
                    {isAuthenticated && <NotificationBell />}

                    {/* User Menu */}
                    {isAuthenticated ? (
                        <div className="relative" ref={dropdownRef}>
                            <button
                                onClick={() => setDropdownOpen(!dropdownOpen)}
                                className="w-10 h-10 rounded-full bg-[#310101] flex items-center justify-center cursor-pointer hover:bg-[#310101]/90 transition-colors"
                                aria-label="User menu"
                            >
                                {user?.image ? (
                                    <Image
                                        src={user.image}
                                        alt="Profile"
                                        width={40}
                                        height={40}
                                        className="rounded-full object-cover"
                                    />
                                ) : (
                                    <span className="text-white font-bold text-sm">{getUserInitials()}</span>
                                )}
                            </button>

                            {/* Dropdown Menu */}
                            {dropdownOpen && (
                                <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-2xl border-2 border-[#310101]/10 py-2 z-50">
                                    <div className="px-4 py-3 border-b border-gray-100">
                                        <p className="text-sm font-semibold text-[#310101]">{user?.name}</p>
                                        <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                                    </div>

                                    <Link
                                        href="/profile"
                                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                                        onClick={() => setDropdownOpen(false)}
                                    >
                                        <svg className="h-4 w-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                        </svg>
                                        Profile
                                    </Link>

                                    <Link
                                        href="/dashboard"
                                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                                        onClick={() => setDropdownOpen(false)}
                                    >
                                        <svg className="h-4 w-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                                        </svg>
                                        Dashboard
                                    </Link>

                                    <Link
                                        href="/orders"
                                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                                        onClick={() => setDropdownOpen(false)}
                                    >
                                        <svg className="h-4 w-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                                        </svg>
                                        My Orders
                                    </Link>

                                    {isAdmin && (
                                        <Link
                                            href="/admin"
                                            className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                                            onClick={() => setDropdownOpen(false)}
                                        >
                                            <svg className="h-4 w-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                            </svg>
                                            Admin Panel
                                        </Link>
                                    )}

                                    <button
                                        onClick={handleSignOut}
                                        disabled={signingOut}
                                        className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50"
                                    >
                                        <svg className="h-4 w-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                        </svg>
                                        {signingOut ? 'Signing out...' : 'Sign Out'}
                                    </button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <Link
                            href="/auth/sign-in"
                            className="hidden md:block px-6 py-2 bg-[#310101] text-white rounded-full font-bold text-sm uppercase hover:bg-[#310101]/90 transition-colors"
                            style={{ fontFamily: 'Fredoka One, cursive' }}
                        >
                            SIGN IN
                        </Link>
                    )}

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setOpen(!open)}
                        className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        aria-label="Toggle menu"
                    >
                        {open ? (
                            <X className="h-6 w-6 text-[#310101]" />
                        ) : (
                            <Menu className="h-6 w-6 text-[#310101]" />
                        )}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            {open && (
                <div className="lg:hidden border-t-2 border-[#310101]/10 bg-white">
                    <ul className="flex flex-col px-4 py-4 space-y-3">
                        <li>
                            <Link
                                href="/"
                                onClick={() => setOpen(false)}
                                className={`block py-2 text-base font-bold uppercase ${pathname === '/' ? 'text-[#310101]' : 'text-[#310101]/70'
                                    }`}
                                style={{ fontFamily: 'Fredoka One, cursive' }}
                            >
                                HOME
                            </Link>
                        </li>

                        {!loadingCategories && categories.map((category) => {
                            const hasSubCategories = category.children && category.children.length > 0;
                            const isExpanded = mobileExpandedCategory === category.id;
                            
                            return (
                                <li key={category.id}>
                                    {hasSubCategories ? (
                                        <>
                                            <button
                                                onClick={() => setMobileExpandedCategory(isExpanded ? null : category.id)}
                                                className={`w-full flex items-center justify-between py-2 text-base font-bold uppercase ${pathname === `/categories/${category.slug}` || category.children?.some(child => pathname === `/categories/${child.slug}`) ? 'text-[#310101]' : 'text-[#310101]/70'
                                                    }`}
                                                style={{ fontFamily: 'Fredoka One, cursive' }}
                                            >
                                                {category.name}
                                                <ChevronDown className={`h-4 w-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                                            </button>
                                            {isExpanded && (
                                                <div className="pl-4 mt-1 space-y-2">
                                                    <Link
                                                        href={`/categories/${category.slug}`}
                                                        onClick={() => {
                                                            setOpen(false);
                                                            setMobileExpandedCategory(null);
                                                        }}
                                                        className={`block py-2 text-sm font-semibold ${pathname === `/categories/${category.slug}` ? 'text-[#310101]' : 'text-[#310101]/70'
                                                            }`}
                                                        style={{ fontFamily: 'Fredoka One, cursive' }}
                                                    >
                                                        All {category.name}
                                                    </Link>
                                                    {category.children?.map((subCategory) => (
                                                        <Link
                                                            key={subCategory.id}
                                                            href={`/categories/${subCategory.slug}`}
                                                            onClick={() => {
                                                                setOpen(false);
                                                                setMobileExpandedCategory(null);
                                                            }}
                                                            className={`block py-2 text-sm ${pathname === `/categories/${subCategory.slug}` ? 'text-[#310101] font-semibold' : 'text-gray-600'
                                                                }`}
                                                        >
                                                            {subCategory.name}
                                                        </Link>
                                                    ))}
                                                </div>
                                            )}
                                        </>
                                    ) : (
                                        <Link
                                            href={`/categories/${category.slug}`}
                                            onClick={() => setOpen(false)}
                                            className={`block py-2 text-base font-bold uppercase ${pathname === `/categories/${category.slug}` ? 'text-[#310101]' : 'text-[#310101]/70'
                                                }`}
                                            style={{ fontFamily: 'Fredoka One, cursive' }}
                                        >
                                            {category.name}
                                        </Link>
                                    )}
                                </li>
                            );
                        })}

                        <li>
                            <Link
                                href="/products"
                                onClick={() => setOpen(false)}
                                className={`block py-2 text-base font-bold uppercase ${pathname === '/products' ? 'text-[#310101]' : 'text-[#310101]/70'
                                    }`}
                                style={{ fontFamily: 'Fredoka One, cursive' }}
                            >
                                ALL PRODUCTS
                            </Link>
                        </li>

                        {/* Request Us - Mobile */}
                        <li>
                            <button
                                onClick={() => {
                                    setOpen(false);
                                    const chatButton = document.querySelector('button[aria-label="Open chat"]') as HTMLButtonElement;
                                    if (chatButton) chatButton.click();
                                }}
                                className="flex items-center gap-2 py-2 text-base font-bold uppercase text-[#310101]/70 hover:text-[#310101]"
                                style={{ fontFamily: 'Fredoka One, cursive' }}
                            >
                                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                </svg>
                                REQUEST US
                            </button>
                        </li>

                        {!isAuthenticated && (
                            <li>
                                <Link
                                    href="/auth/sign-in"
                                    onClick={() => setOpen(false)}
                                    className="block w-full text-center px-6 py-3 bg-[#310101] text-white rounded-full font-bold text-sm uppercase hover:bg-[#310101]/90 transition-colors"
                                    style={{ fontFamily: 'Fredoka One, cursive' }}
                                >
                                    SIGN IN
                                </Link>
                            </li>
                        )}
                    </ul>
                </div>
            )}
        </nav>
    );
}


