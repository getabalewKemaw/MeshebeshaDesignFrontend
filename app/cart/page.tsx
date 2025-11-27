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
      <Navbar />
      <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-semibold text-gray-900">Your Cart</h1>
            <p className="text-gray-500 text-sm mt-1">
              {itemCount > 0
                ? `${itemCount} item${itemCount === 1 ? "" : "s"} ready for checkout`
                : "Review items and continue to checkout."}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/products" className="form-button-secondary">
              Continue Shopping
            </Link>
            {items.length > 0 && (
              <button
                type="button"
                onClick={handleClearCart}
                className="form-button-secondary"
              >
                Clear cart
              </button>
            )}
          </div>
        </div>

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
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
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
    </>
  );
}

