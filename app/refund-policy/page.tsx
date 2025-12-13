'use client';

import React from 'react';
import NewNavBar from '@/components/newlanding/NewNavBar';
import FooterSection from '@/components/newlanding/FooterSection';
import Link from 'next/link';

export default function RefundPolicyPage() {
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
                            Return & Refund Policy
                        </h1>
                        <p className="text-lg opacity-90 font-light">
                            Our commitment to your satisfaction
                        </p>
                    </div>

                    {/* Content */}
                    <div className="px-6 py-10 sm:px-12 space-y-10 text-gray-700 leading-relaxed">

                        <section>
                            <h2 className="text-xl font-heading font-bold mb-4 uppercase" style={{ color: brandColor }}>
                                Cancellation
                            </h2>
                            <p className="mb-4">
                                Customers may cancel their order within 24 hours of purchase for any reason, with no questions asked and no fees applied. After this period, cancellations must be requested by contacting us directly.
                            </p>
                            <p>
                                Please note that cancellations after 24 hours maybe subject to a flat <strong>5,499 ETB cancellation fee</strong>, and approval is at our discretion depending on the status of the order. Once an order has been processed or shipped, we may not be able to accommodate a cancellation.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-heading font-bold mb-4 uppercase" style={{ color: brandColor }}>
                                Return Period
                            </h2>
                            <p>
                                You have 30 days from the date of receipt to return your item(s) for a refund or exchange.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-heading font-bold mb-4 uppercase" style={{ color: brandColor }}>
                                Eligibility
                            </h2>
                            <ul className="list-disc pl-6 space-y-2">
                                <li>Items must be returned in their original condition, unworn, and with all original packaging and tags.</li>
                                <li>Items must not be custom orders (change in design, pattern, or color), as it is going to be specifically tailored to you wants and needs.</li>
                                <li>
                                    Buyer is responsible for all import taxes, duties, and tariffs imposed by the country of destination. If items are returned due to the buyer not fulfilling these responsibilities, Mashabesha Design is not going to issue a refund. Please read our shipping policy for more information: <Link href="/shipping" className="text-blue-600 hover:underline">Shipping Policy</Link>.
                                </li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-xl font-heading font-bold mb-4 uppercase" style={{ color: brandColor }}>
                                Return Shipping
                            </h2>
                            <p className="mb-4">
                                The buyer is responsible for return shipping costs regardless of the reason for the return. All returns must be shipped to our location in Ethiopia.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-heading font-bold mb-4 uppercase" style={{ color: brandColor }}>
                                Process
                            </h2>
                            <ol className="list-decimal pl-6 space-y-2">
                                <li>To initiate a return or exchange, please contact us at <a href="mailto:mashabeshadesign@gmail.com" className="text-blue-600 hover:underline">mashabeshadesign@gmail.com</a> to receive a Return Authorization Number and instructions.</li>
                                <li>Ship the item(s) back to us with the Return Authorization Number clearly marked on the package.</li>
                                <li>Once we receive and inspect the item(s), we will process your refund or exchange.</li>
                            </ol>
                        </section>

                        <section>
                            <h2 className="text-xl font-heading font-bold mb-4 uppercase" style={{ color: brandColor }}>
                                Refunds
                            </h2>
                            <ul className="list-disc pl-6 space-y-2">
                                <li>Refunds will be issued to the original payment method less initial shipping costs. We will send a receipt for the shipping cost to your email or WhatsApp number if available.</li>
                                <li>We will notify you once we’ve received and inspected your return, and let you know if the refund was approved or not. If approved, you’ll be automatically refunded on your original payment method within 10 business days. Please remember it can take some time for your bank or credit card company to process and post the refund too.</li>
                            </ul>
                            <p className="mt-4">
                                If more than 15 business days have passed since we’ve approved your return, please contact us at <a href="mailto:mashabeshadesign@gmail.com" className="text-blue-600 hover:underline">mashabeshadesign@gmail.com</a>
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-heading font-bold mb-4 uppercase" style={{ color: brandColor }}>
                                Exchanges
                            </h2>
                            <ul className="list-disc pl-6 space-y-2">
                                <li>Exchanges are accepted; please contact us to discuss availability and any additional terms.</li>
                                <li>Any additional shipping costs for exchanges are the responsibility of the buyer.</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-xl font-heading font-bold mb-4 uppercase" style={{ color: brandColor }}>
                                Non-Returnable Items
                            </h2>
                            <ul className="list-disc pl-6 space-y-2">
                                <li>Items not eligible for return include those that are damaged or altered by the customer.</li>
                                <li>Custom orders tailored to the needs of the customer are not returnable.</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-xl font-heading font-bold mb-4 uppercase" style={{ color: brandColor }}>
                                Need Help?
                            </h2>
                            <p>
                                If you have any questions or need assistance with your return or exchange, please reach out to us at <a href="mailto:mashabeshadesign@gmail.com" className="text-blue-600 hover:underline">mashabeshadesign@gmail.com</a>. We’re here to help!
                            </p>
                        </section>

                        <section className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                            <h2 className="text-xl font-heading font-bold mb-4 uppercase text-gray-800">
                                European Union 14 day cooling off period
                            </h2>
                            <p>
                                Notwithstanding the above, if the merchandise is being shipped into the European Union, you have the right to cancel or return your order within 14 days, for any reason and without a justification. As above, your item must be in the same condition that you received it, unworn or unused, with tags, and in its original packaging. You’ll also need the receipt or proof of purchase.
                            </p>
                        </section>

                        <div className="text-center pt-8 border-t border-gray-100">
                            <p className="font-bold text-lg" style={{ color: brandColor }}>
                                Thank you for choosing Mashabesha Design!
                            </p>
                        </div>

                    </div>
                </div>
            </div>

            <FooterSection />
        </div>
    );
}
