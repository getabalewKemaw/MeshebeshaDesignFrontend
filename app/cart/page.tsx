"use client";

import Link from "next/link";

import Navbar from "@/components/NavBar";
import { useCartStore } from "@/stores/cart";

const currencyFormatter = (currency: string) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
  });

export default function CartPage() {
  const { items, itemCount, subtotal, removeItem, updateQuantity, clearCart, hasHydrated } =
    useCartStore();

  const handleQuantityChange = (key: string, next: number) => {
    if (Number.isNaN(next)) return;
    updateQuantity(key, next);
  };

  const currency = items[0]?.currency ?? "USD";
  const formatPrice = currencyFormatter(currency);
  const isEmpty = hasHydrated && items.length === 0;

  return (
    <>
      <Navbar />
      <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-semibold text-gray-900">Your Cart</h1>
            <p className="text-gray-500 text-sm mt-1">
              {itemCount > 0
                ? `${itemCount} item${itemCount === 1 ? "" : "s"} ready for checkout`
                : "Review items and continue to checkout."}
            </p>
          </div>
          {items.length > 0 && (
            <button
              type="button"
              onClick={clearCart}
              className="text-sm text-red-600 hover:text-red-700 font-medium"
            >
              Clear cart
            </button>
          )}
        </div>

        {!hasHydrated ? (
          <div className="border border-dashed border-gray-200 rounded-xl p-10 text-center text-gray-500">
            Loading your cart...
          </div>
        ) : isEmpty ? (
          <div className="border border-dashed border-gray-200 rounded-xl p-10 text-center space-y-4">
            <p className="text-lg font-medium text-gray-700">Your cart is empty.</p>
            <p className="text-sm text-gray-500">
              Browse our products and add items you like.
            </p>
            <Link
              href="/products"
              className="inline-flex items-center justify-center px-6 py-3 rounded-full bg-purple-600 text-white font-semibold hover:bg-purple-700"
            >
              Explore products
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-4">
              {items.map((item) => (
                <div
                  key={item.key}
                  className="flex flex-col sm:flex-row gap-4 border border-gray-200 rounded-xl p-4 bg-white"
                >
                  <div className="w-full sm:w-32 h-32 bg-gray-50 rounded-lg overflow-hidden">
                    {item.image ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">
                        No image
                      </div>
                    )}
                  </div>
                  <div className="flex-1 space-y-2">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h2 className="text-lg font-semibold text-gray-900">{item.title}</h2>
                        <p className="text-sm text-gray-500">
                          {item.color && <span>{item.color}</span>}
                          {item.size && (
                            <span className="ml-1">
                              {item.color ? "/" : ""}
                              {item.size}
                            </span>
                          )}
                        </p>
                        {item.subtitle && (
                          <p className="text-xs text-gray-400">SKU: {item.subtitle}</p>
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={() => removeItem(item.key)}
                        className="text-sm text-gray-400 hover:text-red-600"
                        aria-label={`Remove ${item.title}`}
                      >
                        Remove
                      </button>
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div className="inline-flex items-center border border-gray-200 rounded-full overflow-hidden">
                        <button
                          type="button"
                          onClick={() => handleQuantityChange(item.key, item.quantity - 1)}
                          className="px-3 py-1 text-lg text-gray-600 hover:bg-gray-100 disabled:opacity-50"
                          disabled={item.quantity <= 1}
                        >
                          -
                        </button>
                        <input
                          type="number"
                          min={1}
                          value={item.quantity}
                          onChange={(event) =>
                            handleQuantityChange(item.key, Number(event.target.value))
                          }
                          className="w-16 text-center border-x border-gray-200 py-1 text-sm focus:outline-none"
                        />
                        <button
                          type="button"
                          onClick={() => handleQuantityChange(item.key, item.quantity + 1)}
                          className="px-3 py-1 text-lg text-gray-600 hover:bg-gray-100 disabled:opacity-50"
                          disabled={
                            typeof item.stock === "number" &&
                            item.stock > 0 &&
                            item.quantity >= item.stock
                          }
                        >
                          +
                        </button>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-500">
                          Unit price: {formatPrice.format(item.unitPrice)}
                        </p>
                        <p className="text-lg font-semibold text-gray-900">
                          {formatPrice.format(item.unitPrice * item.quantity)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="border border-gray-200 rounded-xl p-6 bg-white h-fit space-y-4">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Order Summary</h2>
                <p className="text-sm text-gray-500">Taxes and shipping calculated at checkout.</p>
              </div>
              <div className="flex items-center justify-between text-sm text-gray-600">
                <span>Items ({itemCount})</span>
                <span>{formatPrice.format(subtotal)}</span>
              </div>
              <div className="flex items-center justify-between text-base font-semibold text-gray-900">
                <span>Subtotal</span>
                <span>{formatPrice.format(subtotal)}</span>
              </div>
              <div className="space-y-3">
                <Link
                  href="/checkout"
                  className="block text-center w-full px-4 py-3 rounded-full bg-purple-600 text-white font-semibold hover:bg-purple-700"
                >
                  Continue to checkout
                </Link>
                <p className="text-xs text-gray-500 text-center">
                  Need to edit your cart later? Items are saved on this device.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

