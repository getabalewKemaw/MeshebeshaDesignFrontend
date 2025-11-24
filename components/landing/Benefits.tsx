import { BadgeCheck, Scissors, Truck } from "lucide-react";

const benefits = [
  {
    title: "100% Authentic Handwoven",
    description: "Sourced directly from master weavers across Ethiopia with strict quality control.",
    icon: BadgeCheck,
  },
  {
    title: "Fast Nationwide Delivery",
    description: "Express fulfilment from Addis to every major city with live tracking.",
    icon: Truck,
  },
  {
    title: "Custom Tailoring",
    description: "Complimentary fitting consultations and made-to-measure experiences.",
    icon: Scissors,
  },
];

export default function Benefits() {
  return (
    <section className="bg-white px-4 py-16 font-body sm:px-6 lg:px-8" aria-labelledby="benefits-heading">
      <div className="mx-auto max-w-7xl space-y-6 text-center">
        <p className="font-heading text-sm uppercase tracking-[0.35em] text-[#CFAE56]">Why Choose Us</p>
        <h2 id="benefits-heading" className="font-heading text-3xl font-semibold text-[#1E2A55] sm:text-4xl">
          Crafted with Purpose
        </h2>
        <p className="mx-auto max-w-3xl text-base text-[#1E2A55]/70">
          Every garment is a love letter to Ethiopian heritage, finished with luxury house standards.
        </p>
      </div>

      <div className="mx-auto mt-10 grid max-w-6xl gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {benefits.map((benefit) => (
          <article
            key={benefit.title}
            className="rounded-3xl border border-[#1E2A55]/10 bg-[#FAFAFA] p-6 text-left shadow-sm transition hover:-translate-y-1 hover:border-[#CFAE56] hover:shadow-lg"
          >
            <div className="mb-4 inline-flex rounded-2xl bg-[#1E2A55] p-3 text-white shadow-lg shadow-[#1E2A55]/30">
              <benefit.icon className="h-6 w-6" strokeWidth={1.5} />
            </div>
            <h3 className="font-heading text-xl font-semibold text-[#1E2A55]">{benefit.title}</h3>
            <p className="mt-2 text-sm text-[#1E2A55]/70">{benefit.description}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

