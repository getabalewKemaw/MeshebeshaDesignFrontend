"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

interface FAQItem {
    question: string;
    answer: string;
}

const faqs: FAQItem[] = [
    {
        question: "What makes your Habesha fashion authentic?",
        answer: "All our garments are handcrafted by skilled Ethiopian artisans using traditional weaving techniques passed down through generations. We source premium fabrics locally and ensure every piece meets our high standards for quality and authenticity.",
    },
    {
        question: "Do you offer custom tailoring services?",
        answer: "Yes! We offer bespoke tailoring services for special occasions. Book a consultation with our design team to discuss your vision, measurements, and fabric preferences. Custom orders typically take 3-4 weeks to complete.",
    },
    {
        question: "What is your return and exchange policy?",
        answer: "We accept returns within 14 days of delivery for unworn items with original tags. Custom-tailored pieces are final sale. Please contact our customer service team to initiate a return or exchange.",
    },
    {
        question: "How long does shipping take?",
        answer: "Standard delivery within Ethiopia takes 5-7 business days. Express shipping (2-3 days) is available in major cities. International shipping times vary by destination (10-21 business days).",
    },
    {
        question: "What payment methods do you accept?",
        answer: "We accept Chapa payments (mobile money, bank transfers, and cards), Telebirr, CBE Birr, and major credit/debit cards. All transactions are secured with industry-standard encryption.",
    },
    {
        question: "How do I care for my Habesha garments?",
        answer: "We recommend dry cleaning for most traditional pieces to preserve the fabric and embroidery. For everyday wear items, hand wash in cold water with mild detergent and air dry. Detailed care instructions are included with each purchase.",
    },
    {
        question: "Can I track my order?",
        answer: "Absolutely! Once your order ships, you'll receive a tracking number via email and SMS. You can also track your order status in real-time through your account dashboard.",
    },
    {
        question: "Do you ship internationally?",
        answer: "Yes, we ship worldwide! International shipping costs and delivery times vary by destination. Customs duties and taxes may apply depending on your country's regulations.",
    },
];

export default function FAQ() {
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    const toggleFAQ = (index: number) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <section
            className="bg-white px-4 py-20 font-body sm:px-6 lg:px-8"
            aria-labelledby="faq-heading"
        >
            <div className="mx-auto max-w-7xl">
                {/* Section Header */}
                <div className="text-center mb-16">
                    <p className="font-heading text-sm uppercase tracking-[0.35em] text-[#CFAE56] mb-3">
                        Got Questions?
                    </p>
                    <h2
                        id="faq-heading"
                        className="font-heading text-4xl sm:text-5xl font-bold text-[#1E2A55] mb-4"
                    >
                        Frequently Asked Questions
                    </h2>
                    <p className="text-lg text-[#1E2A55]/70 max-w-2xl mx-auto">
                        Find answers to common questions about our products, services, and policies.
                    </p>
                </div>

                {/* FAQ Accordion */}
                <div className="space-y-4 max-w-4xl mx-auto">
                    {faqs.map((faq, index) => (
                        <div
                            key={index}
                            className="bg-gradient-to-br from-gray-50 to-white rounded-2xl border border-gray-200 overflow-hidden transition-all duration-300 hover:shadow-lg"
                        >
                            <button
                                onClick={() => toggleFAQ(index)}
                                className="w-full flex items-center justify-between p-6 text-left transition-colors hover:bg-gray-50/50"
                                aria-expanded={openIndex === index}
                                aria-controls={`faq-answer-${index}`}
                            >
                                <span className="font-heading text-lg font-bold text-[#1E2A55] pr-8">
                                    {faq.question}
                                </span>
                                <ChevronDown
                                    className={`h-6 w-6 text-[#CFAE56] flex-shrink-0 transition-transform duration-300 ${openIndex === index ? "rotate-180" : ""
                                        }`}
                                    strokeWidth={2}
                                />
                            </button>

                            <div
                                id={`faq-answer-${index}`}
                                className={`overflow-hidden transition-all duration-300 ${openIndex === index ? "max-h-96" : "max-h-0"
                                    }`}
                            >
                                <div className="px-6 pb-6 text-[#1E2A55]/70 leading-relaxed">
                                    {faq.answer}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Contact CTA */}
                <div className="mt-12 text-center p-8 bg-gradient-to-br from-[#1E2A55] to-[#0A1128] rounded-2xl max-w-4xl mx-auto">
                    <h3 className="font-heading text-2xl font-bold text-white mb-3">
                        Still have questions?
                    </h3>
                    <p className="text-white/80 mb-6">
                        Our customer service team is here to help you.
                    </p>
                    <a
                        href="/contact"
                        className="inline-flex items-center justify-center rounded-full bg-[#CFAE56] px-8 py-4 font-heading text-lg font-bold text-[#1E2A55] shadow-lg hover:bg-[#E5C976] transition-colors"
                    >
                        Contact Us
                        <svg className="ml-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                    </a>
                </div>
            </div>
        </section>
    );
}
