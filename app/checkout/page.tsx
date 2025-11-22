"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

import Navbar from "@/components/NavBar";
import GooglePlacesAutocomplete from "@/components/GooglePlacesAutocomplete";
import GoogleMapPicker from "@/components/GoogleMapPicker";
import { useCartStore } from "@/stores/cart";
import { useCheckoutStore } from "@/stores/checkout";
import { createOrder } from "@/lib/api/orders";
import { createPayment } from "@/lib/api/payments";
import type { CreateOrderPayload, OrderSummary } from "@/types/order";

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
  const currency = items[0]?.currency ?? "USD";
  const priceFormatter = useMemo(() => formatCurrency(currency), [currency]);
  const cartEmpty = cartHydrated && items.length === 0;
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (cartEmpty) {
      setSubmissionMessage("Your cart is empty. Add items before checking out.");
      return;
    }
    if (!contactInfo.fullName || !contactInfo.email) {
      setSubmissionMessage("Please provide your full name and email.");
      return;
    }
    // Validate address based on mode
    if (shippingAddress.mode === "google") {
      if (!shippingAddress.formattedAddress || !shippingAddress.placeId) {
        setSubmissionMessage("Please select an address from Google Maps.");
        return;
      }
    } else if (shippingAddress.mode === "manual") {
      if (!shippingAddress.line1 || !shippingAddress.city || !shippingAddress.country) {
        setSubmissionMessage("Please complete your shipping address.");
        return;
      }
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

        // Redirect to Chapa checkout
        window.location.href = paymentResponse.data.checkoutUrl;
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
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-sm uppercase tracking-wider text-gray-400">Checkout</p>
            <h1 className="text-3xl font-semibold text-gray-900 mt-1">Delivery details</h1>
          </div>
          <Link href="/cart" className="text-sm text-purple-600 hover:text-purple-700 font-medium">
            Back to cart
          </Link>
        </div>

        {!cartHydrated || !checkoutHydrated ? (
          <div className="border border-dashed border-gray-200 rounded-xl p-10 text-center text-gray-500">
            Preparing checkout...
          </div>
        ) : cartEmpty ? (
          <div className="border border-dashed border-gray-200 rounded-xl p-10 text-center space-y-4">
            <p className="text-lg font-medium text-gray-700">Your cart is empty.</p>
            <Link
              href="/products"
              className="inline-flex items-center justify-center px-6 py-3 rounded-full bg-purple-600 text-white font-semibold hover:bg-purple-700"
            >
              Browse products
            </Link>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 lg:grid-cols-3 gap-6"
          >
            <div className="lg:col-span-2 space-y-6">
              <section className="border border-gray-200 rounded-2xl p-6 bg-white space-y-4">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">Contact information</h2>
                  <p className="text-sm text-gray-500">
                    We&apos;ll reach out about your delivery status.
                  </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <label className="flex flex-col gap-1 text-sm">
                    Full name
                    <input
                      type="text"
                      value={contactInfo.fullName}
                      onChange={(event) => setContactInfo({ fullName: event.target.value })}
                      className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                      required
                    />
                  </label>
                  <label className="flex flex-col gap-1 text-sm">
                    Email
                    <input
                      type="email"
                      value={contactInfo.email}
                      onChange={(event) => setContactInfo({ email: event.target.value })}
                      className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                      required
                    />
                  </label>
                  <label className="flex flex-col gap-1 text-sm md:col-span-2">
                    Phone number
                    <input
                      type="tel"
                      value={contactInfo.phone ?? ""}
                      onChange={(event) => setContactInfo({ phone: event.target.value })}
                      className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                      placeholder="+1 202-555-0183"
                    />
                  </label>
                </div>
              </section>

              <section className="border border-gray-200 rounded-2xl p-6 bg-white space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">Shipping address</h2>
                    <p className="text-sm text-gray-500">
                      Use Google Maps or enter the address manually.
                    </p>
                  </div>
                  <div className="flex items-center gap-2 text-xs font-medium">
                    <button
                      type="button"
                      onClick={() => setAddressMode("google")}
                      className={`px-3 py-1 rounded-full border ${
                        shippingAddress.mode === "google"
                          ? "border-purple-600 text-purple-600"
                          : "border-gray-200 text-gray-500"
                      }`}
                    >
                      Google Maps
                    </button>
                    <button
                      type="button"
                      onClick={() => setAddressMode("manual")}
                      className={`px-3 py-1 rounded-full border ${
                        shippingAddress.mode === "manual"
                          ? "border-purple-600 text-purple-600"
                          : "border-gray-200 text-gray-500"
                      }`}
                    >
                      Manual
                    </button>
                  </div>
                </div>

                {shippingAddress.mode === "google" ? (
                  <div className="space-y-4">
                    {/* Toggle between Search and Map */}
                    <div className="flex items-center gap-2 border-b border-gray-200 pb-3">
                      <button
                        type="button"
                        onClick={() => setGoogleMethod("search")}
                        className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                          googleMethod === "search"
                            ? "bg-purple-600 text-white"
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        }`}
                      >
                        🔍 Search Address
                      </button>
                      <button
                        type="button"
                        onClick={() => setGoogleMethod("map")}
                        className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                          googleMethod === "map"
                            ? "bg-purple-600 text-white"
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        }`}
                      >
                        🗺️ Select on Map
                      </button>
                    </div>

                    {/* Search Method */}
                    {googleMethod === "search" && (
                      <div className="space-y-3">
                        <label className="flex flex-col gap-1 text-sm">
                          <span className="font-medium text-gray-700">Type and select an address</span>
                          <GooglePlacesAutocomplete
                            value={shippingAddress.formattedAddress ?? ""}
                            onChange={(addressData) => {
                              setShippingAddress(addressData);
                            }}
                            placeholder="Start typing an address..."
                            className="w-full"
                          />
                        </label>
                      </div>
                    )}

                    {/* Map Picker Method */}
                    {googleMethod === "map" && (
                      <GoogleMapPicker
                        value={shippingAddress}
                        onChange={(addressData) => {
                          setShippingAddress(addressData);
                        }}
                      />
                    )}

                    {/* Selected Address Display */}
                    {shippingAddress.formattedAddress && (
                      <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                        <p className="text-xs font-medium text-green-800 mb-1">✓ Address selected</p>
                        <p className="text-xs text-green-700">{shippingAddress.formattedAddress}</p>
                        {shippingAddress.latitude && shippingAddress.longitude && (
                          <p className="text-xs text-green-600 mt-1">
                            📍 Location: {shippingAddress.latitude.toFixed(6)}, {shippingAddress.longitude.toFixed(6)}
                          </p>
                        )}
                      </div>
                    )}

                    {/* Address Details */}
                    {shippingAddress.line1 && (
                      <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg space-y-1">
                        <p className="text-xs font-medium text-blue-800">Address Details:</p>
                        <div className="text-xs text-blue-700 space-y-0.5">
                          {shippingAddress.line1 && <p>Line 1: {shippingAddress.line1}</p>}
                          {shippingAddress.line2 && <p>Line 2: {shippingAddress.line2}</p>}
                          {shippingAddress.city && <p>City: {shippingAddress.city}</p>}
                          {shippingAddress.state && <p>State: {shippingAddress.state}</p>}
                          {shippingAddress.postalCode && <p>Postal Code: {shippingAddress.postalCode}</p>}
                          {shippingAddress.country && <p>Country: {shippingAddress.country}</p>}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <label className="flex flex-col gap-1 text-sm md:col-span-2">
                      Address line 1
                      <input
                        type="text"
                        value={shippingAddress.line1}
                        onChange={(event) => setShippingAddress({ line1: event.target.value })}
                        className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                        required
                      />
                    </label>
                    <label className="flex flex-col gap-1 text-sm md:col-span-2">
                      Address line 2 (optional)
                      <input
                        type="text"
                        value={shippingAddress.line2 ?? ""}
                        onChange={(event) => setShippingAddress({ line2: event.target.value })}
                        className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                    </label>
                    <label className="flex flex-col gap-1 text-sm">
                      City
                      <input
                        type="text"
                        value={shippingAddress.city}
                        onChange={(event) => setShippingAddress({ city: event.target.value })}
                        className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                        required
                      />
                    </label>
                    <label className="flex flex-col gap-1 text-sm">
                      State / Region
                      <input
                        type="text"
                        value={shippingAddress.state ?? ""}
                        onChange={(event) => setShippingAddress({ state: event.target.value })}
                        className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                    </label>
                    <label className="flex flex-col gap-1 text-sm">
                      Postal code
                      <input
                        type="text"
                        value={shippingAddress.postalCode ?? ""}
                        onChange={(event) =>
                          setShippingAddress({ postalCode: event.target.value })
                        }
                        className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                    </label>
                    <label className="flex flex-col gap-1 text-sm">
                      Country
                      <input
                        type="text"
                        value={shippingAddress.country}
                        onChange={(event) => setShippingAddress({ country: event.target.value })}
                        className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                        required
                      />
                    </label>
                  </div>
                )}
              </section>

              <section className="border border-gray-200 rounded-2xl p-6 bg-white space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-gray-900">Delivery preference</h2>
                  <p className="text-sm text-gray-500">
                    Choose the speed and optional delivery window.
                  </p>
                </div>
                <div className="flex flex-wrap gap-3">
                  {["standard", "express"].map((option) => (
                    <button
                      key={option}
                      type="button"
                      onClick={() =>
                        setDeliveryPreference({
                          speed: option as "standard" | "express",
                        })
                      }
                      className={`flex-1 min-w-[120px] px-4 py-3 rounded-2xl border text-sm font-semibold ${
                        deliveryPreference.speed === option
                          ? "border-purple-600 text-purple-600"
                          : "border-gray-200 text-gray-600"
                      }`}
                    >
                      {option === "standard" ? "Standard (3-5 days)" : "Express (1-2 days)"}
                    </button>
                  ))}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <label className="flex flex-col gap-1 text-sm">
                    Preferred delivery date
                    <input
                      type="date"
                      value={deliveryPreference.preferredDate ?? ""}
                      onChange={(event) =>
                        setDeliveryPreference({ preferredDate: event.target.value })
                      }
                      className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </label>
                  <label className="flex flex-col gap-1 text-sm">
                    Preferred time window
                    <input
                      type="text"
                      value={deliveryPreference.preferredWindow ?? ""}
                      onChange={(event) =>
                        setDeliveryPreference({ preferredWindow: event.target.value })
                      }
                      className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                      placeholder="e.g., 2-4 PM"
                    />
                  </label>
                  <label className="flex flex-col gap-1 text-sm md:col-span-2">
                    Delivery instructions
                    <textarea
                      value={deliveryPreference.instructions ?? ""}
                      onChange={(event) =>
                        setDeliveryPreference({ instructions: event.target.value })
                      }
                      rows={3}
                      className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                      placeholder="Gate code, contact preferences, building notes..."
                    />
                  </label>
                </div>
              </section>

              <section className="border border-gray-200 rounded-2xl p-6 bg-white space-y-3">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">Payment</h2>
                  <p className="text-sm text-gray-500">
                    You will be redirected to Chapa secure payment page after placing your order.
                  </p>
                </div>
                <div className="text-xs text-gray-400">
                  <p>For testing purposes, you can leave a payment note to use the legacy fake payment method instead.</p>
                </div>
                <label className="flex flex-col gap-1 text-sm">
                  Payment note (optional - for testing only)
                  <input
                    type="text"
                    value={paymentNote}
                    onChange={(event) => setPaymentNote(event.target.value)}
                    placeholder="Leave empty to use Chapa payment, or enter note for fake payment"
                    className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </label>
              </section>

              {submissionMessage && (
                <div className="rounded-xl border border-purple-100 bg-purple-50 px-4 py-3 text-sm text-purple-800">
                  {submissionMessage}
                </div>
              )}
              {orderSummary && (
                <div className="rounded-xl border border-green-200 bg-green-50 px-4 py-4 text-sm text-green-900 space-y-1">
                  <p className="font-semibold">
                    Order {orderSummary.orderNumber} created successfully.
                  </p>
                  <p>
                    Total:{" "}
                    <span className="font-semibold">
                      {new Intl.NumberFormat("en-US", {
                        style: "currency",
                        currency: orderSummary.currency,
                      }).format(orderSummary.total)}
                    </span>
                  </p>
                  <p className="text-xs text-green-700">
                    We&apos;ll email you once the order is confirmed.
                  </p>
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full inline-flex items-center justify-center px-6 py-4 rounded-full bg-purple-600 text-white font-semibold hover:bg-purple-700 disabled:opacity-50"
              >
                {isSubmitting ? "Processing..." : `Place order (${priceFormatter.format(subtotal)})`}
              </button>
            </div>

            <aside className="border border-gray-200 rounded-2xl p-6 bg-white space-y-4 h-fit">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Order summary</h2>
                <p className="text-sm text-gray-500">{itemCount} items</p>
              </div>

              <div className="space-y-4">
                {items.map((item) => (
                  <div key={item.key} className="flex items-start gap-3">
                    <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-50">
                      {item.image ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={item.image}
                          alt={item.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-xs text-gray-400">
                          No image
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">{item.title}</p>
                      <p className="text-xs text-gray-500">
                        {item.quantity} × {priceFormatter.format(item.unitPrice)}
                      </p>
                      {(item.color || item.size) && (
                        <p className="text-xs text-gray-400">
                          {item.color}
                          {item.color && item.size ? " / " : ""}
                          {item.size}
                        </p>
                      )}
                    </div>
                    <p className="text-sm font-semibold text-gray-900">
                      {priceFormatter.format(item.unitPrice * item.quantity)}
                    </p>
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-100 pt-4 space-y-2 text-sm">
                <div className="flex items-center justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>{priceFormatter.format(subtotal)}</span>
                </div>
                <div className="flex items-center justify-between text-gray-600">
                  <span>Shipping</span>
                  <span>
                    {deliveryPreference.speed === "express" ? "Calculated at dispatch" : "Free"}
                  </span>
                </div>
                <div className="flex items-center justify-between text-base font-semibold text-gray-900">
                  <span>Total</span>
                  <span>{priceFormatter.format(subtotal)}</span>
                </div>
              </div>
            </aside>
          </form>
        )}
      </div>
    </>
  );
}

