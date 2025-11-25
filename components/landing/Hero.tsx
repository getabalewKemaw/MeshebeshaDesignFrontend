import Image from "next/image";
import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative bg-gradient-to-br from-[#0A1128] via-[#1E2A55] to-[#0A1128] text-white overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
          backgroundSize: '40px 40px'
        }} />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center min-h-[85vh]">
          {/* Left Content */}
          <div className="space-y-8 text-center lg:text-left">
            <div className="inline-block">
              <p className="font-heading text-sm uppercase tracking-[0.35em] text-[#CFAE56] bg-[#CFAE56]/10 px-6 py-2 rounded-full">
                Habesha • Luxury • Heritage
              </p>
            </div>

            <h1 className="font-heading text-5xl font-bold leading-tight sm:text-6xl lg:text-7xl xl:text-8xl">
              Authentic
              <span className="block text-[#CFAE56] mt-2">Habesha Fashion</span>
            </h1>

            <p className="text-lg sm:text-xl lg:text-2xl text-white/90 max-w-2xl mx-auto lg:mx-0">
              Handcrafted elegance for modern Ethiopia. Couture finishes, timeless weaving, and silhouettes designed for every celebration.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link
                href="/products"
                className="inline-flex items-center justify-center rounded-full bg-[#CFAE56] px-8 py-4 font-heading text-lg font-bold text-[#1E2A55] shadow-2xl hover:bg-[#E5C976] transition-colors"
              >
                Shop Now
                <svg className="ml-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
              <Link
                href="/products"
                className="inline-flex items-center justify-center rounded-full border-2 border-white/30 px-8 py-4 font-heading text-lg font-semibold text-white hover:border-white hover:bg-white/10 transition-colors"
              >
                Explore Collections
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 pt-8 border-t border-white/20">
              <div>
                <p className="text-3xl font-bold text-[#CFAE56]">500+</p>
                <p className="text-sm text-white/70">Products</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-[#CFAE56]">10K+</p>
                <p className="text-sm text-white/70">Happy Customers</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-[#CFAE56]">100%</p>
                <p className="text-sm text-white/70">Authentic</p>
              </div>
            </div>
          </div>

          {/* Right Image */}
          <div className="relative">
            <div className="relative aspect-[3/4] w-full max-w-lg mx-auto">
              {/* Decorative Elements */}
              <div className="absolute -top-6 -left-6 w-24 h-24 bg-[#CFAE56]/20 rounded-full blur-2xl" />
              <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-[#CFAE56]/20 rounded-full blur-2xl" />

              {/* Main Image */}
              <div className="relative h-full rounded-3xl overflow-hidden border-4 border-white/10 shadow-2xl">
                <Image
                  src="/ui/heroImg.png"
                  alt="Habesha fashion model wearing traditional dress"
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                />
              </div>

              {/* Floating Badge */}
              <div className="absolute -bottom-4 -left-4 bg-white rounded-2xl p-4 shadow-xl">
                <div className="flex items-center gap-3">
                  <div className="bg-[#CFAE56] rounded-full p-2">
                    <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-bold text-[#1E2A55]">Premium Quality</p>
                    <p className="text-xs text-gray-600">Handcrafted</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 hidden lg:block">
        <div className="flex flex-col items-center gap-2 text-white/50">
          <p className="text-xs uppercase tracking-wider">Scroll</p>
          <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </div>
    </section>
  );
}
