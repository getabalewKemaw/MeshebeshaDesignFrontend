"use client";

import type { ContactInformation } from "@/types/cart";
import type { ValidationError } from "@/utils/validation/checkoutValidation";
import CheckoutFormSection from "./CheckoutFormSection";
import CheckoutFormField from "./CheckoutFormField";

interface ContactInfoSectionProps {
    contactInfo: ContactInformation;
    onUpdate: (info: ContactInformation) => void;
    validationErrors: ValidationError[];
    onErrorClear: (field: string) => void;
}

export default function ContactInfoSection({
    contactInfo,
    onUpdate,
    validationErrors,
    onErrorClear,
}: ContactInfoSectionProps) {
    const handleChange = (field: keyof ContactInformation, value: string) => {
        onUpdate({ ...contactInfo, [field]: value });
    };

    return (
        <CheckoutFormSection
            title="Contact Information"
            description="We'll use this to keep you updated about your order"
        >
            <div className="grid grid-cols-1 gap-4">
                <CheckoutFormField
                    label="Full Name"
                    id="fullName"
                    type="text"
                    value={contactInfo.fullName}
                    onChange={(value) => handleChange("fullName", value)}
                    placeholder="John Doe"
                    required
                    validationErrors={validationErrors}
                    onErrorClear={onErrorClear}
                    fieldType="required"
                />

                <CheckoutFormField
                    label="Email Address"
                    id="email"
                    type="email"
                    value={contactInfo.email}
                    onChange={(value) => handleChange("email", value)}
                    placeholder="john@example.com"
                    required
                    validationErrors={validationErrors}
                    onErrorClear={onErrorClear}
                    fieldType="email"
                />

                <CheckoutFormField
                    label="Phone Number"
                    id="phone"
                    type="tel"
                    value={contactInfo.phone || ""}
                    onChange={(value) => handleChange("phone", value)}
                    placeholder="+1 (555) 123-4567"
                    validationErrors={validationErrors}
                    onErrorClear={onErrorClear}
                    fieldType="phone"
                    helperText="Optional - We'll use this for delivery updates"
                />
            </div>
        </CheckoutFormSection>
    );
}
