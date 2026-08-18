'use client';

import './newlanding/styles.css';
import dynamic from 'next/dynamic';
import NewNavBar from '@/components/newlanding/NewNavBar';
import NewHeroSection from '@/components/newlanding/NewHeroSection';

const BestSellingSection = dynamic(() => import('@/components/newlanding/BestSellingSection'));
const ModernCulturalSection = dynamic(() => import('@/components/newlanding/ModernCulturalSection'));
const EventHolidaySection = dynamic(() => import('@/components/newlanding/EventHolidaySection'));
const MensCouplesSection = dynamic(() => import('@/components/newlanding/MensCouplesSection'));
const JewelrySection = dynamic(() => import('@/components/newlanding/JewelrySection'));
const CustomProductSection = dynamic(() => import('@/components/newlanding/CustomProductSection'));
const AboutSection = dynamic(() => import('@/components/newlanding/AboutSection'));
const FooterSection = dynamic(() => import('@/components/newlanding/FooterSection'));
const InfiniteTextDivider = dynamic(() => import('@/components/newlanding/InfiniteTextDivider'));
const FresShipingDivder = dynamic(() => import('@/components/newlanding/FreshipingAnimated'));
const CustomerFeedbackSection = dynamic(() => import('@/components/newlanding/CustomerFeedbackSection'));
const SocialShowcaseSection = dynamic(() => import('@/components/newlanding/SocialShowcaseSection'));
const ChatPopup = dynamic(() => import('@/components/landing/ChatPopup'));

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
