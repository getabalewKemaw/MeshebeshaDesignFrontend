import Link from "next/link";
import { Facebook, Instagram, Mail, Phone, Youtube } from "lucide-react";

export default function Footer() {
  const socials = [
    { icon: Instagram, href: "https://instagram.com", label: "Instagram" },
    { icon: Facebook, href: "https://facebook.com", label: "Facebook" },
    { icon: Youtube, href: "https://youtube.com", label: "YouTube" },
  ];

  const quickLinks = [
    { label: "Shop", href: "/products" },
    { label: "About", href: "/about" },
    { label: "Contact", href: "/contact" },
    { label: "Custom Orders", href: "/custom" },
  ];

  return (
    <footer className="bg-[#0A1128] px-4 py-16 font-body text-white sm:px-6 lg:px-8" aria-labelledby="footer-heading">
      <div className="mx-auto grid max-w-7xl gap-10 md:grid-cols-4">
        <div className="space-y-4">
          <p className="font-heading text-xs uppercase tracking-[0.4em] text-[#CFAE56]">Habesha</p>
          <h3 id="footer-heading" className="font-heading text-2xl font-semibold">
            Habesha Fashion House
          </h3>
          <p className="text-sm text-white/70">
            Luxury ready-to-wear and custom tailoring rooted in Ethiopian craftsmanship.
          </p>
          <div className="flex gap-3">
            {socials.map((social) => (
              <Link
                key={social.label}
                href={social.href}
                aria-label={social.label}
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/20 text-white transition hover:border-[#CFAE56] hover:text-[#CFAE56]"
              >
                <social.icon className="h-5 w-5" strokeWidth={1.5} />
              </Link>
            ))}
          </div>
        </div>

        <div>
          <h4 className="font-heading text-lg font-semibold text-white">Quick Links</h4>
          <ul className="mt-4 space-y-3 text-sm text-white/70">
            {quickLinks.map((link) => (
              <li key={link.label}>
                <Link href={link.href} className="transition hover:text-[#CFAE56]">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="font-heading text-lg font-semibold text-white">Contact</h4>
          <ul className="mt-4 space-y-3 text-sm text-white/70">
            <li className="flex items-center gap-2">
              <Phone className="h-4 w-4" strokeWidth={1.5} />
              +251 90 123 4567
            </li>
            <li className="flex items-center gap-2">
              <Mail className="h-4 w-4" strokeWidth={1.5} />
              atelier@habesha-fashion.com
            </li>
            <li>Addis Ababa, Ethiopia</li>
          </ul>
        </div>

        <div>
          <h4 className="font-heading text-lg font-semibold text-white">Visit Our Atelier</h4>
          <p className="mt-4 text-sm text-white/70">
            Schedule a private appointment for custom tailoring or styling sessions with our design team.
          </p>
          <Link
            href="/contact"
            className="mt-4 inline-flex rounded-full border border-[#CFAE56] px-6 py-2 text-sm font-semibold text-[#CFAE56] transition hover:bg-[#CFAE56] hover:text-[#0A1128]"
          >
            Book Session
          </Link>
        </div>
      </div>
      <div className="mx-auto mt-12 max-w-7xl border-t border-white/10 pt-6 text-center text-xs text-white/50">
        © {new Date().getFullYear()} Habesha Fashion. All rights reserved.
      </div>
    </footer>
  );
}

