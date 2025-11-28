"use client";

import { useState } from "react";

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");

    // Simulate API call
    setTimeout(() => {
      setStatus("success");
      setEmail("");
      setTimeout(() => setStatus("idle"), 3000);
    }, 1000);
  };

  return (
    <section className="bg-gradient-to-br from-[#1E2A55] to-[#0A1128] px-4 py-20 font-body sm:px-6 lg:px-8" aria-labelledby="newsletter-heading">
      <div className="mx-auto max-w-6xl">
        <div className="relative overflow-hidden rounded-3xl bg-white shadow-2xl">
          {/* Decorative Elements */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#CFAE56]/10 rounded-full -mr-48 -mt-48 blur-3xl" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#1E2A55]/5 rounded-full -ml-48 -mb-48 blur-3xl" />

          <div className="relative grid lg:grid-cols-2 gap-12 p-8 sm:p-12">
            {/* Left Side - Content */}
            <div className="space-y-6">
              {/* Icon */}
              <div className="inline-flex rounded-2xl bg-gradient-to-br from-[#CFAE56] to-[#E5C976] p-4 shadow-lg">
                <svg className="h-10 w-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>

              {/* Header */}
              <div>
                <p className="font-heading text-sm uppercase tracking-[0.35em] text-[#CFAE56] mb-3">
                  Stay Updated
                </p>
                <h2 id="newsletter-heading" className="font-heading text-4xl sm:text-5xl font-bold text-[#1E2A55] mb-4">
                  Join the Atelier Circle
                </h2>
                <p className="text-lg text-[#1E2A55]/70 leading-relaxed">
                  Subscribe to receive exclusive updates, early access to new collections, and insider styling tips from our design team.
                </p>
              </div>

              {/* Benefits */}
              <div className="space-y-3 pt-4">
                {[
                  { icon: "🎁", text: "Early access to limited edition drops" },
                  { icon: "✨", text: "Exclusive styling guides & fashion tips" },
                  { icon: "🎯", text: "Special subscriber-only discounts" },
                  { icon: "📅", text: "Priority booking for custom tailoring" },
                ].map((benefit, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <span className="text-2xl">{benefit.icon}</span>
                    <span className="text-[#1E2A55]/80">{benefit.text}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Side - Form */}
            <div className="flex flex-col justify-center">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="email" className="block text-sm font-semibold text-[#1E2A55] mb-2">
                    Email Address
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full rounded-xl border-2 border-gray-200 bg-gray-50 px-6 py-4 text-base text-[#1E2A55] placeholder:text-gray-400 outline-none transition focus:border-[#CFAE56] focus:bg-white focus:shadow-lg"
                    disabled={status === "loading" || status === "success"}
                  />
                </div>

                <button
                  type="submit"
                  disabled={status === "loading" || status === "success"}
                  className="w-full rounded-xl bg-gradient-to-r from-[#1E2A55] to-[#2A3A65] px-8 py-4 text-base font-bold text-white shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {status === "loading" ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Subscribing...
                    </span>
                  ) : status === "success" ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Successfully Subscribed!
                    </span>
                  ) : (
                    "Subscribe Now"
                  )}
                </button>

                {/* Status Messages */}
                {status === "success" && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <p className="text-sm text-green-700 flex items-center gap-2">
                      <svg className="h-5 w-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Welcome to the Atelier Circle! Check your inbox for a special welcome gift.
                    </p>
                  </div>
                )}
                {status === "error" && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <p className="text-sm text-red-700">
                      Something went wrong. Please try again.
                    </p>
                  </div>
                )}

                {/* Trust Indicators */}
                <div className="flex flex-wrap items-center gap-4 pt-2 text-xs text-[#1E2A55]/60">
                  <div className="flex items-center gap-1.5">
                    <svg className="h-4 w-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>No spam</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <svg className="h-4 w-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Unsubscribe anytime</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <svg className="h-4 w-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>10K+ subscribers</span>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
