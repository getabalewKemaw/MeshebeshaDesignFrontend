import Navbar from "@/components/NavBar";
import Hero from "@/components/landing/Hero";
import FeaturedCollections from "@/components/landing/FeaturedCollections";
import Benefits from "@/components/landing/Benefits";
import TrendingProducts from "@/components/landing/TrendingProducts";
import HowItWorks from "@/components/landing/HowItWorks";
import FAQ from "@/components/landing/FAQ";
import Testimonials from "@/components/landing/Testimonials";
import Newsletter from "@/components/landing/Newsletter";
import Footer from "@/components/landing/Footer";
import ChatPopup from "@/components/landing/ChatPopup";

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main className="bg-[#FFF9F0] text-[#1E2A55]">
        <Hero />
        <FeaturedCollections />
        <Benefits />
        <TrendingProducts />
        <HowItWorks />
        <FAQ />
        <Testimonials />
        <Newsletter />
      </main>
      <Footer />
      <ChatPopup />
    </>
  );
}