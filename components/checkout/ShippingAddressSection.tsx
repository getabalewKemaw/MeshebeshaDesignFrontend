"use client";

import { getFieldError } from "@/utils/validation/checkoutValidation";
import type { ShippingAddress } from "@/types/cart";
import type { ValidationError } from "@/utils/validation/checkoutValidation";
import CheckoutFormSection from "./CheckoutFormSection";
import GooglePlacesAutocomplete from "@/components/GooglePlacesAutocomplete";
import GoogleMapPicker from "@/components/GoogleMapPicker";

interface ShippingAddressSectionProps {
    shippingAddress: ShippingAddress;
    onUpdate: (address: ShippingAddress) => void;
    onModeChange: (mode: "google" | "manual") => void;
    validationErrors: ValidationError[];
    onErrorClear: (field: string) => void;
    googleMethod: "search" | "map";
    onGoogleMethodChange: (method: "search" | "map") => void;
}

export default function ShippingAddressSection({
    shippingAddress,
    onUpdate,
    onModeChange,
    validationErrors,
    onErrorClear,
    googleMethod,
    onGoogleMethodChange,
}: ShippingAddressSectionProps) {
    const handleChange = (field: keyof ShippingAddress, value: string | number | null) => {
        onUpdate({ ...shippingAddress, [field]: value });
        onErrorClear(field);
    };

    const handleGoogleAddressChange = (addressData: Partial<ShippingAddress>) => {
        onUpdate({ ...shippingAddress, ...addressData });
        // Clear relevant errors
        onErrorClear("googlePlaceId");
        onErrorClear("googleLat");
        onErrorClear("googleLng");
        onErrorClear("formattedAddress");
    };

    return (
        <CheckoutFormSection
            title="Shipping Address"
            description="Where should we deliver your order?"
            headerAction={
                <div className="flex gap-2">
                    <button
                        type="button"
                        onClick={() => onModeChange("google")}
                        className={`px-3 py-1 text-sm rounded transition-colors ${shippingAddress.mode === "google"
                                ? "bg-purple-600 text-white"
                                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                            }`}
                    >
                        Google Maps
                    </button>
                    <button
                        type="button"
                        onClick={() => onModeChange("manual")}
                        className={`px-3 py-1 text-sm rounded transition-colors ${shippingAddress.mode === "manual"
                                ? "bg-purple-600 text-white"
                                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                            }`}
                    >
                        Manual Entry
                    </button>
                </div>
            }
        >
            {shippingAddress.mode === "google" ? (
                <div className="space-y-4">
                    {/* Google Method Toggle */}
                    <div className="flex gap-2">
                        <button
                            type="button"
                            onClick={() => onGoogleMethodChange("search")}
                            className={`px-3 py-1 text-sm rounded transition-colors ${googleMethod === "search"
                                    ? "bg-purple-100 text-purple-700"
                                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                }`}
                        >
                            Search
                        </button>
                        <button
                            type="button"
                            onClick={() => onGoogleMethodChange("map")}
                            className={`px-3 py-1 text-sm rounded transition-colors ${googleMethod === "map"
                                    ? "bg-purple-100 text-purple-700"
                                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                }`}
                        >
                            Map
                        </button>
                    </div>

                    {googleMethod === "search" ? (
                        <GooglePlacesAutocomplete
                            value={shippingAddress.formattedAddress || ""}
                            onChange={handleGoogleAddressChange}
                            placeholder="Search for your address..."
                        />
                    ) : (
                        <GoogleMapPicker
                            value={shippingAddress}
                            onChange={handleGoogleAddressChange}
                        />
                    )}

                    {getFieldError(validationErrors, "googlePlaceId") && (
                        <p className="form-error-text">
                            {getFieldError(validationErrors, "googlePlaceId")}
                        </p>
                    )}
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Street Address */}
                    <div className="md:col-span-2">
                        <label htmlFor="street" className="form-label">
                            Street Address *
                        </label>
                        <input
                            type="text"
                            id="street"
                            value={shippingAddress.line1 || ""}
                            onChange={(e) => handleChange("line1", e.target.value)}
                            className={`form-input-base ${getFieldError(validationErrors, "line1")
                                    ? "form-input-error"
                                    : ""
                                }`}
                            placeholder="123 Main St"
                            required
                        />
                        {getFieldError(validationErrors, "line1") && (
                            <p className="form-error-text">
                                {getFieldError(validationErrors, "line1")}
                            </p>
                        )}
                    </div>

                    {/* City */}
                    <div>
                        <label htmlFor="city" className="form-label">
                            City *
                        </label>
                        <input
                            type="text"
                            id="city"
                            value={shippingAddress.city || ""}
                            onChange={(e) => handleChange("city", e.target.value)}
                            className={`form-input-base ${getFieldError(validationErrors, "city")
                                    ? "form-input-error"
                                    : ""
                                }`}
                            placeholder="New York"
                            required
                        />
                        {getFieldError(validationErrors, "city") && (
                            <p className="form-error-text">
                                {getFieldError(validationErrors, "city")}
                            </p>
                        )}
                    </div>

                    {/* State/Province */}
                    <div>
                        <label htmlFor="state" className="form-label">
                            State/Province
                        </label>
                        <input
                            type="text"
                            id="state"
                            value={shippingAddress.state || ""}
                            onChange={(e) => handleChange("state", e.target.value)}
                            className="form-input-base"
                            placeholder="NY"
                        />
                    </div>

                    {/* Postal Code */}
                    <div>
                        <label htmlFor="postalCode" className="form-label">
                            Postal Code *
                        </label>
                        <input
                            type="text"
                            id="postalCode"
                            value={shippingAddress.postalCode || ""}
                            onChange={(e) => handleChange("postalCode", e.target.value)}
                            className={`form-input-base ${getFieldError(validationErrors, "postalCode")
                                    ? "form-input-error"
                                    : ""
                                }`}
                            placeholder="10001"
                            required
                        />
                        {getFieldError(validationErrors, "postalCode") && (
                            <p className="form-error-text">
                                {getFieldError(validationErrors, "postalCode")}
                            </p>
                        )}
                    </div>

                    {/* Country */}
                    <div>
                        <label htmlFor="country" className="form-label">
                            Country *
                        </label>
                        <input
                            type="text"
                            id="country"
                            value={shippingAddress.country || ""}
                            onChange={(e) => handleChange("country", e.target.value)}
                            className={`form-input-base ${getFieldError(validationErrors, "country")
                                    ? "form-input-error"
                                    : ""
                                }`}
                            placeholder="United States"
                            required
                        />
                        {getFieldError(validationErrors, "country") && (
                            <p className="form-error-text">
                                {getFieldError(validationErrors, "country")}
                            </p>
                        )}
                    </div>
                </div>
            )}
        </CheckoutFormSection>
    );
}
