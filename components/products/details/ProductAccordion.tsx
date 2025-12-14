'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import type { ProductWithDetails } from '@/types/product';

interface AccordionItem {
    id: string;
    label: string;
    content: string | React.ReactNode;
    isLink?: boolean;
    linkUrl?: string;
}

interface ProductAccordionProps {
    product: ProductWithDetails;
}

export default function ProductAccordion({ product }: ProductAccordionProps) {
    const [openItems, setOpenItems] = useState<Set<string>>(new Set());

    const toggleItem = (id: string) => {
        const newOpen = new Set(openItems);
        if (newOpen.has(id)) {
            newOpen.delete(id);
        } else {
            newOpen.add(id);
        }
        setOpenItems(newOpen);
    };

    const items: AccordionItem[] = [
        {
            id: 'description',
            label: 'Description',
            content: product.description || 'No description available.',
        },
        {
            id: 'care',
            label: 'Care',
            content: product.description || 'Care instructions will be added soon.',
        },
        {
            id: 'faq',
            label: 'FAQ',
            content: 'Frequently Asked Questions',
            isLink: true,
            linkUrl: '/faq', // Update with actual FAQ page URL
        },
        {
            id: 'shipping',
            label: 'Shipping policy',
            content: 'Shipping Policy',
            isLink: true,
            linkUrl: '/shipping', // Update with actual shipping policy page URL
        },
        {
            id: 'return',
            label: 'Return policy',
            content: 'Return Policy',
            isLink: true,
            linkUrl: '/refund-policy', // Update with actual return policy page URL
        },
    ];

    return (
        <div className="space-y-0 border-t border-gray-200">
            {items.map((item) => (
                <div key={item.id} className="border-b border-gray-200">
                    {item.isLink ? (
                        <a
                            href={item.linkUrl}
                            className="flex items-center justify-between w-full px-4 py-4 text-left hover:bg-gray-50 transition-colors"
                        >
                            <span className="text-sm font-medium text-gray-900">{item.label}</span>
                            <ChevronDown className="w-5 h-5 text-gray-400 transform rotate-[-90deg]" />
                        </a>
                    ) : (
                        <>
                            <button
                                type="button"
                                onClick={() => toggleItem(item.id)}
                                className="flex items-center justify-between w-full px-4 py-4 text-left hover:bg-gray-50 transition-colors"
                            >
                                <span className="text-sm font-medium text-gray-900">{item.label}</span>
                                <ChevronDown
                                    className={`w-5 h-5 text-gray-400 transition-transform ${
                                        openItems.has(item.id) ? 'rotate-180' : ''
                                    }`}
                                />
                            </button>
                            {openItems.has(item.id) && (
                                <div className="px-4 pb-4 text-sm text-gray-600 whitespace-pre-line">
                                    {item.content}
                                </div>
                            )}
                        </>
                    )}
                </div>
            ))}
        </div>
    );
}

