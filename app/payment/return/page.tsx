"use client";

import { useSearchParams } from "next/navigation";
import Navbar from "@/components/NavBar";
import { usePaymentStatus } from "@/hooks/usePaymentStatus";
import PaymentLoading from "@/components/payment/return/PaymentLoading";
import PaymentError from "@/components/payment/return/PaymentError";
import PaymentSuccess from "@/components/payment/return/PaymentSuccess";
import PaymentFailed from "@/components/payment/return/PaymentFailed";
import PaymentPending from "@/components/payment/return/PaymentPending";
import NewNavBar from "@/components/newlanding/NewNavBar";
export default function PaymentReturnPage() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");

  const { paymentStatus, isLoading, error } = usePaymentStatus(orderId);

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

  // 3. Loading State
  if (isLoading || !paymentStatus) {
    return (
      <>
        <NewNavBar />
        <PaymentLoading />
      </>
    );
  }

  // 4. Success State
  if (paymentStatus.status === "paid") {
    return (
      <>
        <NewNavBar />
        <PaymentSuccess paymentStatus={paymentStatus} />
      </>
    );
  }

  // 5. Failed State
  if (paymentStatus.status === "failed") {
    return (
      <>
        <NewNavBar />
        <PaymentFailed paymentStatus={paymentStatus} />
      </>
    );
  }

  // 6. Pending State (Default fallback)
  return (
    <>
      <NewNavBar />
      <PaymentPending />
    </>
  );
}


