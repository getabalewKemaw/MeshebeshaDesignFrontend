import React from 'react';

interface StatCardProps {
    icon: React.ReactNode;
    label: string;
    value: string | number;
    trend?: {
        value: number;
        isPositive: boolean;
    };
    color?: 'brand' | 'blue' | 'green' | 'purple' | 'orange' | 'red' | 'yellow';
    loading?: boolean;
}

const colorClasses = {
    brand: {
        bg: 'bg-[#310101]/10',
        icon: 'text-[#310101]',
        border: 'border-[#310101]',
    },
    blue: {
        bg: 'bg-blue-50',
        icon: 'text-blue-600',
        border: 'border-blue-500',
    },
    green: {
        bg: 'bg-green-50',
        icon: 'text-green-600',
        border: 'border-green-500',
    },
    purple: {
        bg: 'bg-purple-50',
        icon: 'text-purple-600',
        border: 'border-purple-500',
    },
    orange: {
        bg: 'bg-orange-50',
        icon: 'text-orange-600',
        border: 'border-orange-500',
    },
    red: {
        bg: 'bg-red-50',
        icon: 'text-red-600',
        border: 'border-red-500',
    },
    yellow: {
        bg: 'bg-yellow-50',
        icon: 'text-yellow-600',
        border: 'border-yellow-500',
    },
};

const StatCard: React.FC<StatCardProps> = ({
    icon,
    label,
    value,
    trend,
    color = 'brand',
    loading = false,
}) => {
    const colors = colorClasses[color];

    if (loading) {
        return (
            <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-gray-200 animate-pulse">
                <div className="flex items-center justify-between">
                    <div className="flex-1">
                        <div className="h-4 bg-gray-200 rounded w-24 mb-3"></div>
                        <div className="h-8 bg-gray-200 rounded w-16"></div>
                    </div>
                    <div className={`w-12 h-12 ${colors.bg} rounded-lg`}></div>
                </div>
            </div>
        );
    }

    return (
        <div className={`bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow p-6 border-l-4 ${colors.border}`}>
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-gray-600 text-sm font-medium mb-2">{label}</p>
                    <p className="text-3xl font-bold text-gray-900">{value}</p>
                    {trend && (
                        <div className="flex items-center gap-1 mt-2">
                            {trend.isPositive ? (
                                <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                                </svg>
                            ) : (
                                <svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                                </svg>
                            )}
                            <span className={`text-sm font-medium ${trend.isPositive ? 'text-green-600' : 'text-red-600'}`}>
                                {Math.abs(trend.value)}%
                            </span>
                        </div>
                    )}
                </div>
                <div className={`w-14 h-14 ${colors.bg} rounded-xl flex items-center justify-center ${colors.icon}`}>
                    {icon}
                </div>
            </div>
        </div>
    );
};

export default StatCard;
