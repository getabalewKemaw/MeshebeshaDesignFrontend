import Image from "next/image";

const collections = [
  {
    title: "Royal Union",
    description: "Statement pieces for couples, woven with gold-thread details.",
    image: "/ui/couple.png",
    tag: "Signature Drop",
  },
  {
    title: "Modern Minimal",
    description: "Neutral tones with architectural pleats for city moments.",
    image: "/ui/couple2.png",
    tag: "City Edit",
  },
  {
    title: "Wollo Amhara Heritage",
    description: "An homage to northern artistry, reimagined for today.",
    image: "/ui/wolloamhara.png",
    tag: "Heritage Capsule",
  },
  {
    title: "Femina Luxe",
    description: "Fluid silhouettes finished with hand-stitched necklines.",
    image: "/ui/femaledress.png",
    tag: "Evening Wear",
  },
];

export default function FeaturedCollections() {
  return (
    <section
      id="collections"
      className="bg-[#FFF9F0] px-4 py-16 font-body sm:px-6 lg:px-8"
      aria-labelledby="collections-heading"
    >
      <div className="mx-auto max-w-7xl space-y-6 text-center">
        <p className="font-heading text-sm uppercase tracking-[0.35em] text-[#CFAE56]">Collections</p>
        <h2 id="collections-heading" className="font-heading text-3xl font-semibold text-[#1E2A55] sm:text-4xl">
          Featured Habesha Capsules
        </h2>
        <p className="mx-auto max-w-3xl text-base text-[#1E2A55]/70">
          Discover artisanal drops that celebrate Ethiopian craft, luxury fabrics, and silhouettes made
          for the modern diaspora.
        </p>
      </div>

      <div className="mx-auto mt-12 grid max-w-7xl gap-6 md:grid-cols-2 lg:grid-cols-4">
        {collections.map((collection) => (
          <article
            key={collection.title}
            className="group relative overflow-hidden rounded-3xl bg-white shadow-xl shadow-[#1E2A55]/10 transition hover:-translate-y-1"
          >
            <div className="relative h-64 w-full">
              <Image
                src={collection.image}
                alt={collection.title}
                fill
                sizes="(max-width: 1024px) 50vw, 25vw"
                className="object-cover transition duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
            </div>
            <div className="space-y-3 px-6 py-5">
              <span className="inline-flex rounded-full bg-[#1E2A55]/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-[#1E2A55]">
                {collection.tag}
              </span>
              <h3 className="text-2xl font-semibold text-[#1E2A55]">{collection.title}</h3>
              <p className="text-sm text-[#1E2A55]/70">{collection.description}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

