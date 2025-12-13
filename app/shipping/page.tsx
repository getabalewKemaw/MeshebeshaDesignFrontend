'use client';

import React from 'react';
import NewNavBar from '@/components/newlanding/NewNavBar';
import FooterSection from '@/components/newlanding/FooterSection';
import Link from 'next/link';

export default function ShippingPolicyPage() {
    const brandColor = '#310101';

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
                            Shipping Policy
                        </h1>
                        <p className="text-lg opacity-90 font-light">
                            Delivery information and shipping details
                        </p>
                    </div>

                    {/* Content */}
                    <div className="px-6 py-10 sm:px-12 space-y-10 text-gray-700 leading-relaxed">

                        <section>
                            <h2 className="text-xl font-heading font-bold mb-4 uppercase" style={{ color: brandColor }}>
                                Worldwide Shipping
                            </h2>
                            <p className="mb-4">
                                We ship orders worldwide. Whether you are in Ethiopia or abroad, we can deliver our custom designs to your doorstep.
                            </p>
                            <p>
                                <strong>Shipping Cost:</strong> Shipping is free if you are in Ethiopia. If you are not in this region, our system will automatically calculate shipping fees at checkout based on your delivery address.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-heading font-bold mb-4 uppercase" style={{ color: brandColor }}>
                                Delivery Methods
                            </h2>
                            <p className="mb-4">
                                We ship all our international orders via <strong>DHL</strong>. This ensures fast and reliable delivery to your location.
                            </p>
                            <p className="mb-4">
                                Once your order has been shipped, you’ll get a notification email from DHL with tracking details so you can monitor your shipment. You can expect delivery within a few days after shipment, depending on your location.
                            </p>
                            <p>
                                For local customers in Ethiopia, specifically in Bahir Dar, you have the option to pick up the order directly from our office.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-heading font-bold mb-4 uppercase" style={{ color: brandColor }}>
                                Processing and Delivery Time
                            </h2>
                            <p className="mb-4">
                                Delivery time depends on the product you choose and your location.
                            </p>
                            <p className="mb-4">
                                <strong>Processing Time:</strong> Since most of the items we sell are custom made, processing time varies depending on the design and complexity of your outfit. We recommend contacting us if you have a specific deadline.
                            </p>
                            <p>
                                <strong>Transit Time:</strong> Once the outfit is ready and handed over to the courier, delivery usually takes 3 to 5 days to Ethiopia and major international destinations, though remote areas may take longer.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-heading font-bold mb-4 uppercase" style={{ color: brandColor }}>
                                Note on Customs
                            </h2>
                            <p>
                                Please note that for international orders, the buyer is responsible for all import taxes, duties, and tariffs imposed by the country of destination. These are not included in the shipping fee paid at checkout.
                            </p>
                        </section>

                        <div className="text-center pt-8 border-t border-gray-100">
                            <p className="mb-4">
                                For more answers to common questions, please check our FAQ.
                            </p>
                            <Link
                                href="/faq"
                                className="inline-block px-6 py-2 border-2 rounded-full font-bold transition-colors hover:bg-gray-100"
                                style={{ borderColor: brandColor, color: brandColor }}
                            >
                                View FAQ
                            </Link>
                        </div>

                    </div>
                </div>
            </div>

            <FooterSection />
        </div>
    );
}
