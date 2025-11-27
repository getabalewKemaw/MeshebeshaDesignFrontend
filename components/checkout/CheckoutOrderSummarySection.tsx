import CheckoutFormSection from "./CheckoutFormSection";
import CheckoutOrderList from "./CheckoutOrderList";
import PricingSummary from "./PricingSummary";
import SubmissionMessage from "./SubmissionMessage";
import OrderConfirmation from "./OrderConfirmation";
import type { CartItem } from "@/types/cart";
import type { OrderSummary } from "@/types/order";

interface CheckoutOrderSummarySectionProps {
    items: CartItem[];
    subtotal: number;
    itemCount: number;
    isSubmitting: boolean;
    submissionMessage: string | null;
    orderSummary: OrderSummary | null;
    formatPrice: (price: number) => string;
}

export default function CheckoutOrderSummarySection({
    items,
    subtotal,
    itemCount,
    isSubmitting,
    submissionMessage,
    orderSummary,
    formatPrice,
}: CheckoutOrderSummarySectionProps) {
    return (
        <div className="lg:col-span-1">
            <CheckoutFormSection title="Order Summary">
                <div className="space-y-4">
                    {/* Order Items */}
                    <CheckoutOrderList items={items} formatPrice={formatPrice} />

                    {/* Pricing Summary */}
                    <PricingSummary
                        subtotal={subtotal}
                        itemCount={itemCount}
                        formatPrice={formatPrice}
                    />

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="form-button-primary w-full"
                    >
                        {isSubmitting ? "Processing..." : "Place Order"}
                    </button>

                    {/* Submission Message */}
                    {submissionMessage && (
                        <SubmissionMessage
                            message={submissionMessage}
                            isSuccess={!!orderSummary}
                        />
                    )}

                    {/* Order Confirmation */}
                    {orderSummary && (
                        <OrderConfirmation
                            orderSummary={orderSummary}
                            formatPrice={formatPrice}
                        />
                    )}
                </div>
            </CheckoutFormSection>
        </div>
    );
}
