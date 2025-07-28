import { useMixpanel } from 'react-mixpanel-browser';

import { ANIMATION } from '@/assets/animation';
import { SectionContainer } from '@/components/molecules/SectionContainer';
import { Button } from '@/components/ui/button';
import { IFeatureItems } from '@/constants/appConstants';
import { LANDING_CALENDLY_URL } from '@/lib/utils';
import { APPMIXPANELV1 } from '@/mixpanel/appMixpanel';

import { FeatureItems } from './featuresSection';

export const AutomatedB2B2 = () => {
  const mixpanel = useMixpanel();
  const Features: IFeatureItems[] = [
    {
      heading: 'Automated B2B Meeting Scheduling',
      decription: `Unreal professional assistants revolutionize lead engagement by reaching out to prospects that align with a business's Ideal Customer Profile (ICP) at an unprecedented scale. Utilizing sophisticated algorithms, these assistants sift through vast amounts of data to identify potential leads, initiating contact with personalized messages. They then engage these prospects with a series of tailored questions designed to qualify them based on specific criteria and behaviors indicative of a potential customer. This ensures that meetings are scheduled only with the most promising leads, significantly enhancing the efficiency of the sales process. By automating these initial stages of lead qualification, Unreal professional assistants allow businesses to allocate their sales resources more effectively, focusing on high-quality prospects and dramatically improving conversion rates.`,
      animation: ANIMATION.AutomatedB2BMetting,
      imageClassName: 'top-[40px] -left-1',
      isReverse: true,
      height: 600,
      width: 800,
      style: {
        position: 'relative',
        // left: '-80px',
      },
      node: (
        <Button
          variant={'unrealPrimary'}
          className="mt-5 w-max"
          onClick={() => {
            APPMIXPANELV1.automatedB2BMeeting.onClick(mixpanel);
            window.open(LANDING_CALENDLY_URL, '_blank');
          }}
        >
          {' '}
          Schedule Intelligent Meetings Now
        </Button>
      ),
    },
  ];
  return (
    <div className="features-container">
      <SectionContainer id="features" className="py-[102px] ">
        <div className="flex flex-col gap-120 flex-1">
          {Features.map((el) => (
            <FeatureItems {...el} key={el.heading} />
          ))}
        </div>
      </SectionContainer>
    </div>
  );
};
