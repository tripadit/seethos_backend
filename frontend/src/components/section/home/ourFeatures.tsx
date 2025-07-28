import React from 'react';
import { useMixpanel } from 'react-mixpanel-browser';

import { ANIMATION } from '@/assets/animation';
import { SectionContainer } from '@/components/molecules/SectionContainer';
import { APPMIXPANELV2 } from '@/mixpanel/appMixpanel';

import { FeatureImageCard } from './components/featureImageCard';
import { FeatureInfoCard } from './components/featureInfoCard';
interface IFeatureItems {
  heading: string;
  description: string;
  isActive?: boolean;
  animation: any;
  [key: string]: any;
}
const FEATURES: IFeatureItems[] = [
  {
    heading: 'Autonomous Professional Assistants',
    description: `Embrace Autonomous Assistants from Unreal AI for enhanced efficiency, cost reduction, and 24/7 service`,
    animation: ANIMATION.AutomationAi,
    id: '12',
  },

  {
    heading: 'Dynamic Email Marketing',
    description: `Unreal AI assistants analyze Ideal Customer Profiles using advanced algorithms to understand target market characteristics.`,
    animation: ANIMATION.EmailMarketing,
    id: '13',
  },
  {
    heading: 'Adaptive Lead Generation',
    description: `Unreal professional assistants revolutionize email marketing by ensuring every lead receives a personalized message, significantly enhancing engagement and conversion rates.`,
    animation: ANIMATION.CustomLeadScraping,
    id: '14',
  },
];
const NextFeatures: IFeatureItems[] = [
  {
    heading: '24/7 Autonomous Operation',
    description: `Your marketing never sleeps with Unreal AI. Our professional assistants work around the clock, ensuring your brand is always engaging, always optimizing, and always growing`,
    animation: ANIMATION.AllTimeSupport,
    id: '20',
  },
  {
    heading: 'Automated B2B Meeting Scheduling',
    description: `Unreal professional assistants revolutionize lead engagement by reaching out to prospects that align with a business's Ideal Customer Profile (ICP) at an unprecedented scale.`,
    animation: ANIMATION.AutomatedB2BMetting,
    id: '22',
  },
  {
    heading: 'Data-Driven Decisions',
    description: `Gain valuable and real time insights from comprehensive analytics to make informed decisions that propel your business forward.`,
    animation: ANIMATION.AutomatedB2BMetting,
    id: '23',
  },
];

export const OurFeatures = () => {
  const [activeFeature, setActiveFeature] = React.useState<IFeatureItems>(FEATURES[0]);
  const [nextFeature, setNextFeature] = React.useState<IFeatureItems>(NextFeatures[0]);
  const mixpanel = useMixpanel();
  return (
    <div id="features" className="w-full ">
      <SectionContainer className="py-[200px]">
        <div className="flex flex-col gap-10">
          <div className="flex flex-col flex-1 justify-center items-center gap-3">
            <h1
              data-aos="fade-up"
              data-aos-delay={'200'}
              data-aos-offset={'0'}
              className="font-bold text-white capitalize mobile:mt-3 md:leading-[45px] xl:leading-[67px] mobile:text-3xl text-[56px] text-center tracking-[-1px]"
            >
              Our Ability To <span className="text-purple-500">boost</span> your sales
            </h1>
            <p
              data-aos="fade-up"
              data-aos-delay={'300'}
              data-aos-offset={'0'}
              className="text-base sm:text-2xl text-center font-normal sm:leading-[33.6px] text-[#8A9BB7] mb-2"
            >
              Driven by data, powered by AI, controlled by you
            </p>
          </div>
          <div className="flex flex-row gap-5 justify-between">
            <div className="flex flex-col gap-5 w-full">
              {FEATURES.map((feature, index) => (
                <div className="w-full flex flex-col gap-5" key={feature.id}>
                  <FeatureInfoCard
                    {...feature}
                    isActive={activeFeature.id === feature.id}
                    onClick={() => {
                      APPMIXPANELV2.ourFeatures.onClick(mixpanel, feature.heading);
                      setActiveFeature(feature);
                    }}
                    index={index}
                  />
                  {activeFeature.id === feature.id && (
                    <div
                      data-aos="fade-left"
                      data-aos-delay={'500'}
                      data-aos-offset={'0'}
                      className="flex lg:hidden flex-col flex-1 my-auto justify-center items-center"
                    >
                      <FeatureImageCard {...activeFeature} />
                    </div>
                  )}
                </div>
              ))}
            </div>
            <div
              data-aos="fade-left"
              data-aos-delay={'500'}
              data-aos-offset={'0'}
              className="w-full hidden lg:flex my-auto  flex-row items-center"
            >
              <FeatureImageCard {...activeFeature} />
            </div>
          </div>
          <div className="flex flex-row gap-5 justify-between">
            <div
              data-aos="fade-left"
              data-aos-delay={'500'}
              data-aos-offset={'0'}
              className="lg:flex hidden flex-col flex-1 my-auto justify-center items-center"
            >
              <FeatureImageCard {...nextFeature} />
            </div>
            <div className="flex flex-col gap-5">
              {NextFeatures.map((feature, index) => (
                <div className="flex flex-col gap-5" key={feature.id}>
                  <FeatureInfoCard
                    {...feature}
                    isActive={nextFeature.id === feature.id}
                    onClick={() => {
                      APPMIXPANELV2.ourFeatures.onClick(mixpanel, feature.heading);
                      setNextFeature(feature);
                    }}
                    index={index}
                  />
                  {nextFeature.id === feature.id && (
                    <div
                      data-aos="fade-right"
                      data-aos-delay={'500'}
                      data-aos-offset={'0'}
                      className="flex lg:hidden flex-col flex-1 my-auto justify-center items-center"
                    >
                      <FeatureImageCard {...nextFeature} />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </SectionContainer>
    </div>
  );
};
