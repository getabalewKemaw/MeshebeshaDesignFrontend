import { BadgeCheck, Scissors, Truck, Shield, Clock, Award } from "lucide-react";

const benefits = [
  {
    title: "100% Authentic Handwoven",
    description: "Sourced directly from master weavers across Ethiopia with strict quality control.",
    icon: BadgeCheck,
    color: "bg-blue-500",
  },
  {
    title: "Fast Nationwide Delivery",
    description: "Express fulfilment from Addis to every major city with live tracking.",
    icon: Truck,
    color: "bg-green-500",
  },
  {
    title: "Custom Tailoring",
    description: "Complimentary fitting consultations and made-to-measure experiences.",
    icon: Scissors,
    color: "bg-purple-500",
  },
  {
    title: "Secure Payments",
    description: "Multiple payment options with bank-level encryption for your safety.",
    icon: Shield,
    color: "bg-red-500",
  },
  {
    title: "24/7 Support",
    description: "Our customer service team is always ready to assist you anytime.",
    icon: Clock,
    color: "bg-orange-500",
  },
  {
    title: "Premium Quality",
    description: "Every piece undergoes rigorous quality checks before delivery.",
    icon: Award,
    color: "bg-yellow-500",
  },
];

export default function Benefits() {
  return (
    <section className="bg-white px-4 py-20 font-body sm:px-6 lg:px-8" aria-labelledby="benefits-heading">
      {/* Header */}
      <div className="mx-auto max-w-7xl space-y-4 text-center mb-16">
        <p className="font-heading text-sm uppercase tracking-[0.35em] text-[#CFAE56]">
          Why Choose Us
        </p>
        <h2 id="benefits-heading" className="font-heading text-4xl font-bold text-[#1E2A55] sm:text-5xl lg:text-6xl">
          Crafted with Purpose
        </h2>
        <p className="mx-auto max-w-3xl text-lg text-[#1E2A55]/70">
          Every garment is a love letter to Ethiopian heritage, finished with luxury house standards.
        </p>
      </div>

      {/* Benefits Grid */}
      <div className="mx-auto max-w-7xl grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {benefits.map((benefit, index) => (
          <article
            key={benefit.title}
            className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-gray-50 to-white border border-gray-200 p-8 hover:border-[#CFAE56] hover:shadow-xl transition-all"
          >
            {/* Icon */}
            <div className={`inline-flex rounded-2xl ${benefit.color} p-4 text-white shadow-lg mb-6`}>
              <benefit.icon className="h-8 w-8" strokeWidth={1.5} />
            </div>

            {/* Content */}
            <h3 className="font-heading text-xl font-bold text-[#1E2A55] mb-3">
              {benefit.title}
            </h3>
            <p className="text-base text-[#1E2A55]/70 leading-relaxed">
              {benefit.description}
            </p>

            {/* Decorative Element */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#CFAE56]/5 rounded-full -mr-16 -mt-16 group-hover:bg-[#CFAE56]/10 transition-colors" />
          </article>
        ))}
      </div>

      {/* Trust Badges */}
      <div className="mx-auto max-w-5xl mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 items-center justify-items-center opacity-60">
        <div className="text-center">
          <p className="text-3xl font-bold text-[#1E2A55]">5000+</p>
          <p className="text-sm text-gray-600">Orders Delivered</p>
        </div>
        <div className="text-center">
          <p className="text-3xl font-bold text-[#1E2A55]">4.9★</p>
          <p className="text-sm text-gray-600">Customer Rating</p>
        </div>
        <div className="text-center">
          <p className="text-3xl font-bold text-[#1E2A55]">100%</p>
          <p className="text-sm text-gray-600">Satisfaction</p>
        </div>
        <div className="text-center">
          <p className="text-3xl font-bold text-[#1E2A55]">24/7</p>
          <p className="text-sm text-gray-600">Support</p>
        </div>
      </div>
    </section>
  );
}
