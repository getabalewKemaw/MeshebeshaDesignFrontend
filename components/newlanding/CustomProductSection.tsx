'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';
import { useAuth } from '@/lib/hooks/useAuth';
import { submitCustomRequest, uploadCustomRequestMedia } from '@/lib/api/customRequests';
import { Upload, X, Loader2, Mic, FileVideo, FileImage } from 'lucide-react';

export default function CustomProductSection() {
    const { user } = useAuth();
    const [formData, setFormData] = useState({
        name: user?.name || '',
        phone: '',
        description: ''
    });
    const [mediaFiles, setMediaFiles] = useState<{ url: string; type: 'image' | 'video' }[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [submitMessage, setSubmitMessage] = useState({ type: '', text: '' });
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const fileType = file.type.startsWith('video/') ? 'video' : 'image';

            // Validate file type
            if (!file.type.startsWith('image/') && !file.type.startsWith('video/')) {
                setSubmitMessage({ type: 'error', text: 'Please upload only images or videos.' });
                return;
            }

            setIsUploading(true);
            setSubmitMessage({ type: '', text: '' });

            try {
                const response = await uploadCustomRequestMedia(file);
                if (response.success && response.data?.url) {
                    setMediaFiles(prev => [...prev, { url: response.data!.url, type: fileType }]);
                } else {
                    setSubmitMessage({ type: 'error', text: 'Failed to upload media. Please try again.' });
                }
            } catch (error) {
                console.error('Upload error:', error);
                setSubmitMessage({ type: 'error', text: 'An error occurred during upload.' });
            } finally {
                setIsUploading(false);
                // Reset file input
                if (fileInputRef.current) fileInputRef.current.value = '';
            }
        }
    };

    const removeMedia = (indexToRemove: number) => {
        setMediaFiles(prev => prev.filter((_, index) => index !== indexToRemove));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!user) {
            setSubmitMessage({ type: 'error', text: 'Please login to submit a custom request.' });
            return;
        }

        if (!formData.description) {
            setSubmitMessage({ type: 'error', text: 'Please provide a description for your request.' });
            return;
        }

        setIsSubmitting(true);
        setSubmitMessage({ type: '', text: '' });

        try {
            const response = await submitCustomRequest({
                name: formData.name,
                phone: formData.phone,
                description: formData.description,
                media: mediaFiles.map(f => f.url)
            });

            if (response.success) {
                setSubmitMessage({ type: 'success', text: 'Thank you! Your custom request has been submitted successfully. We will contact you soon.' });
                setFormData({ name: user.name || '', phone: '', description: '' });
                setMediaFiles([]);
            } else {
                setSubmitMessage({ type: 'error', text: response.error || 'Failed to submit request.' });
            }
        } catch (error) {
            console.error('Submission error:', error);
            setSubmitMessage({ type: 'error', text: 'Something went wrong. Please try again.' });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <section className="relative w-full min-h-screen overflow-hidden py-20 flex items-center justify-center">
            {/* Background Image - Desktop */}
            <div className="absolute inset-0 z-0 hidden md:block">
                <Image
                    src="/ui/customprbg.png"
                    alt="Custom Products Background"
                    fill
                    className="object-cover"
                    priority
                    quality={100}
                />
            </div>

            {/* Background Image - Mobile */}
            <div className="absolute inset-0 z-0 md:hidden">
                <Image
                    src="/mobilebgcusotomProducts.png"
                    alt="Custom Products Background Mobile"
                    fill
                    className="object-cover"
                    priority
                    quality={100}
                />
            </div>

            {/* Content Container */}
            <div className="relative z-10 w-full max-w-6xl mx-auto px-4">

                {/* Title */}
                <div className="text-right mb-16">
                    <h2
                        className="text-white text-4xl md:text-6xl font-bold uppercase tracking-wider border-b-4 border-white pb-2 inline-block"
                        style={{
                            fontFamily: 'ADLaM Display, cursive',
                            WebkitTextStroke: '1px #310101'
                        }}
                    >
                        CUSTOM PRODUCTS
                    </h2>
                </div>

                {/* Main Content: Image + Form */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">

                    {/* Female Photo */}
                    <div className="flex justify-center lg:sticky lg:top-24">
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
                                    className="w-full px-6 py-3 rounded-full border-2 border-[#310101] focus:outline-none focus:ring-2 focus:ring-[#310101] text-[#310101] font-semibold bg-white"
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
                                    className="w-full px-6 py-3 rounded-full border-2 border-[#310101] focus:outline-none focus:ring-2 focus:ring-[#310101] text-[#310101] font-semibold bg-white"
                                    style={{ fontFamily: 'Fredoka One, cursive' }}
                                />
                            </div>

                            {/* Description Textarea */}
                            <div className="relative">
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    placeholder="Describe your custom design..."
                                    rows={5}
                                    className="w-full px-6 py-3 rounded-3xl border-2 border-[#310101] focus:outline-none focus:ring-2 focus:ring-[#310101] text-[#310101] font-semibold resize-none bg-white"
                                    style={{ fontFamily: 'Fredoka One, cursive' }}
                                />
                                {/* Voice Input Placeholder - Functionality to be added */}
                                <button
                                    type="button"
                                    className="absolute bottom-4 left-4 text-[#310101] hover:text-[#4a0202] transition-colors p-2 rounded-full hover:bg-gray-100/50"
                                    aria-label="Voice input"
                                >
                                    <Mic size={20} />
                                </button>
                            </div>

                            {/* Media Upload Section */}
                            <div className="space-y-3">
                                <p className="text-[#310101] font-bold text-sm ml-2">Attach Images or Videos (Optional)</p>

                                <div className="flex flex-wrap gap-3">
                                    {/* Upload Button */}
                                    <button
                                        type="button"
                                        onClick={() => fileInputRef.current?.click()}
                                        disabled={isUploading}
                                        className="w-24 h-24 border-2 border-dashed border-[#310101] rounded-xl flex flex-col items-center justify-center text-[#310101] hover:bg-[#310101]/5 transition-colors disabled:opacity-50"
                                    >
                                        {isUploading ? (
                                            <Loader2 className="animate-spin" size={24} />
                                        ) : (
                                            <>
                                                <Upload size={24} />
                                                <span className="text-xs font-bold mt-1">Add</span>
                                            </>
                                        )}
                                    </button>
                                    <input
                                        type="file"
                                        ref={fileInputRef}
                                        onChange={handleFileSelect}
                                        accept="image/*,video/*"
                                        className="hidden"
                                    />

                                    {/* Media Previews */}
                                    {mediaFiles.map((file, index) => (
                                        <div key={index} className="relative w-24 h-24 border-2 border-[#310101] rounded-xl overflow-hidden bg-gray-100 group">
                                            {file.type === 'image' ? (
                                                <Image
                                                    src={file.url}
                                                    alt="Upload preview"
                                                    fill
                                                    className="object-cover"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center bg-black/10">
                                                    <FileVideo size={32} className="text-[#310101]" />
                                                </div>
                                            )}

                                            <button
                                                type="button"
                                                onClick={() => removeMedia(index)}
                                                className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                                            >
                                                <X size={14} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Submit Button */}
                            <div className="flex flex-col items-end gap-2">
                                <button
                                    type="submit"
                                    disabled={isSubmitting || isUploading}
                                    className="bg-[#310101] text-white px-8 py-3 rounded-full font-bold text-lg uppercase hover:bg-[#4a0202] transition-colors shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                                    style={{ fontFamily: 'Fredoka One, cursive' }}
                                >
                                    {isSubmitting ? (
                                        <>
                                            <Loader2 className="animate-spin" size={20} />
                                            Sending...
                                        </>
                                    ) : (
                                        'Send Request'
                                    )}
                                </button>
                            </div>

                            {/* Submit Message */}
                            {submitMessage.text && (
                                <div className={`text-center font-semibold p-3 rounded-lg ${submitMessage.type === 'success'
                                    ? 'bg-green-100 text-green-700'
                                    : 'bg-red-100 text-red-700'
                                    }`}>
                                    {submitMessage.text}
                                </div>
                            )}

                            {!user && (
                                <p className="text-center text-sm text-[#310101]/70 font-medium">
                                    You must be logged in to submit a request.
                                </p>
                            )}
                        </form>
                    </div>

                </div>
            </div>
        </section>
    );
}
