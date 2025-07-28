import { BusinessNeed } from '@/components/section/home/businessNeed';
import { ConvertLeads } from '@/components/section/home/converLeads';
import { HeroSection } from '@/components/section/home/heroSection';
import { ReadyToAutomate } from '@/components/section/home/readyToAutomate';
import { ReadyToBanner } from '@/components/section/home/readyToBanner';
import { Review } from '@/components/section/landing';
import { BenifitsOfJoining } from '@/components/section/landing/benifitsOfJoining';
import ComparisonFlow from '@/components/section/landing/comparison';

import { PowerPage } from '../components/powerPage';

const HomePageV2 = () => {
  return (
    <>
      <HeroSection />
      {/* <TrustedCompany /> */}
      <PowerPage />
      <ReadyToBanner />
      <ComparisonFlow />
      <BusinessNeed />
      <Review />
      <ReadyToAutomate />
      <BenifitsOfJoining />
      <ConvertLeads />
    </>
  );
};

export default HomePageV2;
