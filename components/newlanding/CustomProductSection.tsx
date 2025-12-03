'use client';

import { useState } from 'react';
import Image from 'next/image';

export default function CustomProductSection() {
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        description: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitMessage, setSubmitMessage] = useState('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setSubmitMessage('');

        try {
            // Simple validation
            if (!formData.name || !formData.phone || !formData.description) {
                setSubmitMessage('Please fill in all fields');
                setIsSubmitting(false);
                return;
            }

            // Here you would typically send to your API
            // For now, we'll just simulate a successful submission
            await new Promise(resolve => setTimeout(resolve, 1000));

            setSubmitMessage('Thank you! We will contact you soon.');
            setFormData({ name: '', phone: '', description: '' });
        } catch (error) {
            setSubmitMessage('Something went wrong. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <section className="relative w-full min-h-screen overflow-hidden py-20 flex items-center justify-center">
            {/* Background Image - includes decorative borders */}
            <div className="absolute inset-0 z-0">
                <Image
                    src="/ui/customprbg.png"
                    alt="Custom Products Background"
                    fill
                    className="object-cover"
                    quality={100}
                />
            </div>

            {/* Content Container */}
            <div className="relative z-10 w-full max-w-6xl mx-auto px-4">

                {/* Title - Aligned to the right */}
                <div className="text-right mb-16">
                    <h2
                        className="text-white text-4xl md:text-6xl font-bold uppercase tracking-wider border-b-4 border-white pb-2 inline-block"
                        style={{
                            fontFamily: 'ADLaM Display, cursive',
                            WebkitTextStroke: '1px #310101'
                        }}
                    >
                        CUSTOME PRODUCTS
                    </h2>
                </div>

                {/* Main Content: Image + Form */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

                    {/* Female Photo */}
                    <div className="flex justify-center">
                        <div className="relative w-full max-w-md aspect-[3/4] border-4 border-[#310101] rounded-2xl overflow-hidden shadow-2xl bg-white/10 backdrop-blur-sm">
                            <Image
                                src="/femalephoto.png"
                                alt="Custom Product Model"
                                fill
                                className="object-cover"
                            />
                        </div>
                    </div>

                    {/* Form Section */}
                    <div className="bg-white/95 backdrop-blur-sm rounded-3xl p-8 shadow-2xl">
                        <h3
                            className="text-[#310101] text-3xl md:text-4xl font-bold mb-8 text-center"
                            style={{ fontFamily: 'Fredoka One, cursive' }}
                        >
                            INFO
                        </h3>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Name Input */}
                            <div>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    placeholder="Name"
                                    className="w-full px-6 py-3 rounded-full border-2 border-[#310101] focus:outline-none focus:ring-2 focus:ring-[#310101] text-[#310101] font-semibold"
                                    style={{ fontFamily: 'Fredoka One, cursive' }}
                                />
                            </div>

                            {/* Phone Input */}
                            <div>
                                <input
                                    type="tel"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    placeholder="Phone"
                                    className="w-full px-6 py-3 rounded-full border-2 border-[#310101] focus:outline-none focus:ring-2 focus:ring-[#310101] text-[#310101] font-semibold"
                                    style={{ fontFamily: 'Fredoka One, cursive' }}
                                />
                            </div>

                            {/* Description Textarea */}
                            <div className="relative">
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    placeholder="Description"
                                    rows={6}
                                    className="w-full px-6 py-3 rounded-3xl border-2 border-[#310101] focus:outline-none focus:ring-2 focus:ring-[#310101] text-[#310101] font-semibold resize-none"
                                    style={{ fontFamily: 'Fredoka One, cursive' }}
                                />
                                {/* Microphone Icon */}
                                <button
                                    type="button"
                                    className="absolute bottom-4 left-4 text-[#310101] hover:text-[#4a0202] transition-colors"
                                    aria-label="Voice input"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"></path>
                                        <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
                                        <line x1="12" x2="12" y1="19" y2="22"></line>
                                    </svg>
                                </button>
                            </div>

                            {/* Submit Button */}
                            <div className="flex justify-end">
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="bg-[#310101] text-white px-8 py-3 rounded-full font-bold text-lg uppercase hover:bg-[#4a0202] transition-colors shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                                    style={{ fontFamily: 'Fredoka One, cursive' }}
                                >
                                    {isSubmitting ? 'Sending...' : 'Send'}
                                </button>
                            </div>

                            {/* Submit Message */}
                            {submitMessage && (
                                <div className={`text-center font-semibold ${submitMessage.includes('Thank') ? 'text-green-600' : 'text-red-600'}`}>
                                    {submitMessage}
                                </div>
                            )}
                        </form>
                    </div>

                </div>
            </div>
        </section>
    );
}
