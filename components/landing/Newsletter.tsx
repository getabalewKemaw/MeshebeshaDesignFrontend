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
      <div className="mx-auto max-w-5xl">
        <div className="relative overflow-hidden rounded-3xl bg-white p-12 shadow-2xl">
          {/* Decorative Elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#CFAE56]/10 rounded-full -mr-32 -mt-32 blur-3xl" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#1E2A55]/5 rounded-full -ml-32 -mb-32 blur-3xl" />

          <div className="relative text-center">
            {/* Icon */}
            <div className="inline-flex rounded-full bg-[#CFAE56]/10 p-4 mb-6">
              <svg className="h-12 w-12 text-[#CFAE56]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>

            {/* Header */}
            <p className="font-heading text-sm uppercase tracking-[0.35em] text-[#CFAE56] mb-3">
              Stay Updated
            </p>
            <h2 id="newsletter-heading" className="font-heading text-4xl font-bold text-[#1E2A55] mb-4">
              Join the Atelier Circle
            </h2>
            <p className="text-lg text-[#1E2A55]/70 max-w-2xl mx-auto mb-8">
              Get early access to limited drops, tailoring appointments, and style guides curated by our designers.
            </p>

            {/* Form */}
            <form onSubmit={handleSubmit} className="max-w-md mx-auto">
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="flex-1">
                  <label htmlFor="email" className="sr-only">
                    Email address
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="w-full rounded-full border-2 border-gray-200 bg-gray-50 px-6 py-4 text-base text-[#1E2A55] placeholder:text-gray-400 outline-none transition focus:border-[#CFAE56] focus:bg-white"
                    disabled={status === "loading" || status === "success"}
                  />
                </div>
                <button
                  type="submit"
                  disabled={status === "loading" || status === "success"}
                  className="rounded-full bg-[#1E2A55] px-8 py-4 text-base font-bold text-white shadow-lg hover:bg-[#2A3A65] transition-colors disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                >
                  {status === "loading" ? "Subscribing..." : status === "success" ? "Subscribed!" : "Subscribe"}
                </button>
              </div>

              {/* Status Messages */}
              {status === "success" && (
                <p className="mt-4 text-sm text-green-600 flex items-center justify-center gap-2">
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Successfully subscribed! Check your email.
                </p>
              )}
              {status === "error" && (
                <p className="mt-4 text-sm text-red-600">
                  Something went wrong. Please try again.
                </p>
              )}
            </form>

            {/* Trust Indicators */}
            <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-sm text-[#1E2A55]/60">
              <div className="flex items-center gap-2">
                <svg className="h-5 w-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>No spam, ever</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="h-5 w-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Unsubscribe anytime</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="h-5 w-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>10K+ subscribers</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
