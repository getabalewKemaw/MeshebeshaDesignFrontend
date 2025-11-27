"use client";

import { ShoppingBag, Truck, Package, Sparkles, MessageCircle, Link } from "lucide-react";

interface Step {
    number: string;
    title: string;
    description: string;
    icon: React.ComponentType<{ className?: string }>;
    isCustomRequest?: boolean;
}

const steps: Step[] = [
    {
        number: "01",
        title: "Browse & Select",
        description: "Explore our curated collections of authentic Habesha fashion. Filter by style, occasion, or fabric to find your perfect piece.",
        icon: ShoppingBag,
    },
    {
        number: "02",
        title: "Customize Your Order",
        description: "Choose your size, color, and add personalization. For custom tailoring, book a consultation with our design team.",
        icon: Sparkles,
    },
    {
        number: "03",
        title: "Secure Checkout",
        description: "Complete your purchase with our secure payment options. We accept multiple payment methods for your convenience.",
        icon: Package,
    },
    {
        number: "04",
        title: "Fast Delivery",
        description: "Receive your handcrafted garment within 5-7 business days. Track your order every step of the way.",
        icon: Truck,
    },
    {
        number: "05",
        title: "Can't Find It? Request It!",
        description: "Don't see what you're looking for?  first sign up or login to your accoutn  and can Chat with us to request custom products or special designs tailored to your needs.",
        icon: MessageCircle,
        isCustomRequest: true,
    },
];

const handleChatOpen = () => {
    // Find the chat button and click it
    const chatButton = document.querySelector('button[aria-label="Open chat"]') as HTMLButtonElement;
    if (chatButton) {
        chatButton.click();
    }
};

export default function HowItWorks() {
    return (
        <section
            className="bg-gradient-to-b from-[#FFF9F0] to-white px-4 py-20 font-body sm:px-6 lg:px-8"
            aria-labelledby="how-it-works-heading"
        >
            <div className="mx-auto max-w-7xl">
                {/* Section Header */}
                <div className="text-center mb-16">
                    <p className="font-heading text-sm uppercase tracking-[0.35em] text-[#CFAE56] mb-3">
                        Simple Process
                    </p>
                    <h2
                        id="how-it-works-heading"
                        className="font-heading text-4xl sm:text-5xl font-bold text-[#1E2A55] mb-4"
                    >
                        How It Works
                    </h2>
                    <p className="text-lg text-[#1E2A55]/70 max-w-2xl mx-auto">
                        From browsing to delivery, we have made it easy to bring authentic Habesha fashion to your doorstep.
                    </p>
                </div>

                {/* Steps Grid */}
                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-5">
                    {steps.map((step, index) => (
                        <div
                            key={step.number}
                            className="group relative"
                        >
                            {/* Connector Line (hidden on mobile, shown on desktop) */}
                            {index < steps.length - 1 && (
                                <div className="hidden lg:block absolute top-16 left-[60%] w-full h-0.5 bg-gradient-to-r from-[#CFAE56] to-transparent" />
                            )}

                            {/* Card */}
                            <div className={`relative bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300 border h-full ${step.isCustomRequest ? 'border-[#CFAE56] bg-gradient-to-br from-[#CFAE56]/5 to-white' : 'border-gray-100'
                                }`}>
                                {/* Step Number */}
                                <div className={`absolute -top-4 -left-4 w-12 h-12 rounded-full flex items-center justify-center shadow-lg ${step.isCustomRequest
                                        ? 'bg-gradient-to-br from-[#1E2A55] to-[#2A3A65]'
                                        : 'bg-gradient-to-br from-[#CFAE56] to-[#E5C976]'
                                    }`}>
                                    <span className="font-heading text-lg font-bold text-white">
                                        {step.number}
                                    </span>
                                </div>

                                {/* Icon */}
                                <div className={`inline-flex rounded-2xl p-4 mb-4 transition-colors ${step.isCustomRequest
                                        ? 'bg-[#1E2A55]/10 group-hover:bg-[#1E2A55]/20'
                                        : 'bg-[#CFAE56]/10 group-hover:bg-[#CFAE56]/20'
                                    }`}>
                                    <step.icon className={`h-8 w-8 ${step.isCustomRequest ? 'text-[#1E2A55]' : 'text-[#CFAE56]'}`} />
                                </div>

                                {/* Content */}
                                <h3 className="font-heading text-lg font-bold text-[#1E2A55] mb-2">
                                    {step.title}
                                </h3>
                                <p className="text-[#1E2A55]/70 leading-relaxed text-sm mb-4">
                                    {step.description}
                                </p>

                                {/* Custom Request Button */}
                                {step.isCustomRequest && (
                                    <button
                                        onClick={handleChatOpen}
                                        className="w-full mt-2 px-4 py-2 bg-[#1E2A55] text-white rounded-lg font-semibold hover:bg-[#2A3A65] transition-colors flex items-center justify-center gap-2"
                                    >
                                        <MessageCircle className="h-4 w-4" />
                                        Chat With Us
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>

                {/* CTA */}
                <div className="text-center mt-12">
                    <Link
                        href="/products"
                        className="inline-flex items-center justify-center rounded-full bg-[#1E2A55] px-8 py-4 font-heading text-lg font-bold text-white shadow-lg hover:bg-[#2A3A65] transition-colors"
                    >
                        Start Shopping
                        <svg className="ml-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                    </Link>
                </div>
            </div>
        </section>
    );
}
