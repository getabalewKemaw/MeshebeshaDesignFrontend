"use client";

import type { DeliveryPreference } from "@/types/cart";
import CheckoutFormSection from "./CheckoutFormSection";
import CheckoutFormField from "./CheckoutFormField";
import CheckoutTextArea from "./CheckoutTextArea";

interface DeliveryPreferenceSectionProps {
    deliveryPreference: DeliveryPreference;
    onUpdate: (preference: Partial<DeliveryPreference>) => void;
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
                        onClick={() => handleChange("speed", "standard")}
                        className={`p-4 border-2 rounded-lg transition-all ${deliveryPreference.speed === "standard"
                            ? "border-[#310101] bg-[#310101]/5"
                            : "border-gray-200 hover:border-[#310101]/20"
                            }`}
                    >
                        <div className="text-left">
                            <p className="font-semibold text-gray-900">Standard</p>
                            <p className="text-sm text-gray-500">3-5 business days</p>
                        </div>
                    </button>
                    <button
                        type="button"
                        onClick={() => handleChange("speed", "express")}
                        className={`p-4 border-2 rounded-lg transition-all ${deliveryPreference.speed === "express"
                            ? "border-[#310101] bg-[#310101]/5"
                            : "border-gray-200 hover:border-[#310101]/20"
                            }`}
                    >
                        <div className="text-left">
                            <p className="font-semibold text-gray-900">Express</p>
                            <p className="text-sm text-gray-500">1-2 business days</p>
                        </div>
                    </button>
                </div>

                {/* Preferred Date */}
                <CheckoutFormField
                    label="Preferred Delivery Date"
                    id="preferredDate"
                    type="date"
                    value={deliveryPreference.preferredDate || ""}
                    onChange={(value) => handleChange("preferredDate", value)}
                    min={new Date().toISOString().split("T")[0]}
                    helperText="Optional - Select your preferred delivery date"
                />

                {/* Preferred Time */}
                <div>
                    <label htmlFor="preferredWindow" className="form-label">
                        Preferred Time Window
                    </label>
                    <select
                        id="preferredWindow"
                        value={deliveryPreference.preferredWindow || ""}
                        onChange={(e) => handleChange("preferredWindow", e.target.value)}
                        className="form-input-base"
                    >
                        <option value="">Any time</option>
                        <option value="morning">Morning (8AM - 12PM)</option>
                        <option value="afternoon">Afternoon (12PM - 5PM)</option>
                        <option value="evening">Evening (5PM - 8PM)</option>
                    </select>
                </div>

                {/* Delivery Instructions */}
                <CheckoutTextArea
                    label="Delivery Instructions"
                    id="instructions"
                    value={deliveryPreference.instructions || ""}
                    onChange={(value) => handleChange("instructions", value)}
                    placeholder="e.g., Leave at front door, Ring doorbell twice"
                    rows={3}
                    helperText="Optional - Any special instructions for the delivery person"
                />
            </div>
        </CheckoutFormSection>
    );
}
