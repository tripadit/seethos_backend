import {
  AnalyticsIcon,
  ColudComputiingIcon,
  IntegrationIcon,
  MultiPlatform,
  OrganizedIcon,
  PersonalizedIcon,
} from '@/assets/icons';

import { SectionContainer } from '../molecules/SectionContainer';
import { SectionHeading } from './SectionHeading';
interface IWhyChooseUs {
  icon: any;
  title: string;
  description: string;
  index?: number;
}
export const WhyChooseUs = () => {
  const WHYCHOOSEUS: IWhyChooseUs[] = [
    {
      icon: ColudComputiingIcon,
      title: 'Always On',
      description: '24/7 service means never missing a potential lead.',
    },
    {
      icon: PersonalizedIcon,
      title: 'Truly Personalized',
      description: 'AI that understands user intent and offers tailored responses.',
    },
    {
      icon: IntegrationIcon,
      title: 'Seamless Integration',
      description: 'Plug and play functionality with your existing digital infrastructure.',
    },
    {
      icon: AnalyticsIcon,
      title: 'Insightful Analytics',
      description: 'Monitor chatbot interactions, gather insights, and refine strategies.',
    },
    {
      icon: MultiPlatform,
      title: 'Multi-Platform Integration',
      description:
        'Our chatbots seamlessly integrate with your website, social media, and messaging apps.',
    },
    {
      icon: OrganizedIcon,
      title: 'Well organised',
      description:
        'Be there for your customers anytime, day or night, providing immediate assistance and information.',
    },
  ];
  return (
    <SectionContainer id="why-choose-us" className="why-chose-us ">
      <div className="py-80.1 mobile:py-10">
        <div>
          <SectionHeading
            heading="Why Choose Our AI Chatbot Integration?"
            subHeading="Harness the Future of Customer Engagement"
          />
        </div>
        <div className="grid grid-cols-3 mobile:grid-cols-1 tablet:grid-cols-2 gap-y-16 gap-x-8 py-16">
          {WHYCHOOSEUS.map((el, index) => (
            <WhyChooseUsItem {...el} key={el.title} index={index + 1} />
          ))}
        </div>
      </div>
    </SectionContainer>
  );
};

const WhyChooseUsItem = (props: IWhyChooseUs) => {
  const { description, icon: Icon, title, index = 1 } = props;
  return (
    <div
      data-aos="fade-up"
      data-aos-delay={110 * index}
      className="flex flex-col items-center gap-5 p-4"
    >
      <div className="h-[100px] flex flex-col items-center justify-center">
        <Icon />
      </div>
      <div className="flex flex-col items-center gap-2">
        <h1 className="text-2xl font-bold text-neutral-900 text-center">{title}</h1>
        <p className="text-base font-normal text-center text-neutral-700">{description}</p>
      </div>
    </div>
  );
};
