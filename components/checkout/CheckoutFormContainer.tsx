import ContactInfoSection from "./ContactInfoSection";
import ShippingAddressSection from "./ShippingAddressSection";
import DeliveryPreferenceSection from "./DeliveryPreferenceSection";
import PaymentSection from "./PaymentSection";
import type { ContactInformation, ShippingAddress, DeliveryPreference } from "@/types/cart";
import type { ValidationError } from "@/utils/validation/checkoutValidation";

interface CheckoutFormSectionsProps {
    contactInfo: ContactInformation;
    shippingAddress: ShippingAddress;
    deliveryPreference: DeliveryPreference;
    paymentNote: string;
    validationErrors: ValidationError[];
    googleMethod: "search" | "map";
    onContactUpdate: (info: ContactInformation) => void;
    onShippingUpdate: (address: ShippingAddress) => void;
    onModeChange: (mode: "manual" | "google") => void;
    onDeliveryUpdate: (preference: Partial<DeliveryPreference>) => void;
    onPaymentUpdate: (note: string) => void;
    onErrorClear: (field: string) => void;
    onGoogleMethodChange: (method: "search" | "map") => void;
}

export default function CheckoutFormContainer({
    contactInfo,
    shippingAddress,
    deliveryPreference,
    paymentNote,
    validationErrors,
    googleMethod,
    onContactUpdate,
    onShippingUpdate,
    onModeChange,
    onDeliveryUpdate,
    onPaymentUpdate,
    onErrorClear,
    onGoogleMethodChange,
}: CheckoutFormSectionsProps) {
    return (
        <div className="lg:col-span-2 space-y-6">
            {/* Contact Information */}
            <ContactInfoSection
                contactInfo={contactInfo}
                onUpdate={onContactUpdate}
                validationErrors={validationErrors}
                onErrorClear={onErrorClear}
            />

            {/* Shipping Address */}
            <ShippingAddressSection
                shippingAddress={shippingAddress}
                onUpdate={onShippingUpdate}
                onModeChange={onModeChange}
                validationErrors={validationErrors}
                onErrorClear={onErrorClear}
                googleMethod={googleMethod}
                onGoogleMethodChange={onGoogleMethodChange}
            />

            {/* Delivery Preference */}
            <DeliveryPreferenceSection
                deliveryPreference={deliveryPreference}
                onUpdate={onDeliveryUpdate}
            />

            {/* Payment */}
            <PaymentSection
                paymentNote={paymentNote}
                onUpdate={onPaymentUpdate}
            />
        </div>
    );
}
