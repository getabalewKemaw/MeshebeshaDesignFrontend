"use client";

import type { DeliveryPreference } from "@/types/cart";
import CheckoutFormSection from "./CheckoutFormSection";

interface DeliveryPreferenceSectionProps {
    deliveryPreference: DeliveryPreference;
    onUpdate: (preference: DeliveryPreference) => void;
}

export default function DeliveryPreferenceSection({
    deliveryPreference,
    onUpdate,
}: DeliveryPreferenceSectionProps) {
    const handleChange = (field: keyof DeliveryPreference, value: string) => {
        onUpdate({ ...deliveryPreference, [field]: value });
    };

    return (
        <CheckoutFormSection
            title="Delivery Preference"
            description="Choose your preferred delivery option"
        >
            <div className="space-y-4">
                {/* Delivery Type */}
                <div className="grid grid-cols-2 gap-3">
                    <button
                        type="button"
                        onClick={() => handleChange("type", "standard")}
                        className={`p-4 border-2 rounded-lg transition-all ${deliveryPreference.type === "standard"
                                ? "border-purple-600 bg-purple-50"
                                : "border-gray-200 hover:border-gray-300"
                            }`}
                    >
                        <div className="text-left">
                            <p className="font-semibold text-gray-900">Standard</p>
                            <p className="text-sm text-gray-500">3-5 business days</p>
                        </div>
                    </button>
                    <button
                        type="button"
                        onClick={() => handleChange("type", "express")}
                        className={`p-4 border-2 rounded-lg transition-all ${deliveryPreference.type === "express"
                                ? "border-purple-600 bg-purple-50"
                                : "border-gray-200 hover:border-gray-300"
                            }`}
                    >
                        <div className="text-left">
                            <p className="font-semibold text-gray-900">Express</p>
                            <p className="text-sm text-gray-500">1-2 business days</p>
                        </div>
                    </button>
                </div>

                {/* Preferred Date */}
                <div>
                    <label htmlFor="preferredDate" className="form-label">
                        Preferred Delivery Date
                    </label>
                    <input
                        type="date"
                        id="preferredDate"
                        value={deliveryPreference.preferredDate || ""}
                        onChange={(e) => handleChange("preferredDate", e.target.value)}
                        className="form-input-base"
                        min={new Date().toISOString().split("T")[0]}
                    />
                </div>

                {/* Preferred Time */}
                <div>
                    <label htmlFor="preferredTime" className="form-label">
                        Preferred Time Window
                    </label>
                    <select
                        id="preferredTime"
                        value={deliveryPreference.preferredTime || ""}
                        onChange={(e) => handleChange("preferredTime", e.target.value)}
                        className="form-input-base"
                    >
                        <option value="">Any time</option>
                        <option value="morning">Morning (8AM - 12PM)</option>
                        <option value="afternoon">Afternoon (12PM - 5PM)</option>
                        <option value="evening">Evening (5PM - 8PM)</option>
                    </select>
                </div>

                {/* Delivery Instructions */}
                <div>
                    <label htmlFor="instructions" className="form-label">
                        Delivery Instructions
                    </label>
                    <textarea
                        id="instructions"
                        value={deliveryPreference.instructions || ""}
                        onChange={(e) => handleChange("instructions", e.target.value)}
                        className="form-input-base"
                        rows={3}
                        placeholder="e.g., Leave at front door, Ring doorbell twice"
                    />
                </div>
            </div>
        </CheckoutFormSection>
    );
}
