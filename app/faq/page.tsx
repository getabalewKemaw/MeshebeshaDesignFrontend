'use client';

import React from 'react';
import NewNavBar from '@/components/newlanding/NewNavBar';
import FooterSection from '@/components/newlanding/FooterSection';
import Link from 'next/link';

export default function FAQPage() {
    const brandColor = '#310101';

    const faqs = [
        {
            question: "How much is this outfit?",
            answer: "The price of each outfit varies based on the design and customization requirements. You can view the price of your desired outfit directly on our website (https://mashabeshadesign.com). If you're interested in purchasing an item that isn't listed on the website, please share a picture with us on the Custom product page, and we'll promptly provide you with the price and delivery time."
        },
        {
            question: "How long will delivery take?",
            answer: "Delivery time depends on the product you choose and your location. Since most of the items we sell are custom made, depending on the design, processing time varies. But once the outfit is ready, delivery usually takes 3 to 5 days to Ethiopia."
        },
        {
            question: "How does shipping work?",
            answer: "We ship all our orders via DHL. Once your order has been shipped, you’ll get a notification email from DHL and you can expect delivery within a few days depending on your location. For local customers, you can pick up the order directly from our office."
        },
        {
            question: "How does sizing work?",
            answer: "We provide a standard measurement chart on our website along with instructions on how to use it. However, we suggest that you should send your own measurements following the measurement guide to ensure a perfect fit."
        },
        {
            question: "Where are you located?",
            answer: "We mainly operate from Ethiopia. We have offices in Bahir Dar, Ethiopia. Please check the footer of our website for addresses."
        },
        {
            question: "Do you have a physical shop?",
            answer: "We have a physical store located on Bahir Dar City and you’re welcome to visit our store."
        },
        {
            question: "Do you have pre-made outfits?",
            answer: "Yes, but we do not keep a lot of inventory. Most of our products are custom made."
        },
        {
            question: "Do you ship to (specific area) and how much is shipping?",
            answer: "We ship orders worldwide. Shipping is free if you are in the Ethiopia, If you are not in this region, our system will automatically calculate shipping fees at checkout."
        },
        {
            question: "Do you offer customization options for the outfits?",
            answer: "Customization is available, with pricing based on the complexity of the request. Contact us for customization details."
        },
        {
            question: "Do you make children’s outfits?",
            answer: "Yes, we make outfits for children of all age groups. Before ordering a children's outfit, you should contact us first to discuss measurement and pricing details."
        },
        {
            question: "How do returns work?",
            answer: "A sold item is eligible for return within 14days of delivery and we’ll assist you through the returning process. However, custom orders (change in design, color, or pattern) are not eligible for a return, since they are made based on your specific needs."
        },
        {
            question: "Can I get a discount?",
            answer: "We usually run discounts around holidays and wedding seasons. And If you’re a returning customer or buying multiple outfits at once, we can arrange a discount for you"
        }
    ];

    return (
        <div className="min-h-screen bg-gray-50 font-body">
            <NewNavBar />

            <div className="pt-32 pb-16 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
                <div className="bg-white shadow-xl rounded-2xl overflow-hidden">
                    {/* Header */}
                    <div
                        className="px-6 py-12 sm:px-12 text-center text-white"
                        style={{ backgroundColor: brandColor }}
                    >
                        <h1 className="text-3xl sm:text-4xl md:text-5xl font-heading font-bold mb-4 tracking-tight">
                            Frequently Asked Questions
                        </h1>
                        <p className="text-lg opacity-90 font-light">
                            Common questions about our products and services
                        </p>
                    </div>

                    {/* Content */}
                    <div className="px-6 py-10 sm:px-12 space-y-8 text-gray-700 leading-relaxed">
                        {faqs.map((faq, index) => (
                            <div key={index} className="border-b border-gray-100 last:border-0 pb-8 last:pb-0">
                                <h3 className="text-xl font-heading font-bold mb-3" style={{ color: brandColor }}>
                                    {faq.question}
                                </h3>
                                <p className="text-base leading-relaxed">
                                    {faq.answer}
                                </p>
                            </div>
                        ))}
                    </div>

                    <div className="bg-gray-50 px-6 py-8 text-center border-t border-gray-100">
                        <p className="mb-2">Still have questions?</p>
                        <Link
                            href="/contact"
                            className="inline-block px-6 py-2 rounded-full text-white font-bold transition-transform hover:scale-105"
                            style={{ backgroundColor: brandColor }}
                        >
                            Contact Us
                        </Link>
                    </div>
                </div>
            </div>

            <FooterSection />
        </div>
    );
}
