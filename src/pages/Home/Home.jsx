import HeroSection from './HeroSection';
import StatusTicker from './StatusTicker';
import DistrictDossier from './DistrictDossier';
import FoundingCharter from './FoundingCharter';
import RadioCta from './RadioCta';

// Old sections (SwiperBanner, Banner, NewsSection, FAQSection,
// LaunchStatusSection, FeaturesSection, WhyJoinSection, CommunityCtaSection)
// remain on disk but are no longer rendered.

const Home = () => {
  return (
    <div>
      <HeroSection />
      <StatusTicker />
      <DistrictDossier />
      <FoundingCharter />
      <RadioCta />
    </div>
  );
};

export default Home;