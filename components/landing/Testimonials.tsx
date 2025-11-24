import Image from "next/image";

const testimonials = [
  {
    name: "Selamawit T.",
    location: "Addis Ababa",
    quote:
      "The detailing is couture-level. I wore the custom netela for my wedding brunch and the compliments have not stopped.",
    image: "https://res.cloudinary.com/demo/image/upload/v1700123456/habesha-bride.jpg",
  },
  {
    name: "Kaleb G.",
    location: "Washington DC",
    quote:
      "Finally a Habesha brand that ships fast and respects the craft. The couple set fit perfectly straight out of the box.",
    image: "https://res.cloudinary.com/demo/image/upload/v1700123456/habesha-groom.jpg",
  },
  {
    name: "Hanna M.",
    location: "Bahir Dar",
    quote:
      "I loved that they captured northern patterns but modernized the cut. Their stylist guided me through every step.",
    image: "https://res.cloudinary.com/demo/image/upload/v1700123456/habesha-guest.jpg",
  },
];

export default function Testimonials() {
  return (
    <section className="bg-white px-4 py-16 font-body sm:px-6 lg:px-8" aria-labelledby="testimonials-heading">
      <div className="mx-auto max-w-7xl text-center">
        <p className="font-heading text-sm uppercase tracking-[0.35em] text-[#CFAE56]">Customer Stories</p>
        <h2 id="testimonials-heading" className="mt-4 font-heading text-3xl font-semibold text-[#1E2A55] sm:text-4xl">
          Loved by Habesha Trendsetters
        </h2>
        <p className="mt-3 text-base text-[#1E2A55]/70">
          Real reviews from our community. Swap this dummy data with your live review API any time.
        </p>
      </div>

      <div className="mx-auto mt-10 grid max-w-6xl gap-6 md:grid-cols-3">
        {testimonials.map((testimonial) => (
          <article
            key={testimonial.name}
            className="rounded-3xl border border-[#1E2A55]/10 bg-[#FAFAFA] p-6 text-left shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
          >
            <div className="flex items-center gap-4">
              <div className="relative h-14 w-14 overflow-hidden rounded-full">
                <Image
                  src={testimonial.image}
                  alt={testimonial.name}
                  fill
                  sizes="56px"
                  className="object-cover"
                />
              </div>
              <div>
                <p className="font-heading text-base font-semibold text-[#1E2A55]">{testimonial.name}</p>
                <p className="text-sm text-[#1E2A55]/60">{testimonial.location}</p>
              </div>
            </div>
            <p className="mt-4 text-sm text-[#1E2A55]/80">{testimonial.quote}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

