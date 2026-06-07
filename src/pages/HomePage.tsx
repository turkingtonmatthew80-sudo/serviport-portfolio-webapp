import { lazy, Suspense } from 'react';
import { HeroSection } from '../components/HeroSection';

const AboutSection = lazy(() => import('../components/AboutSection').then(module => ({ default: module.AboutSection })));
const ServicesSection = lazy(() => import('../components/ServicesSection').then(module => ({ default: module.ServicesSection })));
const PortalPreviewSection = lazy(() => import('../components/PortalPreviewSection').then(module => ({ default: module.PortalPreviewSection })));
const LocationsPartnersSection = lazy(() => import('../components/LocationsPartnersSection').then(module => ({ default: module.LocationsPartnersSection })));
const NewsSection = lazy(() => import('../components/NewsSection').then(module => ({ default: module.NewsSection })));
const FAQSection = lazy(() => import('../components/FAQSection').then(module => ({ default: module.FAQSection })));

export function HomePage() {
  return (
    <>
      <HeroSection />
      <Suspense fallback={<div className="h-screen w-full flex items-center justify-center bg-[#0b1a2e]"><div className="w-8 h-8 border-4 border-[#00A9CE] border-t-transparent rounded-full animate-spin"></div></div>}>
        <div className="border-t border-[#0b1424]/10">
          <AboutSection />
        </div>
        <ServicesSection />
        <div className="border-t border-[#0b1a2e]/50">
          <PortalPreviewSection />
        </div>
        <div className="border-t border-gray-200">
          <LocationsPartnersSection />
        </div>
        <NewsSection />
        <div className="border-t border-gray-200">
          <FAQSection />
        </div>
      </Suspense>
    </>
  );
}
