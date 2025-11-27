import { useState } from "react";
import { useCartStore } from "@/stores/cart";
import { useCheckoutStore } from "@/stores/checkout";
import { createOrder } from "@/lib/api/orders";
import { createPayment } from "@/lib/api/payments";
import { validateContactInfo, validateShippingAddress } from "@/utils/validation/checkoutValidation";
import type { CreateOrderPayload, OrderSummary } from "@/types/order";
import type { ValidationError } from "@/utils/validation/checkoutValidation";

export function useCheckoutSubmission() {
    const { items, clearCart } = useCartStore((state) => ({
        items: state.items,
        clearCart: state.clearCart,
    }));

    const {
        contactInfo,
        shippingAddress,
        deliveryPreference,
        paymentNote,
        resetCheckout,
    } = useCheckoutStore((state) => ({
        contactInfo: state.contactInfo,
        shippingAddress: state.shippingAddress,
        deliveryPreference: state.deliveryPreference,
        paymentNote: state.paymentNote,
        resetCheckout: state.reset,
    }));

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submissionMessage, setSubmissionMessage] = useState<string | null>(null);
    const [orderSummary, setOrderSummary] = useState<OrderSummary | null>(null);
    const [validationErrors, setValidationErrors] = useState<ValidationError[]>([]);

    const handleErrorClear = (field: string) => {
        setValidationErrors((prev) => prev.filter((err) => err.field !== field));
    };

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        // Clear previous errors
        setValidationErrors([]);
        setSubmissionMessage(null);

        if (items.length === 0) {
            setSubmissionMessage("Your cart is empty. Add items before checking out.");
            return;
        }

        // Validate contact information
        const contactValidation = validateContactInfo(contactInfo);
        if (!contactValidation.isValid) {
            setValidationErrors(contactValidation.errors);
            setSubmissionMessage("Please fix the errors in the contact information section.");
            return;
        }

        // Validate shipping address
        const addressValidation = validateShippingAddress(shippingAddress);
        if (!addressValidation.isValid) {
            setValidationErrors(addressValidation.errors);
            setSubmissionMessage("Please fix the errors in the shipping address section.");
            return;
        }

        const orderItems = items
            .filter((item) => !!item.variantId)
            .map((item) => ({
                variantId: item.variantId as string,
                quantity: item.quantity,
                size: item.size || null,
            }));

        if (orderItems.length === 0) {
            setSubmissionMessage("Please select at least one product variant.");
            return;
        }

        const payload: CreateOrderPayload = {
            items: orderItems,
            contact: contactInfo,
            shippingAddress,
            deliveryPreference,
            paymentNote,
        };

        setIsSubmitting(true);
        setSubmissionMessage(null);
        setOrderSummary(null);

        try {
            // Create order first
            const orderResponse = await createOrder(payload);
            if (!orderResponse.success || !orderResponse.data) {
                throw new Error(orderResponse.error || "Failed to place order. Please try again.");
            }

            const order = orderResponse.data;
            setOrderSummary(order);

            // If payment note is provided, use fake payment (legacy)
            if (paymentNote) {
                setSubmissionMessage(
                    `Order ${order.orderNumber} placed. We'll confirm it shortly.`
                );
                clearCart();
                resetCheckout();
            } else {
                // Create Chapa payment session
                const paymentResponse = await createPayment(order.id);
                if (!paymentResponse.success || !paymentResponse.data) {
                    throw new Error(paymentResponse.error || "Failed to create payment session. Please try again.");
                }

                // Redirect to Chapa checkout with a small delay
                const checkoutUrl = paymentResponse.data.checkoutUrl;
                setSubmissionMessage("Redirecting to payment...");
                setTimeout(() => {
                    window.location.href = checkoutUrl;
                }, 2000);
            }
        } catch (error) {
            const message =
                error instanceof Error ? error.message : "Failed to place order. Please try again.";
            setSubmissionMessage(message);
        } finally {
            setIsSubmitting(false);
        }
    };

    return {
        isSubmitting,
        submissionMessage,
        orderSummary,
        validationErrors,
        handleSubmit,
        handleErrorClear,
    };
}
