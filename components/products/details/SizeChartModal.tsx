'use client';

import { X } from 'lucide-react';

interface SizeChartModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function SizeChartModal({ isOpen, onClose }: SizeChartModalProps) {
    if (!isOpen) return null;

    const sizeData = [
        { size: 'XS', usSize: '0–2', shoulder: '14.6', bust: '31.5', waist: '26.4', sleeve: '24.4', hip: '35.4', shoulderToWaist: '16.5', waistToFloor: '38.6' },
        { size: 'S', usSize: '4–6', shoulder: '15.4', bust: '34.6', waist: '28.7', sleeve: '25.4', hip: '38.6', shoulderToWaist: '16.9', waistToFloor: '39.4' },
        { size: 'M', usSize: '8–10', shoulder: '16.1', bust: '37.8', waist: '31.5', sleeve: '26.4', hip: '41.7', shoulderToWaist: '17.3', waistToFloor: '40.2' },
        { size: 'L', usSize: '12–14', shoulder: '16.9', bust: '40.6', waist: '33.9', sleeve: '27.4', hip: '44.5', shoulderToWaist: '17.7', waistToFloor: '41.3' },
        { size: 'XL', usSize: '16–18', shoulder: '18.1', bust: '44.1', waist: '36.6', sleeve: '28.3', hip: '47.2', shoulderToWaist: '18.1', waistToFloor: '42.5' },
        { size: 'XXL', usSize: '20–22', shoulder: '18.9', bust: '48', waist: '40.2', sleeve: '28.3', hip: '50', shoulderToWaist: '18.9', waistToFloor: '43.3' },
    ];

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50" onClick={onClose}>
            <div
                className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
                    <h2 className="text-xl font-semibold text-gray-900">Size Chart</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>
                <div className="p-6">
                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse text-sm">
                            <thead>
                                <tr className="bg-gray-50">
                                    <th className="border border-gray-300 px-4 py-2 font-semibold text-left">SIZE</th>
                                    <th className="border border-gray-300 px-4 py-2 font-semibold text-left">XS</th>
                                    <th className="border border-gray-300 px-4 py-2 font-semibold text-left">S</th>
                                    <th className="border border-gray-300 px-4 py-2 font-semibold text-left">M</th>
                                    <th className="border border-gray-300 px-4 py-2 font-semibold text-left">L</th>
                                    <th className="border border-gray-300 px-4 py-2 font-semibold text-left">XL</th>
                                    <th className="border border-gray-300 px-4 py-2 font-semibold text-left">XXL</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td className="border border-gray-300 px-4 py-2 font-semibold">US SIZE</td>
                                    {sizeData.map((row) => (
                                        <td key={row.size} className="border border-gray-300 px-4 py-2">
                                            {row.usSize}
                                        </td>
                                    ))}
                                </tr>
                                <tr>
                                    <td className="border border-gray-300 px-4 py-2 font-semibold">SHOULDER</td>
                                    {sizeData.map((row) => (
                                        <td key={row.size} className="border border-gray-300 px-4 py-2">
                                            {row.shoulder}
                                        </td>
                                    ))}
                                </tr>
                                <tr>
                                    <td className="border border-gray-300 px-4 py-2 font-semibold">BUST</td>
                                    {sizeData.map((row) => (
                                        <td key={row.size} className="border border-gray-300 px-4 py-2">
                                            {row.bust}
                                        </td>
                                    ))}
                                </tr>
                                <tr>
                                    <td className="border border-gray-300 px-4 py-2 font-semibold">WAIST</td>
                                    {sizeData.map((row) => (
                                        <td key={row.size} className="border border-gray-300 px-4 py-2">
                                            {row.waist}
                                        </td>
                                    ))}
                                </tr>
                                <tr>
                                    <td className="border border-gray-300 px-4 py-2 font-semibold">SLEEVE</td>
                                    {sizeData.map((row) => (
                                        <td key={row.size} className="border border-gray-300 px-4 py-2">
                                            {row.sleeve}
                                        </td>
                                    ))}
                                </tr>
                                <tr>
                                    <td className="border border-gray-300 px-4 py-2 font-semibold">HIP</td>
                                    {sizeData.map((row) => (
                                        <td key={row.size} className="border border-gray-300 px-4 py-2">
                                            {row.hip}
                                        </td>
                                    ))}
                                </tr>
                                <tr>
                                    <td className="border border-gray-300 px-4 py-2 font-semibold">SHOULDER TO WAIST</td>
                                    {sizeData.map((row) => (
                                        <td key={row.size} className="border border-gray-300 px-4 py-2">
                                            {row.shoulderToWaist}
                                        </td>
                                    ))}
                                </tr>
                                <tr>
                                    <td className="border border-gray-300 px-4 py-2 font-semibold">WAIST TO FLOOR</td>
                                    {sizeData.map((row) => (
                                        <td key={row.size} className="border border-gray-300 px-4 py-2">
                                            {row.waistToFloor}
                                        </td>
                                    ))}
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <p className="mt-4 text-xs text-gray-500 text-center">
                        All measurements are in inches
                    </p>
                </div>
            </div>
        </div>
    );
}



