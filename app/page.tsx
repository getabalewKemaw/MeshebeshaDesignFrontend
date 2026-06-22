'use client';

import './newlanding/styles.css';
import NewNavBar from '@/components/newlanding/NewNavBar';
import NewHeroSection from '@/components/newlanding/NewHeroSection';
import BestSellingSection from '@/components/newlanding/BestSellingSection';
import ModernCulturalSection from '@/components/newlanding/ModernCulturalSection';
import EventHolidaySection from '@/components/newlanding/EventHolidaySection';
import MensCouplesSection from '@/components/newlanding/MensCouplesSection';
import JewelrySection from '@/components/newlanding/JewelrySection';
import CustomProductSection from '@/components/newlanding/CustomProductSection';
import AboutSection from '@/components/newlanding/AboutSection';
import FooterSection from '@/components/newlanding/FooterSection';
import InfiniteTextDivider from '@/components/newlanding/InfiniteTextDivider';
import ChatPopup from '@/components/landing/ChatPopup';

import FresShipingDivder from '@/components/newlanding/FreshipingAnimated';
import CustomerFeedbackSection from '@/components/newlanding/CustomerFeedbackSection';
import SocialShowcaseSection from '@/components/newlanding/SocialShowcaseSection';

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <NewNavBar />
      <NewHeroSection />
      <InfiniteTextDivider />
      <BestSellingSection />
      <InfiniteTextDivider />
      <ModernCulturalSection />
      <InfiniteTextDivider />
      <EventHolidaySection />
      <InfiniteTextDivider />
      <MensCouplesSection />
      <InfiniteTextDivider />
      <JewelrySection />
      <FresShipingDivder />

      <SocialShowcaseSection />
      <InfiniteTextDivider />
      <CustomerFeedbackSection />
      <InfiniteTextDivider />

      <CustomProductSection />
      <InfiniteTextDivider />
      <AboutSection />
      <InfiniteTextDivider />
      <FooterSection />
      <ChatPopup />
    </div>
  );
}