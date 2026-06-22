"use client";

import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { usePaymentStatus } from "@/hooks/usePaymentStatus";
import { useCartStore } from "@/stores/cart";
import { useCheckoutStore } from "@/stores/checkout";
import PaymentLoading from "@/components/payment/return/PaymentLoading";
import PaymentError from "@/components/payment/return/PaymentError";
import PaymentSuccess from "@/components/payment/return/PaymentSuccess";
import PaymentFailed from "@/components/payment/return/PaymentFailed";
import PaymentPending from "@/components/payment/return/PaymentPending";
import NewNavBar from "@/components/newlanding/NewNavBar";

export default function PaymentReturnPage() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");

  const { paymentStatus, isLoading, error, retryVerification, pollCount } =
    usePaymentStatus(orderId);

  const clearCart = useCartStore((s) => s.clearCart);
  const resetCheckout = useCheckoutStore((s) => s.reset);

  // Safety-net: clear cart when payment is confirmed as paid
  useEffect(() => {
    if (paymentStatus?.status === "paid") {
      clearCart();
      resetCheckout();
    }
  }, [paymentStatus?.status, clearCart, resetCheckout]);

  // 1. Missing Order ID
  if (!orderId) {
    return (
      <>
        <NewNavBar />
        <PaymentError
          title="Invalid Request"
          message="Order ID is missing from the URL."
        />
      </>
    );
  }

  // 2. Error State
  if (error) {
    return (
      <>
        <NewNavBar />
        <PaymentError message={error} />
      </>
    );
  }

  // 3. Loading State (initial fetch)
  if (isLoading && !paymentStatus) {
    return (
      <>
        <NewNavBar />
        <PaymentLoading />
      </>
    );
  }

  // 4. Success State
  if (paymentStatus?.status === "paid") {
    return (
      <>
        <NewNavBar />
        <PaymentSuccess paymentStatus={paymentStatus} />
      </>
    );
  }

  // 5. Failed State
  if (paymentStatus?.status === "failed") {
    return (
      <>
        <NewNavBar />
        <PaymentFailed paymentStatus={paymentStatus} />
      </>
    );
  }

  // 6. Pending State — with retry and progress feedback
  return (
    <>
      <NewNavBar />
      <PaymentPending
        isStillPolling={isLoading}
        pollCount={pollCount}
        onRetry={retryVerification}
      />
    </>
  );
}
