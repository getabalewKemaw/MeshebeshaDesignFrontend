"use client";

import CheckoutFormSection from "./CheckoutFormSection";
import CheckoutTextArea from "./CheckoutTextArea";

interface PaymentSectionProps {
    paymentNote: string;
    onUpdate: (note: string) => void;
}

export default function PaymentSection({
    paymentNote,
    onUpdate,
}: PaymentSectionProps) {
    return (
        <CheckoutFormSection
            title="Payment"
            description="You'll be redirected to Chapa for secure payment"
        >
            <div className="space-y-4">
                {/* Payment Info */}
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                    <p className="text-sm text-purple-900">
                        <strong>Secure Payment via Chapa</strong>
                    </p>
                    <p className="text-sm text-purple-700 mt-1">
                        After placing your order, you will be redirected to Chapa s secure payment gateway to complete your purchase.
                    </p>
                </div>

                {/* Payment Note */}
                <CheckoutTextArea
                    label="Payment Note (Optional - For Special Cases Only)"
                    id="paymentNote"
                    value={paymentNote}
                    onChange={onUpdate}
                    placeholder="Leave empty to pay via Chapa (recommended). Only add a note for special payment arrangements."
                    rows={2}
                    helperText="💡 Tip: Leave this field empty to proceed with Chapa payment gateway after placing your order."
                />
            </div>
        </CheckoutFormSection>
    );
}
