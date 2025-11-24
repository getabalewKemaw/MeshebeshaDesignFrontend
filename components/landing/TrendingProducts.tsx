import Image from "next/image";
import Link from "next/link";

type Product = {
  id: string;
  title: string;
  price: string;
  image: string;
  label: string;
};

const placeholderProducts: Product[] = [
  {
    id: "1",
    title: "Selam Gold Netela",
    price: "8,900 ETB",
    image: "/ui/femaledress.png",
    label: "Limited",
  },
  {
    id: "2",
    title: "Abyssinia Royals Duo",
    price: "14,500 ETB",
    image: "/ui/couple.png",
    label: "Bestseller",
  },
  {
    id: "3",
    title: "Minimal Indigo Gabi",
    price: "6,200 ETB",
    image: "/ui/couple2.png",
    label: "New",
  },
  {
    id: "4",
    title: "Wollo Embroidered Cape",
    price: "9,750 ETB",
    image: "/ui/wolloamhara.png",
    label: "Heritage",
  },
];

export function ProductGrid({ products = placeholderProducts }: { products?: Product[] }) {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {products.map((product) => (
        <article
          key={product.id}
          className="group rounded-3xl border border-[#1E2A55]/10 bg-white shadow-lg shadow-[#1E2A55]/5 transition hover:-translate-y-1"
        >
          <div className="relative h-72 w-full overflow-hidden rounded-t-3xl">
            <Image
              src={product.image}
              alt={product.title}
              fill
              sizes="(max-width: 1024px) 50vw, 20vw"
              className="object-cover transition duration-500 group-hover:scale-105"
            />
            <span className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-[#1E2A55]">
              {product.label}
            </span>
          </div>
          <div className="space-y-1 px-5 py-4">
            <h3 className="font-heading text-lg font-semibold text-[#1E2A55]">{product.title}</h3>
            <p className="text-sm text-[#1E2A55]/60">{product.price}</p>
          </div>
        </article>
      ))}
    </div>
  );
}

export default function TrendingProducts() {
  return (
    <section className="bg-[#FAFAFA] px-4 py-16 font-body sm:px-6 lg:px-8" aria-labelledby="trending-heading">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="font-heading text-sm uppercase tracking-[0.35em] text-[#CFAE56]">Trending</p>
          <h2 id="trending-heading" className="font-heading text-3xl font-semibold text-[#1E2A55] sm:text-4xl">
            Trending Exclusives
          </h2>
          <p className="mt-3 max-w-2xl text-base text-[#1E2A55]/70">
            Built as a reusable grid component so you can inject live products from the CMS or API at
            any time.
          </p>
        </div>
        <Link
          href="/products"
          className="inline-flex w-fit items-center justify-center rounded-full border border-[#1E2A55] px-6 py-3 text-sm font-semibold text-[#1E2A55] transition hover:bg-[#1E2A55] hover:text-white"
        >
          View Full Catalog
        </Link>
      </div>

      <div className="mx-auto mt-10 max-w-7xl">
        <ProductGrid products={placeholderProducts} />
      </div>
    </section>
  );
}

