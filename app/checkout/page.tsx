"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

import Navbar from "@/components/NavBar";
import ContactInfoSection from "@/components/checkout/ContactInfoSection";
import ShippingAddressSection from "@/components/checkout/ShippingAddressSection";
import DeliveryPreferenceSection from "@/components/checkout/DeliveryPreferenceSection";
import PaymentSection from "@/components/checkout/PaymentSection";
import CheckoutFormSection from "@/components/checkout/CheckoutFormSection";
import CheckoutOrderItem from "@/components/checkout/CheckoutOrderItem";
import EmptyState from "@/components/ui/EmptyState";
import { useCartStore } from "@/stores/cart";
import { useCheckoutStore } from "@/stores/checkout";
import { createOrder } from "@/lib/api/orders";
import { createPayment } from "@/lib/api/payments";
import { validateContactInfo, validateShippingAddress } from "@/utils/validation/checkoutValidation";
import type { CreateOrderPayload, OrderSummary } from "@/types/order";
import type { ValidationError } from "@/utils/validation/checkoutValidation";

const formatCurrency = (currency: string) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
  });

export default function CheckoutPage() {
  const {
    items,
    subtotal,
    itemCount,
    cartHydrated,
    clearCart,
  } = useCartStore((state) => ({
    items: state.items,
    subtotal: state.subtotal,
    itemCount: state.itemCount,
    cartHydrated: state.hasHydrated,
    clearCart: state.clearCart,
  }));

  const {
    contactInfo,
    shippingAddress,
    deliveryPreference,
    paymentNote,
    setContactInfo,
    setShippingAddress,
    setAddressMode,
    setDeliveryPreference,
    setPaymentNote,
    checkoutHydrated,
    resetCheckout,
  } = useCheckoutStore((state) => ({
    contactInfo: state.contactInfo,
    shippingAddress: state.shippingAddress,
    deliveryPreference: state.deliveryPreference,
    paymentNote: state.paymentNote,
    setContactInfo: state.setContactInfo,
    setShippingAddress: state.setShippingAddress,
    setAddressMode: state.setAddressMode,
    setDeliveryPreference: state.setDeliveryPreference,
    setPaymentNote: state.setPaymentNote,
    checkoutHydrated: state.hasHydrated,
    resetCheckout: state.reset,
  }));

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionMessage, setSubmissionMessage] = useState<string | null>(null);
  const [orderSummary, setOrderSummary] = useState<OrderSummary | null>(null);
  const [googleMethod, setGoogleMethod] = useState<"search" | "map">("search");
  const [validationErrors, setValidationErrors] = useState<ValidationError[]>([]);

  const currency = items[0]?.currency ?? "USD";
  const priceFormatter = useMemo(() => formatCurrency(currency), [currency]);
  const cartEmpty = cartHydrated && items.length === 0;

  const handleErrorClear = (field: string) => {
    setValidationErrors((prev) => prev.filter((err) => err.field !== field));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    // Clear previous errors
    setValidationErrors([]);
    setSubmissionMessage(null);

    if (cartEmpty) {
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

  return (
    <>
      <Navbar />
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-sm uppercase tracking-wider text-gray-400">Checkout</p>
            <h1 className="text-3xl font-semibold text-gray-900 mt-1">Delivery details</h1>
          </div>
          <Link href="/cart" className="text-sm text-purple-600 hover:text-purple-700 font-medium">
            Back to cart
          </Link>
        </div>

        {/* Loading/Empty States */}
        {!cartHydrated || !checkoutHydrated ? (
          <EmptyState title="Preparing checkout..." />
        ) : cartEmpty ? (
          <EmptyState
            title="Your cart is empty."
            actionLabel="Browse products"
            actionHref="/products"
          />
        ) : (
          <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Form Sections */}
            <div className="lg:col-span-2 space-y-6">
              {/* Contact Information */}
              <ContactInfoSection
                contactInfo={contactInfo}
                onUpdate={setContactInfo}
                validationErrors={validationErrors}
                onErrorClear={handleErrorClear}
              />

              {/* Shipping Address */}
              <ShippingAddressSection
                shippingAddress={shippingAddress}
                onUpdate={setShippingAddress}
                onModeChange={setAddressMode}
                validationErrors={validationErrors}
                onErrorClear={handleErrorClear}
                googleMethod={googleMethod}
                onGoogleMethodChange={setGoogleMethod}
              />

              {/* Delivery Preference */}
              <DeliveryPreferenceSection
                deliveryPreference={deliveryPreference}
                onUpdate={setDeliveryPreference}
              />

              {/* Payment */}
              <PaymentSection
                paymentNote={paymentNote}
                onUpdate={setPaymentNote}
              />
            </div>

            {/* Right Column - Order Summary */}
            <div className="lg:col-span-1">
              <CheckoutFormSection title="Order Summary">
                <div className="space-y-4">
                  {/* Order Items */}
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {items.map((item) => (
                      <CheckoutOrderItem
                        key={item.key}
                        item={item}
                        formatPrice={(price) => priceFormatter.format(price)}
                      />
                    ))}
                  </div>

                  {/* Divider */}
                  <div className="h-px bg-black" />

                  {/* Pricing */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Subtotal ({itemCount} items)</span>
                      <span className="font-medium">{priceFormatter.format(subtotal)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Shipping</span>
                      <span className="font-medium">Calculated at next step</span>
                    </div>
                  </div>

                  {/* Divider */}
                  <div className="h-px bg-black" />

                  {/* Total */}
                  <div className="flex justify-between text-lg font-semibold">
                    <span>Total</span>
                    <span>{priceFormatter.format(subtotal)}</span>
                  </div>

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
                    <div
                      className={`text-sm p-3 rounded ${orderSummary
                        ? "bg-green-50 text-green-800"
                        : "bg-red-50 text-red-800"
                        }`}
                    >
                      {submissionMessage}
                    </div>
                  )}

                  {/* Order Confirmation */}
                  {orderSummary && (
                    <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                      <p className="text-sm font-semibold text-purple-900">
                        Order #{orderSummary.orderNumber}
                      </p>
                      <p className="text-xs text-purple-700 mt-1">
                        Total: {priceFormatter.format(orderSummary.totalAmount)}
                      </p>
                    </div>
                  )}
                </div>
              </CheckoutFormSection>
            </div>
          </form>
        )}
      </div>
    </>
  );
}
