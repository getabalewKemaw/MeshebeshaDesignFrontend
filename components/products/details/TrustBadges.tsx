'use client';

import { Truck, RotateCcw, Shield, Zap } from 'lucide-react';

export default function TrustBadges() {
    const badges = [
        {
            icon: Truck,
            text: 'FREE SHIPPING',
        },
        {
            icon: RotateCcw,
            text: '20 days MONEY BACK GUARANTEE',
        },
        {
            icon: Shield,
            text: '100% SECURE PAYMENT',
        },
        {
            icon: Zap,
            text: 'FAST DELIVERY',
        },
    ];

    return (
        <div className="flex flex-wrap items-center justify-center gap-4 md:gap-6 py-6">
            {badges.map((badge, index) => {
                const Icon = badge.icon;
                return (
                    <div
                        key={index}
                        className="flex flex-col items-center justify-center w-20 h-20 md:w-24 md:h-24 rounded-full border-2 border-[#310101] bg-white text-[#310101] shadow-sm hover:shadow-md transition-shadow"
                    >
                        <Icon className="w-6 h-6 md:w-7 md:h-7 mb-1" />
                        <span className="text-[8px] md:text-[10px] font-semibold text-center leading-tight px-1">
                            {badge.text}
                        </span>
                    </div>
                );
            })}
        </div>
    );
}

