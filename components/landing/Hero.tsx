import Image from "next/image";
import Link from "next/link";

export default function Hero() {
  return (
    <section className="bg-[#0A1128] text-white" aria-labelledby="hero-heading">
      <div className="mx-auto flex min-h-[90vh] max-w-7xl flex-col gap-12 px-4 py-20 sm:px-6 lg:flex-row lg:items-center lg:gap-16 lg:px-8">
        <div className="flex-1 space-y-6">
          <p className="font-heading text-sm uppercase tracking-[0.35em] text-[#CFAE56]/80">
            Habesha • Luxury • Heritage
          </p>
          <div className="space-y-6">
            <h1
              id="hero-heading"
              className="font-heading text-4xl font-semibold leading-tight sm:text-5xl lg:text-6xl xl:text-7xl"
            >
              Authentic Habesha Fashion
            </h1>
            <p className="max-w-2xl font-body text-lg text-white/80 sm:text-xl lg:text-2xl">
              Handcrafted elegance for modern Ethiopia. Couture finishes, timeless weaving, and silhouettes
              designed for every celebration.
            </p>
          </div>
          <div className="flex flex-wrap gap-4">
            <Link
              href="/products"
              className="rounded-full bg-[#CFAE56] px-8 py-3 font-heading text-base font-semibold text-[#1E2A55] shadow-lg shadow-[#CFAE56]/30 transition hover:-translate-y-0.5 hover:bg-[#E5C976]"
            >
              Shop Now
            </Link>
            <Link
              href="#collections"
              className="rounded-full border border-white/30 px-8 py-3 font-heading text-base font-semibold text-white transition hover:border-white hover:bg-white/10"
            >
              Explore Collections
            </Link>
          </div>
        </div>

        <div className="relative flex-1">
          <div className="absolute inset-0 rounded-[32px] bg-[#CFAE56]/10 blur-3xl" aria-hidden="true" />
          <div className="relative rounded-[32px] border border-white/15 bg-[#10183a] p-4 shadow-2xl">
            <div className="relative h-[420px] w-full overflow-hidden rounded-[24px]">
              <Image
                src="/ui/heroImg.png"
                alt="Habesha fashion model wearing traditional dress"
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

