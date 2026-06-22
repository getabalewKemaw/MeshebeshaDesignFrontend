"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/stores/cart";
import { useCheckoutStore } from "@/stores/checkout";
import { useAuth } from "@/lib/hooks/useAuth";
import { createOrder } from "@/lib/api/orders";
import NewNavBar from "@/components/newlanding/NewNavBar";
import FooterSection from "@/components/newlanding/FooterSection";
import ContactInfoSection from "@/components/checkout/ContactInfoSection";
import ShippingAddressSection from "@/components/checkout/ShippingAddressSection";
import DeliveryPreferenceSection from "@/components/checkout/DeliveryPreferenceSection";
import type { CreateOrderPayload } from "@/types/order";
import type { ValidationError } from "@/utils/validation/checkoutValidation";

type PaymentMethod = "telebirr" | "direct-bank" | "credit-card" | "chapa";

export default function PaymentOptionsPage() {
  const router = useRouter();
  const { items, subtotal, itemCount, clearCart } = useCartStore((state) => ({
    items: state.items,
    subtotal: state.subtotal,
    itemCount: state.itemCount,
    clearCart: state.clearCart,
  }));

  const {
    contactInfo,
    shippingAddress,
    deliveryPreference,
    setContactInfo,
    setShippingAddress,
    setAddressMode,
    setDeliveryPreference,
    resetCheckout,
  } = useCheckoutStore((state) => ({
    contactInfo: state.contactInfo,
    shippingAddress: state.shippingAddress,
    deliveryPreference: state.deliveryPreference,
    setContactInfo: state.setContactInfo,
    setShippingAddress: state.setShippingAddress,
    setAddressMode: state.setAddressMode,
    setDeliveryPreference: state.setDeliveryPreference,
    resetCheckout: state.reset,
  }));

  const [selectedPayment, setSelectedPayment] = useState<PaymentMethod | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<ValidationError[]>([]);
  const [googleMethod, setGoogleMethod] = useState<"search" | "map">("search");

  const currency = items[0]?.currency ?? "ETB";
  const priceFormatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
  });

  const handlePaymentSelect = (method: PaymentMethod) => {
    setSelectedPayment(method);
    setError(null);
  };

  const { isAuthenticated } = useAuth();

  const handleSubmit = async (paymentData: any) => {
    // Require authentication before placing an order
    if (!isAuthenticated) {
      localStorage.setItem("redirectAfterLogin", "/checkout/payment-options");
      router.push("/auth/sign-in");
      return;
    }

    if (!selectedPayment) {
      setError("Please select a payment method");
      return;
    }

    if (items.length === 0) {
      setError("Your cart is empty");
      return;
    }

    if (!contactInfo.fullName || !contactInfo.email) {
      setError("Please complete your contact information");
      router.push("/checkout");
      return;
    }

    if (
      shippingAddress.mode === "manual" &&
      (!shippingAddress.line1 || !shippingAddress.city || !shippingAddress.country)
    ) {
      setError("Please complete your shipping address");
      router.push("/checkout");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const orderItems = items
        .filter((item) => !!item.variantId)
        .map((item) => ({
          variantId: item.variantId as string,
          quantity: item.quantity,
          size: item.size || null,
        }));

      if (orderItems.length === 0) {
        throw new Error("Please select at least one product variant.");
      }

      const payload: CreateOrderPayload = {
        items: orderItems,
        contact: contactInfo,
        shippingAddress,
        deliveryPreference,
        paymentNote: JSON.stringify({
          method: selectedPayment,
          ...paymentData,
        }),
      };

      const response = await createOrder(payload);
      if (!response.success || !response.data) {
        throw new Error(response.error || "Failed to place order. Please try again.");
      }

      // Handle different payment methods
      if (selectedPayment === "chapa") {
        // Redirect to Chapa payment
        const { createPayment } = await import("@/lib/api/payments");
        const paymentResponse = await createPayment(response.data.id);
        if (paymentResponse.success && paymentResponse.data?.checkoutUrl) {
          window.location.href = paymentResponse.data.checkoutUrl;
          return;
        }
      }

      // For other payment methods, show success and redirect
      clearCart();
      resetCheckout();
      router.push(`/cart`);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to place order. Please try again.";
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (items.length === 0) {
    return (
      <>
        <NewNavBar />
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="text-center py-20">
            <h1 className="text-2xl font-semibold text-gray-900 mb-4">Your cart is empty</h1>
            <button
              onClick={() => router.push("/products")}
              className="px-6 py-3 bg-[#310101] text-white rounded-lg font-semibold hover:bg-[#4a0202] transition-colors"
            >
              Browse Products
            </button>
          </div>
        </div>
        <FooterSection />
      </>
    );
  }

  return (
    <>
      <NewNavBar />
      <div className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-semibold text-gray-900 mb-8">Choose Payment Method</h1>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Forms */}
          <div className="lg:col-span-2 space-y-6">
            {/* Delivery Details Section */}
            <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-6">
              <h2 className="text-xl font-semibold text-gray-900">Delivery Details</h2>
              
              <ContactInfoSection
                contactInfo={contactInfo}
                onUpdate={setContactInfo}
                validationErrors={validationErrors}
                onErrorClear={(field) => {
                  setValidationErrors(prev => prev.filter(e => e.field !== field));
                }}
              />

              <ShippingAddressSection
                shippingAddress={shippingAddress}
                onUpdate={setShippingAddress}
                onModeChange={setAddressMode}
                validationErrors={validationErrors}
                onErrorClear={(field) => {
                  setValidationErrors(prev => prev.filter(e => e.field !== field));
                }}
                googleMethod={googleMethod}
                onGoogleMethodChange={setGoogleMethod}
              />

              <DeliveryPreferenceSection
                deliveryPreference={deliveryPreference}
                onUpdate={setDeliveryPreference}
              />
            </div>

            {/* Payment Methods Selection */}
            <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-4">
              <h2 className="text-xl font-semibold text-gray-900">Select Payment Method</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <PaymentMethodCard
                  id="chapa"
                  title="Chapa"
                  description="Secure online payment"
                  icon="💳"
                  isSelected={selectedPayment === "chapa"}
                  onSelect={() => handlePaymentSelect("chapa")}
                />
                <PaymentMethodCard
                  id="telebirr"
                  title="Telebirr"
                  description="Mobile money payment"
                  icon="📱"
                  isSelected={selectedPayment === "telebirr"}
                  onSelect={() => handlePaymentSelect("telebirr")}
                />
                <PaymentMethodCard
                  id="direct-bank"
                  title="Direct Bank Transfer"
                  description="Bank transfer payment"
                  icon="🏦"
                  isSelected={selectedPayment === "direct-bank"}
                  onSelect={() => handlePaymentSelect("direct-bank")}
                />
                <PaymentMethodCard
                  id="credit-card"
                  title="Credit Card"
                  description="Card payment"
                  icon="💳"
                  isSelected={selectedPayment === "credit-card"}
                  onSelect={() => handlePaymentSelect("credit-card")}
                />
              </div>
            </div>

            {/* Payment Forms */}
            {selectedPayment === "telebirr" && (
              <TelebirrForm onSubmit={handleSubmit} isSubmitting={isSubmitting} totalAmount={subtotal} currency={currency} />
            )}
            {selectedPayment === "direct-bank" && (
              <DirectBankForm onSubmit={handleSubmit} isSubmitting={isSubmitting} totalAmount={subtotal} currency={currency} />
            )}
            {selectedPayment === "credit-card" && (
              <CreditCardForm onSubmit={handleSubmit} isSubmitting={isSubmitting} totalAmount={subtotal} currency={currency} />
            )}
            {selectedPayment === "chapa" && (
              <div className="bg-white border border-gray-200 rounded-xl p-6">
                <p className="text-gray-600 mb-4">You will be redirected to Chapa payment gateway after placing your order.</p>
                <button
                  onClick={() => handleSubmit({})}
                  disabled={isSubmitting}
                  className="w-full bg-[#310101] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#4a0202] transition-colors disabled:opacity-50"
                >
                  {isSubmitting ? "Processing..." : "Place Order & Pay with Chapa"}
                </button>
              </div>
            )}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-4 sticky top-4">
              <h2 className="text-xl font-semibold text-gray-900">Order Summary</h2>
              <div className="space-y-0">
                {items.map((item, index) => (
                  <div key={item.key}>
                    <div className="flex items-start gap-3 py-4">
                      <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-50 shrink-0">
                        {item.image ? (
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
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">{item.title}</p>
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
                      <p className="text-sm font-semibold text-gray-900 shrink-0">
                        {priceFormatter.format(item.unitPrice * item.quantity)}
                      </p>
                    </div>
                    {index < items.length - 1 && (
                      <div className="h-px bg-[#310101]"></div>
                    )}
                  </div>
                ))}
              </div>
              <div className="border-t border-[#310101] pt-4 space-y-0">
                <div className="flex justify-between text-sm text-gray-600 py-2">
                  <span>Subtotal ({itemCount} items)</span>
                  <span>{priceFormatter.format(subtotal)}</span>
                </div>
                <div className="h-px bg-[#310101]"></div>
                <div className="flex justify-between text-sm text-gray-600 py-2">
                  <span>Shipping</span>
                  <span>Calculated at next step</span>
                </div>
                <div className="h-px bg-[#310101]"></div>
                <div className="flex justify-between text-lg font-semibold text-gray-900 pt-2">
                  <span>Total</span>
                  <span>{priceFormatter.format(subtotal)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <FooterSection />
    </>
  );
}

interface PaymentMethodCardProps {
  id: string;
  title: string;
  description: string;
  icon: string;
  isSelected: boolean;
  onSelect: () => void;
}

function PaymentMethodCard({ title, description, icon, isSelected, onSelect }: PaymentMethodCardProps) {
  return (
    <button
      type="button"
      onClick={onSelect}
          className={`p-4 border-2 rounded-xl text-left transition-all ${
        isSelected
          ? "border-[#310101] bg-[#310101]/5"
          : "border-gray-200 hover:border-[#310101]/20"
      }`}
    >
      <div className="flex items-start gap-3">
        <span className="text-2xl">{icon}</span>
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900">{title}</h3>
          <p className="text-sm text-gray-500">{description}</p>
        </div>
        {isSelected && (
          <div className="w-5 h-5 rounded-full bg-[#310101] flex items-center justify-center">
            <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </div>
        )}
      </div>
    </button>
  );
}

// Telebirr Form Component
interface TelebirrFormProps {
  onSubmit: (data: any) => void;
  isSubmitting: boolean;
  totalAmount: number;
  currency: string;
}

function TelebirrForm({ onSubmit, isSubmitting, totalAmount, currency }: TelebirrFormProps) {
  const [receipt, setReceipt] = useState<File | null>(null);
  const [receiptPreview, setReceiptPreview] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setReceipt(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setReceiptPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!receipt) {
      alert("Please upload a receipt");
      return;
    }
    // Convert file to base64 for submission
    const reader = new FileReader();
    reader.onloadend = () => {
      onSubmit({
        receipt: reader.result,
        receiptFileName: receipt.name,
      });
    };
    reader.readAsDataURL(receipt);
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Telebirr Payment Details</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="bg-linear-to-br from-[#310101]/5 to-[#310101]/10 border-2 border-[#310101]/20 rounded-xl p-6 space-y-4 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2 h-2 rounded-full bg-[#310101]"></div>
            <p className="text-base font-semibold text-[#310101]">Payment Details</p>
          </div>
          <div className="space-y-3">
            <div className="flex items-start justify-between py-2 border-b border-[#310101]/10">
              <span className="text-sm font-medium text-gray-600">Full Name:</span>
              <span className="text-sm font-semibold text-[#310101] text-right">Maswal Fisha</span>
            </div>
            <div className="flex items-start justify-between py-2 border-b border-[#310101]/10">
              <span className="text-sm font-medium text-gray-600">Phone Number:</span>
              <span className="text-sm font-semibold text-[#310101] text-right font-mono">+0923 42 75 64</span>
            </div>
            <div className="flex items-start justify-between py-2">
              <span className="text-sm font-medium text-gray-600">Total Amount:</span>
              <span className="text-base font-bold text-[#310101] text-right">{currency} {totalAmount.toFixed(2)}</span>
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Upload Receipt *
          </label>
          <input
            type="file"
            accept="image/*,.pdf"
            onChange={handleFileChange}
            className="form-input-base"
            required
          />
          {receiptPreview && (
            <div className="mt-2">
              <img src={receiptPreview} alt="Receipt preview" className="max-w-xs rounded-lg border border-gray-200" />
            </div>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting || !receipt}
          className="w-full bg-[#310101] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#4a0202] transition-colors disabled:opacity-50"
        >
          {isSubmitting ? "Submitting..." : "Submit Order"}
        </button>
      </form>
    </div>
  );
}

// Direct Bank Form Component
interface DirectBankFormProps {
  onSubmit: (data: any) => void;
  isSubmitting: boolean;
  totalAmount: number;
  currency: string;
}

function DirectBankForm({ onSubmit, isSubmitting, totalAmount, currency }: DirectBankFormProps) {
  const [selectedBank, setSelectedBank] = useState<string>("");
  const [receipt, setReceipt] = useState<File | null>(null);
  const [receiptPreview, setReceiptPreview] = useState<string | null>(null);

  const bankAccounts: Record<string, string> = {
    CBE: "1000474049748",
    Buna: "10004740497",
    Awash: "100047404974899",
    Nib: "1000474049748444",
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setReceipt(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setReceiptPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBank) {
      alert("Please select a bank");
      return;
    }
    if (!receipt) {
      alert("Please upload a receipt or screenshot");
      return;
    }
    // Convert file to base64 for submission
    const reader = new FileReader();
    reader.onloadend = () => {
      onSubmit({
        bank: selectedBank,
        accountNumber: bankAccounts[selectedBank],
        receipt: reader.result,
        receiptFileName: receipt.name,
      });
    };
    reader.readAsDataURL(receipt);
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Direct Bank Transfer Details</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Bank *
          </label>
          <select
            value={selectedBank}
            onChange={(e) => setSelectedBank(e.target.value)}
            className="form-input-base"
            required
          >
            <option value="">Choose a bank</option>
            <option value="CBE">CBE</option>
            <option value="Buna">Buna</option>
            <option value="Awash">Awash</option>
            <option value="Nib">Nib</option>
          </select>
        </div>

        {selectedBank && (
          <div className="bg-linear-to-br from-[#310101]/5 to-[#310101]/10 border-2 border-[#310101]/20 rounded-xl p-6 space-y-4 shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 rounded-full bg-[#310101]"></div>
              <p className="text-base font-semibold text-[#310101]">Account Details</p>
            </div>
            <div className="space-y-3">
              <div className="flex items-start justify-between py-2 border-b border-[#310101]/10">
                <span className="text-sm font-medium text-gray-600">Full Name:</span>
                <span className="text-sm font-semibold text-[#310101] text-right">Mastewal fisha</span>
              </div>
              <div className="flex items-start justify-between py-2 border-b border-[#310101]/10">
                <span className="text-sm font-medium text-gray-600">Bank:</span>
                <span className="text-sm font-semibold text-[#310101] text-right">{selectedBank}</span>
              </div>
              <div className="flex items-start justify-between py-2 border-b border-[#310101]/10">
                <span className="text-sm font-medium text-gray-600">Account Number:</span>
                <span className="text-sm font-semibold text-[#310101] text-right font-mono">{bankAccounts[selectedBank]}</span>
              </div>
              <div className="flex items-start justify-between py-2">
                <span className="text-sm font-medium text-gray-600">Total Amount:</span>
                <span className="text-base font-bold text-[#310101] text-right">{currency} {totalAmount.toFixed(2)}</span>
              </div>
            </div>
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Upload Receipt or Screenshot *
          </label>
          <input
            type="file"
            accept="image/*,.pdf"
            onChange={handleFileChange}
            className="form-input-base"
            required
          />
          {receiptPreview && (
            <div className="mt-2">
              <img src={receiptPreview} alt="Receipt preview" className="max-w-xs rounded-lg border border-gray-200" />
            </div>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting || !selectedBank || !receipt}
          className="w-full bg-[#310101] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#4a0202] transition-colors disabled:opacity-50"
        >
          {isSubmitting ? "Submitting..." : "Submit Order"}
        </button>
      </form>
    </div>
  );
}

// Credit Card Form Component
interface CreditCardFormProps {
  onSubmit: (data: any) => void;
  isSubmitting: boolean;
  totalAmount: number;
  currency: string;
}

function CreditCardForm({ onSubmit, isSubmitting, totalAmount, currency }: CreditCardFormProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // For now, credit card will redirect to Chapa
    onSubmit({
      method: "credit-card",
    });
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Credit Card Payment</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-900">
            Credit card payments are processed securely through Chapa payment gateway.
          </p>
        </div>
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-[#310101] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#4a0202] transition-colors disabled:opacity-50"
        >
          {isSubmitting ? "Processing..." : "Proceed to Payment"}
        </button>
      </form>
    </div>
  );
}

