export default function Newsletter() {
  return (
    <section className="px-4 py-16 font-body sm:px-6 lg:px-8" aria-labelledby="newsletter-heading">
      <div className="mx-auto max-w-5xl rounded-[32px] bg-white p-8 text-center shadow-2xl shadow-[#1E2A55]/10">
        <p className="font-heading text-sm uppercase tracking-[0.35em] text-[#CFAE56]">Stay Updated</p>
        <h2 id="newsletter-heading" className="mt-3 font-heading text-3xl font-semibold text-[#1E2A55]">
          Join the Atelier Circle
        </h2>
        <p className="mt-2 text-base text-[#1E2A55]/70">
          Get early access to limited drops, tailoring appointments, and style guides curated by our designers.
        </p>

        <form className="mt-8 flex flex-col gap-4 sm:flex-row">
          <label htmlFor="email" className="sr-only">
            Email address
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            placeholder="Enter your email"
            className="w-full rounded-full border border-[#1E2A55]/20 bg-[#FAFAFA] px-6 py-3 text-base text-[#1E2A55] outline-none transition focus:border-[#CFAE56] focus:ring-2 focus:ring-[#CFAE56]/40"
          />
          <button
            type="submit"
            className="w-full rounded-full bg-[#1E2A55] px-8 py-3 text-base font-semibold text-white shadow-lg shadow-[#1E2A55]/30 transition hover:-translate-y-0.5 hover:bg-[#182043] sm:w-auto"
          >
            Subscribe
          </button>
        </form>
        <p className="mt-3 text-xs text-[#1E2A55]/60">We send only essentials. Unsubscribe anytime.</p>
      </div>
    </section>
  );
}

