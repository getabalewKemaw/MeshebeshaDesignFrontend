"use client";

import { getFieldError } from "@/utils/validation/checkoutValidation";
import type { ContactInformation } from "@/types/cart";
import type { ValidationError } from "@/utils/validation/checkoutValidation";
import CheckoutFormSection from "./CheckoutFormSection";

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
        onErrorClear(field);
    };

    return (
        <CheckoutFormSection
            title="Contact Information"
            description="We'll use this to keep you updated about your order"
        >
            <div className="grid grid-cols-1 gap-4">
                {/* Full Name */}
                <div>
                    <label htmlFor="fullName" className="form-label">
                        Full Name *
                    </label>
                    <input
                        type="text"
                        id="fullName"
                        value={contactInfo.fullName}
                        onChange={(e) => handleChange("fullName", e.target.value)}
                        className={`form-input-base ${getFieldError(validationErrors, "fullName")
                                ? "form-input-error"
                                : ""
                            }`}
                        placeholder="John Doe"
                        required
                    />
                    {getFieldError(validationErrors, "fullName") && (
                        <p className="form-error-text">
                            {getFieldError(validationErrors, "fullName")}
                        </p>
                    )}
                </div>

                {/* Email */}
                <div>
                    <label htmlFor="email" className="form-label">
                        Email Address *
                    </label>
                    <input
                        type="email"
                        id="email"
                        value={contactInfo.email}
                        onChange={(e) => handleChange("email", e.target.value)}
                        className={`form-input-base ${getFieldError(validationErrors, "email")
                                ? "form-input-error"
                                : ""
                            }`}
                        placeholder="john@example.com"
                        required
                    />
                    {getFieldError(validationErrors, "email") && (
                        <p className="form-error-text">
                            {getFieldError(validationErrors, "email")}
                        </p>
                    )}
                </div>

                {/* Phone */}
                <div>
                    <label htmlFor="phone" className="form-label">
                        Phone Number
                    </label>
                    <input
                        type="tel"
                        id="phone"
                        value={contactInfo.phone || ""}
                        onChange={(e) => handleChange("phone", e.target.value)}
                        className={`form-input-base ${getFieldError(validationErrors, "phone")
                                ? "form-input-error"
                                : ""
                            }`}
                        placeholder="+1 (555) 123-4567"
                    />
                    {getFieldError(validationErrors, "phone") && (
                        <p className="form-error-text">
                            {getFieldError(validationErrors, "phone")}
                        </p>
                    )}
                </div>
            </div>
        </CheckoutFormSection>
    );
}
