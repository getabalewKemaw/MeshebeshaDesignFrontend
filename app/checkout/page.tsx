"use client";

import { useMemo, useState } from "react";

import Navbar from "@/components/NavBar";
import CheckoutHeader from "@/components/checkout/CheckoutHeader";
import CheckoutFormContainer from "@/components/checkout/CheckoutFormContainer";
import CheckoutOrderSummarySection from "@/components/checkout/CheckoutOrderSummarySection";
import EmptyState from "@/components/ui/EmptyState";
import { useCartStore } from "@/stores/cart";
import { useCheckoutStore } from "@/stores/checkout";
import { useCheckoutSubmission } from "@/hooks/useCheckoutSubmission";

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
  } = useCartStore((state) => ({
    items: state.items,
    subtotal: state.subtotal,
    itemCount: state.itemCount,
    cartHydrated: state.hasHydrated,
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
  }));

  const [googleMethod, setGoogleMethod] = useState<"search" | "map">("search");

  const {
    isSubmitting,
    submissionMessage,
    orderSummary,
    validationErrors,
    handleSubmit,
    handleErrorClear,
  } = useCheckoutSubmission();

  const currency = items[0]?.currency ?? "USD";
  const priceFormatter = useMemo(() => formatCurrency(currency), [currency]);
  const cartEmpty = cartHydrated && items.length === 0;

  return (
    <>
      <Navbar />
      <div className="max-w-6xl mx-auto px-4 py-8">
        <CheckoutHeader />

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
            <CheckoutFormContainer
              contactInfo={contactInfo}
              shippingAddress={shippingAddress}
              deliveryPreference={deliveryPreference}
              paymentNote={paymentNote}
              validationErrors={validationErrors}
              googleMethod={googleMethod}
              onContactUpdate={setContactInfo}
              onShippingUpdate={setShippingAddress}
              onModeChange={setAddressMode}
              onDeliveryUpdate={setDeliveryPreference}
              onPaymentUpdate={setPaymentNote}
              onErrorClear={handleErrorClear}
              onGoogleMethodChange={setGoogleMethod}
            />

            {/* Right Column - Order Summary */}
            <CheckoutOrderSummarySection
              items={items}
              subtotal={subtotal}
              itemCount={itemCount}
              isSubmitting={isSubmitting}
              submissionMessage={submissionMessage}
              orderSummary={orderSummary}
              formatPrice={(price) => priceFormatter.format(price)}
            />
          </form>
        )}
      </div>
    </>
  );
}
