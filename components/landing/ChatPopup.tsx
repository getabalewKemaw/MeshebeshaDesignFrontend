"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/lib/hooks/useAuth";

export default function ChatPopup() {
    const { user } = useAuth();
    const [isVisible, setIsVisible] = useState(false);
    const [isAnimating, setIsAnimating] = useState(false);

    const handleChatOpen = () => {
        // Find the chat button and click it
        const chatButton = document.querySelector('button[aria-label="Open chat"]') as HTMLButtonElement;
        if (chatButton) {
            chatButton.click();
        }
        handleDismiss();
    };

    useEffect(() => {
        // Only show for authenticated users
        if (!user) {
            return;
        }

        // Show popup after a short delay every time for authenticated users
        const showTimer = setTimeout(() => {
            setIsVisible(true);
            setIsAnimating(true);
        }, 2000);

        return () => {
            clearTimeout(showTimer);
        };
    }, [user]);

    const handleDismiss = () => {
        setIsAnimating(false);
        setTimeout(() => {
            setIsVisible(false);
        }, 300);
    };

    // Don't render if user is not authenticated or popup is not visible
    if (!user || !isVisible) return null;

    return (
        <div
            className={`fixed bottom-6 right-6 z-50 transition-all duration-500 ${isAnimating
                ? "translate-y-0 opacity-100"
                : "translate-y-8 opacity-0"
                }`}
        >
            <div className="relative">
                {/* Popup Card */}
                <button
                    onClick={handleChatOpen}
                    className="block bg-gradient-to-br from-[#1E2A55] to-[#2A3A65] text-white rounded-2xl shadow-2xl p-5 pr-12 max-w-sm hover:shadow-3xl transition-shadow group text-left w-full"
                >
                    {/* Close Button */}
                    <div
                        onClick={(e) => {
                            e.stopPropagation();
                            handleDismiss();
                        }}
                        className="absolute top-3 right-3 text-white/70 hover:text-white transition-colors cursor-pointer"
                        role="button"
                        aria-label="Dismiss"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </div>

                    {/* Content */}
                    <div className="flex items-start gap-4">
                        {/* Animated Chat Icon */}
                        <div className="flex-shrink-0">
                            <div className="relative">
                                <div className="absolute inset-0 bg-[#CFAE56] rounded-full animate-ping opacity-75"></div>
                                <div className="relative bg-[#CFAE56] rounded-full p-3">
                                    <svg className="w-6 h-6 text-[#1E2A55]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                    </svg>
                                </div>
                            </div>
                        </div>

                        {/* Text */}
                        <div className="flex-1 pt-1">
                            <h3 className="font-bold text-lg mb-1 group-hover:text-[#CFAE56] transition-colors">
                                Need Help?
                            </h3>
                            <p className="text-sm text-white/90 leading-relaxed">
                                Have questions about a product or want to request us? Chat with us for personalized assistance!
                            </p>
                            <div className="flex items-center gap-2 mt-3 text-[#CFAE56] font-semibold text-sm">
                                <span>Start Chatting</span>
                                <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                </svg>
                            </div>
                        </div>
                    </div>
                </button>

                {/* Decorative Elements */}
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-[#CFAE56] rounded-full animate-bounce"></div>
                <div className="absolute -bottom-1 -left-1 w-2 h-2 bg-[#CFAE56]/50 rounded-full animate-pulse"></div>
            </div>
        </div>
    );
}
