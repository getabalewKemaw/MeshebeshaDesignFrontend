"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { navLinks } from "@/constants/navlinks";
import Button from "@/components/ui/Button";

const Navbar = () => {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

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
            {navLinks.map((link) => (
              <li key={link.id}>
                <Link
                  href={link.href}
                  className={`hover:text-red-600 transition ${
                    pathname === link.href ? "text-red-700" : ""
                  }`}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          {/* Desktop Button */}
          <div className="hidden md:block">
            <Button className="bg-zinc-900 text-white border-zinc-900 hover:bg-zinc-800">
              Sign Up
            </Button>
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
              {navLinks.map((link) => (
                <li key={link.id}>
                  <Link
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className={`block hover:text-red-600 ${
                      pathname === link.href ? "text-red-700" : ""
                    }`}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
              <Button className="bg-zinc-900 text-white border-zinc-900 hover:bg-zinc-800">
                Sign Up
              </Button>
            </ul>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Navbar;
