'use client';

import './styles.css';
import NewNavBar from '@/components/newlanding/NewNavBar';
import NewHeroSection from '@/components/newlanding/NewHeroSection';
import BestSellingSection from '@/components/newlanding/BestSellingSection';
import ModernCulturalSection from '@/components/newlanding/ModernCulturalSection';
import EventHolidaySection from '@/components/newlanding/EventHolidaySection';
import MensCouplesSection from '@/components/newlanding/MensCouplesSection';
import JewelrySection from '@/components/newlanding/JewelrySection';

export default function NewLandingPage() {
    return (
        <div className="min-h-screen">
            {/* No padding or margin - navbar sits at the very top */}
            <NewNavBar />
            <NewHeroSection />
            <BestSellingSection />
            <ModernCulturalSection />
            <EventHolidaySection />
            <MensCouplesSection />
            <JewelrySection />
        </div>
    );
}
