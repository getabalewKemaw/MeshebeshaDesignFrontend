"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import Button from "@/components/ui/Button";
import { useAuth } from "@/lib/hooks/useAuth";
import { authClient } from "@/lib/auth-client";
import { useCartStore } from "@/stores/cart";
import NotificationBell from "@/components/NotificationBell";
import { fetchCategories, Category } from "@/lib/api/categories";
import Image from "next/image";

const Navbar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isAuthenticated, isAdmin } = useAuth();
  const { itemCount: cartItems, hasHydrated: cartHydrated } = useCartStore();
  const [open, setOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [signingOut, setSigningOut] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const dropdownRef = useRef<HTMLDivElement>(null);

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

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSignOut = async () => {
    setSigningOut(true);
    await authClient.signOut();
    setDropdownOpen(false);
    router.push("/");
  };

  const getUserInitials = () => {
    if (!user?.name) return "U";
    const names = user.name.split(" ");
    if (names.length >= 2) {
      return `${names[0][0]}${names[1][0]}`.toUpperCase();
    }
    return user.name[0].toUpperCase();
  };

  return (
    <header className="sticky top-0 left-0 w-full z-50">
      {/* Small transparent gap showing shared background */}
      <div className="h-5 bg-transparent" />

      {/* White Navbar with shadow */}
      <nav className="bg-white/95 backdrop-blur-md shadow-md w-full">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <span className="text-2xl font-extrabold tracking-wide text-zinc-900">
              Mashabesha Design
            </span>
          </div>

          {/* Desktop Links */}
          <ul className="hidden md:flex space-x-8 text-[17px] font-semibold text-zinc-800">
            {/* Home Link */}
            <li>
              <Link
                href="/"
                className={`hover:text-red-600 transition ${pathname === "/" ? "text-red-700" : ""
                  }`}
              >
                Home
              </Link>
            </li>

            {/* Dynamic Category Links */}
            {!loadingCategories && categories.map((category) => (
              <li key={category.id}>
                <Link
                  href={`/categories/${category.slug}`}
                  className={`hover:text-red-600 transition ${pathname === `/categories/${category.slug}` ? "text-red-700" : ""
                    }`}
                >
                  {category.name}
                </Link>
              </li>
            ))}

            {/* Static Links */}
            <li>
              <Link
                href="/about"
                className={`hover:text-red-600 transition ${pathname === "/about" ? "text-red-700" : ""
                  }`}
              >
                About
              </Link>
            </li>
            <li>
              <Link
                href="/contact"
                className={`hover:text-red-600 transition ${pathname === "/contact" ? "text-red-700" : ""
                  }`}
              >
                Contact
              </Link>
            </li>
          </ul>

          {/* Desktop Cart + Auth */}
          <div className="hidden md:flex items-center gap-4">
            <NotificationBell />
            <Link
              href="/cart"
              className="relative inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-200 text-sm font-semibold text-gray-700 hover:border-purple-500 hover:text-purple-600"
            >
              🛒
              <span>Cart</span>
              {cartHydrated && cartItems > 0 && (
                <span className="ml-1 inline-flex min-w-[1.5rem] justify-center rounded-full bg-purple-600 px-1 text-xs font-bold text-white">
                  {cartItems > 99 ? "99+" : cartItems}
                </span>
              )}
            </Link>
            {isAuthenticated && user ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  {user.image ? (
                    <Image
                      src={user.image}
                      width={200}
                      height={200}
                      alt={user.name}
                      className="w-10 h-10 rounded-full object-cover shadow-md"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold shadow-md">
                      {getUserInitials()}
                    </div>
                  )}
                  <div className="text-left">
                    <p className="text-sm font-semibold text-gray-900">{user.name}</p>
                    <p className="text-xs text-gray-500 capitalize">{user.role || "User"}</p>
                  </div>
                  <svg
                    className={`w-4 h-4 text-gray-600 transition-transform ${dropdownOpen ? "rotate-180" : ""
                      }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {/* Dropdown Menu */}
                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-2xl border border-gray-200 py-2 z-50 animate-fadeIn">
                    <div className="px-4 py-3 border-b border-gray-200">
                      <p className="text-sm font-semibold text-gray-900">{user.name}</p>
                      <p className="text-xs text-gray-500 mt-1">{user.email}</p>
                      {isAdmin && (
                        <span className="inline-block mt-2 px-2 py-1 bg-purple-100 text-purple-700 text-xs font-medium rounded-full">
                          👑 Admin
                        </span>
                      )}
                    </div>

                    <Link
                      href="/dashboard"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      <span>📊</span>
                      <span>Dashboard</span>
                    </Link>

                    <Link
                      href="/profile"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      <span>👤</span>
                      <span>Profile</span>
                    </Link>

                    <Link
                      href="/settings"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      <span>⚙️</span>
                      <span>Settings</span>
                    </Link>

                    {isAdmin && (
                      <>
                        <div className="border-t border-gray-200 my-2"></div>
                        <Link
                          href="/dashboard"
                          onClick={() => setDropdownOpen(false)}
                          className="flex items-center gap-3 px-4 py-2 text-sm text-purple-600 hover:bg-purple-50 transition-colors font-medium"
                        >
                          <span>👑</span>
                          <span>Admin Panel</span>
                        </Link>
                      </>
                    )}

                    <div className="border-t border-gray-200 my-2"></div>

                    <button
                      onClick={handleSignOut}
                      disabled={signingOut}
                      className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50"
                    >
                      <span>🚪</span>
                      <span>{signingOut ? "Signing out..." : "Sign Out"}</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link href="/auth/sign-in">
                <Button className="bg-zinc-900 text-white border-zinc-900 hover:bg-zinc-800">
                  Login
                </Button>
              </Link>
            )}
          </div>

          {/* Hamburger Menu */}
          <button
            className="md:hidden text-zinc-800 focus:outline-none"
            onClick={() => setOpen(!open)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-7 w-7"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {open ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Drawer */}
        {open && (
          <div className="md:hidden bg-white border-t border-zinc-200 shadow-inner">
            <ul className="flex flex-col items-center py-4 space-y-4 text-lg font-medium">
              {/* Home Link */}
              <li>
                <Link
                  href="/"
                  onClick={() => setOpen(false)}
                  className={`block hover:text-red-600 ${pathname === "/" ? "text-red-700" : ""
                    }`}
                >
                  Home
                </Link>
              </li>

              {/* Dynamic Category Links */}
              {!loadingCategories && categories.map((category) => (
                <li key={category.id}>
                  <Link
                    href={`/categories/${category.slug}`}
                    onClick={() => setOpen(false)}
                    className={`block hover:text-red-600 ${pathname === `/categories/${category.slug}` ? "text-red-700" : ""
                      }`}
                  >
                    {category.name}
                  </Link>
                </li>
              ))}

              {/* Static Links */}
              <li>
                <Link
                  href="/about"
                  onClick={() => setOpen(false)}
                  className={`block hover:text-red-600 ${pathname === "/about" ? "text-red-700" : ""
                    }`}
                >
                  About
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  onClick={() => setOpen(false)}
                  className={`block hover:text-red-600 ${pathname === "/contact" ? "text-red-700" : ""
                    }`}
                >
                  Contact
                </Link>
              </li>

              {/* Cart and Notifications */}
              <li>
                <div className="flex items-center justify-between">
                  <Link
                    href="/cart"
                    onClick={() => setOpen(false)}
                    className="block hover:text-purple-600 text-purple-700"
                  >
                    🛒 Cart {cartHydrated && cartItems > 0 ? `(${cartItems})` : ""}
                  </Link>
                  <div onClick={() => setOpen(false)}>
                    <NotificationBell />
                  </div>
                </div>
              </li>
              {isAuthenticated && user ? (
                <div className="space-y-2">
                  <div className="flex items-center justify-center gap-2 pb-2 border-b border-gray-200">
                    {user.image ? (
                      <Image
                        src={user.image}
                        alt={user.name}
                        width={299}
                        height={299}
                        className="w-12 h-12 rounded-full object-cover shadow-md"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold">
                        {getUserInitials()}
                      </div>
                    )}
                    <div className="text-left">
                      <p className="text-sm font-semibold text-gray-900">{user.name}</p>
                      <p className="text-xs text-gray-500">{user.email}</p>
                    </div>
                  </div>
                  <Link
                    href="/dashboard"
                    onClick={() => setOpen(false)}
                    className="block text-center py-2 text-gray-700 hover:text-purple-600"
                  >
                    Dashboard
                  </Link>
                  <Link
                    href="/profile"
                    onClick={() => setOpen(false)}
                    className="block text-center py-2 text-gray-700 hover:text-purple-600"
                  >
                    Profile
                  </Link>
                  {isAdmin && (
                    <Link
                      href="/dashboard"
                      onClick={() => setOpen(false)}
                      className="block text-center py-2 text-purple-600 hover:text-purple-700 font-medium"
                    >
                      👑 Admin Panel
                    </Link>
                  )}
                  <button
                    onClick={handleSignOut}
                    disabled={signingOut}
                    className="w-full py-2 text-red-600 hover:text-red-700 disabled:opacity-50"
                  >
                    {signingOut ? "Signing out..." : "Sign Out"}
                  </button>
                </div>
              ) : (
                <Link href="/auth/sign-in" onClick={() => setOpen(false)}>
                  <Button className="bg-zinc-900 text-white border-zinc-900 hover:bg-zinc-800">
                    Login
                  </Button>
                </Link>
              )}
            </ul>
          </div>
        )}
      </nav>
    </header>
  );
};
export default Navbar;
