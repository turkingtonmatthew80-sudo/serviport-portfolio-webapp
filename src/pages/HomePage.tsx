import { HeroSection } from '../components/HeroSection';
import { AboutSection } from '../components/AboutSection';
import { ServicesSection } from '../components/ServicesSection';
import { PortalPreviewSection } from '../components/PortalPreviewSection';
import { LocationsPartnersSection } from '../components/LocationsPartnersSection';
import { NewsSection } from '../components/NewsSection';
import { FAQSection } from '../components/FAQSection';

export function HomePage() {
  return (
    <>
      <HeroSection />
      <AboutSection />
      <ServicesSection />
      <PortalPreviewSection />
      <LocationsPartnersSection />
      <NewsSection />
      <FAQSection />
    </>
  );
}
