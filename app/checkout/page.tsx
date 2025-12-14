"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import NewNavBar from "@/components/newlanding/NewNavBar";
import FooterSection from "@/components/newlanding/FooterSection";
import CheckoutHeader from "@/components/checkout/CheckoutHeader";
import CheckoutFormContainer from "@/components/checkout/CheckoutFormContainer";
import CheckoutOrderList from "@/components/checkout/CheckoutOrderList";
import PricingSummary from "@/components/checkout/PricingSummary";
import EmptyState from "@/components/ui/EmptyState";
import { useCartStore } from "@/stores/cart";
import { useCheckoutStore } from "@/stores/checkout";
import type { ValidationError } from "@/utils/validation/checkoutValidation";

const formatCurrency = (currency: string) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
  });

export default function CheckoutPage() {
  const router = useRouter();
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

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationErrors] = useState<ValidationError[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [googleMethod, setGoogleMethod] = useState<"search" | "map">("search");
  const currency = items[0]?.currency ?? "USD";
  const priceFormatter = useMemo(() => formatCurrency(currency), [currency]);

  const cartEmpty = cartHydrated && items.length === 0;

  const handlePlaceOrder = () => {
    setErrorMessage(null);
    
    if (cartEmpty) {
      setErrorMessage("Your cart is empty. Please add items before checking out.");
      return;
    }
    
    if (!contactInfo.fullName || !contactInfo.email) {
      setErrorMessage("Please provide your full name and email address.");
      return;
    }
    
    if (
      shippingAddress.mode === "manual" &&
      (!shippingAddress.line1 || !shippingAddress.city || !shippingAddress.country)
    ) {
      setErrorMessage("Please complete your shipping address.");
      return;
    }

    if (shippingAddress.mode === "google" && !shippingAddress.formattedAddress) {
      setErrorMessage("Please provide a shipping address.");
      return;
    }

    // All validation passed, redirect to payment options
    setIsSubmitting(true);
    router.push("/checkout/payment-options");
  };

  const handleErrorClear = () => {
    // Error clearing handled by components
  };

  return (
    <>
      <NewNavBar />
      <div className="max-w-6xl mx-auto px-4 py-8 pt-32">
        <CheckoutHeader />

        {!cartHydrated || !checkoutHydrated ? (
          <EmptyState title="Preparing checkout..." />
        ) : cartEmpty ? (
          <EmptyState
            title="Your cart is empty."
            actionLabel="Browse products"
            actionHref="/products"
          />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
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

            <aside className="border border-gray-200 rounded-2xl p-6 bg-white space-y-4 h-fit">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Order summary</h2>
                <p className="text-sm text-gray-500">{itemCount} items</p>
              </div>

              <CheckoutOrderList items={items} formatPrice={(price) => priceFormatter.format(price)} />

              <PricingSummary
                subtotal={subtotal}
                itemCount={itemCount}
                formatPrice={(price) => priceFormatter.format(price)}
                deliverySpeed={deliveryPreference.speed}
              />

              {errorMessage && (
                <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {errorMessage}
                        </div>
                      )}

              <button
                type="button"
                onClick={handlePlaceOrder}
                disabled={isSubmitting}
                className="w-full inline-flex items-center justify-center px-6 py-4 rounded-full bg-[#310101] text-white font-semibold hover:bg-[#4a0202] disabled:opacity-50 transition-colors"
              >
                {isSubmitting ? "Processing..." : `Place order (${priceFormatter.format(subtotal)})`}
              </button>
            </aside>
              </div>
        )}
      </div>
      <FooterSection />
    </>
  );
}

