import { Features, HeroSection, ReadyToElevate, TrustInTechnology } from '@/components/section';
import { DataDrivenDecisions } from '@/components/section/DataDrivenDecisions';
import {
  AutomatedB2B2,
  BenifitsJoining,
  FeaturesSection,
  Review,
  ScaleOutreach,
  SeamLessIntegration,
} from '@/components/section/landing';
import ComparisonFlow from '@/components/section/landing/comparison';
import { featureItems } from '@/constants/appConstants';

const HomePage = () => {
  return (
    <>
      <div className="max-h-[100vh] w-full hero-section  overflow-hidden">
        <HeroSection />
      </div>
      <TrustInTechnology />
      <ComparisonFlow />
      <Features />
      <FeaturesSection features={featureItems} />
      <DataDrivenDecisions />
      <ScaleOutreach />
      {/* <TrustInTechnologySection /> */}

      <AutomatedB2B2 />
      <SeamLessIntegration />

      <ReadyToElevate />
      <Review />
      <BenifitsJoining />
    </>
  );
};

export default HomePage;
