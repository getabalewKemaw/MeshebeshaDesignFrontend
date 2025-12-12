"use client";

import Navbar from "@/components/NavBar";
import CartItemCard from "@/components/cart/CartItemCard";
import OrderSummaryCard from "@/components/cart/OrderSummaryCard";
import EmptyState from "@/components/ui/EmptyState";
import Toast from "@/components/ui/Toast";
import { useCartStore } from "@/stores/cart";
import { ShoppingBag } from "lucide-react";
import { useState } from "react";
import type { ToastType } from "@/components/ui/Toast";
import Link from "next/link";
import NewNavBar from "@/components/newlanding/NewNavBar";
import FooterSection from "@/components/newlanding/FooterSection";


// to prevent unnnessary computation on evert rende
const currencyFormatter = (currency: string) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
  });


interface ToastState {
  message: string;
  type: ToastType;
}

export default function CartPage() {
  const { items, itemCount, subtotal, removeItem, updateQuantity, clearCart, hasHydrated } =
    useCartStore();
  const [toast, setToast] = useState<ToastState | null>(null);

  const handleQuantityChange = (key: string, next: number) => {
    if (Number.isNaN(next)) return;
    updateQuantity(key, next);
    setToast({ message: "Cart updated successfully", type: "success" });
  };

  const handleRemoveItem = (key: string) => {
    removeItem(key);
    setToast({ message: "Item removed from cart", type: "success" });
  };

  const handleClearCart = () => {
    clearCart();
    setToast({ message: "Cart cleared", type: "info" });
  };

  const currency = items[0]?.currency ?? "USD";
  const formatPrice = currencyFormatter(currency);
  const isEmpty = hasHydrated && items.length === 0;

  return (
    <>
      <NewNavBar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 pt-32 pb-16">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6">
          <div>
            <h1 className="text-4xl font-bold text-[#310101] tracking-tight">Your Cart</h1>
            <p className="text-gray-500 text-sm mt-2">
              {itemCount > 0
                ? `${itemCount} item${itemCount === 1 ? "" : "s"} ready for checkout`
                : "Review items and continue to checkout."}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Link href="/products" className="px-6 py-2.5 border border-[#310101]  text-sm font-medium text-gray-700 transition-colors">
              Continue Shopping
            </Link>
            {items.length > 0 && (
              <button
                type="button"
                onClick={handleClearCart}
                className="px-6 py-2.5 border border-[#310101]  text-sm font-medium text-[#510505] hover:bg-gray-50 transition-colors"
              >
                Clear cart
              </button>
            )}
          </div>
        </div>

        {/* Divider Line */}
        <div className="h-px bg-[#310101]" />

        {/* Loading State */}
        {!hasHydrated ? (
          <EmptyState title="Loading your cart..." />
        ) : isEmpty ? (
          /* Empty State */
          <EmptyState
            icon={<ShoppingBag size={48} />}
            title="Your cart is empty."
            description="Browse our products and add items you like."
            actionLabel="Explore products"
            actionHref="/products"
          />
        ) : (
          /* Cart Content */
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                {/* Table Header */}
                <div className="grid grid-cols-[auto_1fr_auto_auto] gap-6 px-6 py-4 bg-gray-50 border-b border-gray-200">
                  <div className="text-sm font-semibold text-[#310101]">Product</div>
                  <div></div>
                  <div className="text-sm font-semibold text-[#310101]">Quantity</div>
                  <div className="text-sm font-semibold text-[#310101] text-right min-w-[100px]">Total</div>
                </div>

                {/* Cart Items */}
                <div className="px-6">
                  {items.map((item, index) => (
                    <CartItemCard
                      key={item.key}
                      item={item}
                      formatPrice={(price) => formatPrice.format(price)}
                      onRemove={handleRemoveItem}
                      onQuantityChange={handleQuantityChange}
                      showDivider={index < items.length - 1}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <OrderSummaryCard
              itemCount={itemCount}
              subtotal={subtotal}
              formatPrice={(price) => formatPrice.format(price)}
            />

          </div>

        )}
      </div>

      {/* Toast Notification */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}


      <div className="h-px bg-[#310101]" />

      <FooterSection />
    </>
  );
}
