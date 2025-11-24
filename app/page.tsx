import Navbar from "@/components/NavBar";
import Hero from "@/components/landing/Hero";
import FeaturedCollections from "@/components/landing/FeaturedCollections";
import Benefits from "@/components/landing/Benefits";
import TrendingProducts from "@/components/landing/TrendingProducts";
import Testimonials from "@/components/landing/Testimonials";
import Newsletter from "@/components/landing/Newsletter";
import Footer from "@/components/landing/Footer";

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main className="bg-[#FFF9F0] text-[#1E2A55]">
        <Hero />
        <FeaturedCollections />
        <Benefits />
        <TrendingProducts />
        <Testimonials />
        <Newsletter />
      </main>
      <Footer />
    </>
  );
}