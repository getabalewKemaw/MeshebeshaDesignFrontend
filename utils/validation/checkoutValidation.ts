import type { ContactInformation, ShippingAddress } from "@/types/cart";

export interface ValidationError {
    field: string;
    message: string;
}

export interface ValidationResult {
    isValid: boolean;
    errors: ValidationError[];
}

/**
 * Validates email format
 */
export const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

/**
 * Validates phone number format (basic validation)
 */
export const isValidPhone = (phone: string): boolean => {
    // Allow optional + at start, then digits, spaces, dashes, parentheses
    const phoneRegex = /^[\+]?[(]?[0-9]{1,4}[)]?[-\s\.]?[(]?[0-9]{1,4}[)]?[-\s\.]?[0-9]{1,9}$/;
    return phoneRegex.test(phone.replace(/\s/g, ""));
};

/**
 * Validates contact information
 */
export const validateContactInfo = (
    contactInfo: ContactInformation
): ValidationResult => {
    const errors: ValidationError[] = [];

    // Full name validation
    if (!contactInfo.fullName || contactInfo.fullName.trim().length === 0) {
        errors.push({
            field: "fullName",
            message: "Full name is required",
        });
    } else if (contactInfo.fullName.trim().length < 2) {
        errors.push({
            field: "fullName",
            message: "Full name must be at least 2 characters",
        });
    }

    // Email validation
    if (!contactInfo.email || contactInfo.email.trim().length === 0) {
        errors.push({
            field: "email",
            message: "Email is required",
        });
    } else if (!isValidEmail(contactInfo.email)) {
        errors.push({
            field: "email",
            message: "Please enter a valid email address",
        });
    }

    // Phone validation (optional field)
    if (contactInfo.phone && contactInfo.phone.trim().length > 0) {
        if (!isValidPhone(contactInfo.phone)) {
            errors.push({
                field: "phone",
                message: "Please enter a valid phone number",
            });
        }
    }

    return {
        isValid: errors.length === 0,
        errors,
    };
};

/**
 * Validates shipping address based on mode
 */
export const validateShippingAddress = (
    address: ShippingAddress
): ValidationResult => {
    const errors: ValidationError[] = [];

    if (address.mode === "google") {
        // Google Maps mode validation
        if (!address.formattedAddress || address.formattedAddress.trim().length === 0) {
            errors.push({
                field: "formattedAddress",
                message: "Please select an address from Google Maps",
            });
        }

        if (!address.placeId) {
            errors.push({
                field: "placeId",
                message: "Please select a valid address from the suggestions",
            });
        }
    } else if (address.mode === "manual") {
        // Manual mode validation
        if (!address.line1 || address.line1.trim().length === 0) {
            errors.push({
                field: "line1",
                message: "Address line 1 is required",
            });
        }

        if (!address.city || address.city.trim().length === 0) {
            errors.push({
                field: "city",
                message: "City is required",
            });
        }

        if (!address.country || address.country.trim().length === 0) {
            errors.push({
                field: "country",
                message: "Country is required",
            });
        }
    }

    return {
        isValid: errors.length === 0,
        errors,
    };
};

/**
 * Validates a single field and returns error message if invalid
 */
export const validateField = (
    fieldName: string,
    value: string,
    fieldType: "email" | "phone" | "text" | "required" = "text"
): string | null => {
    // Required field check
    if (fieldType === "required" || fieldType === "email") {
        if (!value || value.trim().length === 0) {
            return "This field is required";
        }
    }

    // Email specific validation
    if (fieldType === "email" && value && value.trim().length > 0) {
        if (!isValidEmail(value)) {
            return "Please enter a valid email address";
        }
    }

    // Phone specific validation
    if (fieldType === "phone" && value && value.trim().length > 0) {
        if (!isValidPhone(value)) {
            return "Please enter a valid phone number";
        }
    }

    // Text field minimum length
    if (fieldType === "text" && value && value.trim().length > 0) {
        if (value.trim().length < 2) {
            return "Must be at least 2 characters";
        }
    }

    return null;
};

/**
 * Get error message for a specific field from validation errors
 */
export const getFieldError = (
    errors: ValidationError[],
    fieldName: string
): string | null => {
    const error = errors.find((err) => err.field === fieldName);
    return error ? error.message : null;
};
