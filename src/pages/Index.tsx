
import React from 'react';
import Navigation from '@/components/Navigation';
import HeroSection from '@/components/HeroSection';
import PricingSection from '@/components/PricingSection';
import PartnersSection from '@/components/PartnersSection';
import WhatsAppWidget from '@/components/WhatsAppWidget';

const Index = () => {
  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      <HeroSection />
      <PricingSection />
      <PartnersSection />
      <WhatsAppWidget />
    </div>
  );
};

export default Index;
