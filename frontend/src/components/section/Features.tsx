import { ClockIconR, DataDriven, PerspectiveView, PiggyBank, TrophyIcon } from '@/assets/icons';

import { SectionContainer } from '../molecules/SectionContainer';

interface IFeatureItem {
  icon: any;
  title: string;
  description: string;
  index?: number;
}

export const Features = () => {
  const FEATURES: IFeatureItem[] = [
    {
      icon: PerspectiveView,
      title: 'Adaptive Lead Generation',
      description:
        'Utilize AI to dynamically identify and engage high-quality leads that align with your evolving business goals.',
    },
    {
      icon: PiggyBank,
      title: 'Dynamic Marketing Campaigns',
      description:
        'Create and optimize marketing strategies in real-time, using AI to ensure maximum engagement and ROI.',
    },
    {
      icon: DataDriven,
      title: 'Business Development Automation',
      description:
        'Streamline your business growth efforts with AI-driven processes that automate key development tasks.',
    },
    {
      icon: TrophyIcon,
      title: 'Cost-Effective Solutions',
      description:
        'Achieve operational excellence and reduce overheads with AI solutions designed for maximum efficiency at minimal cost.',
    },
    {
      icon: ClockIconR,
      title: '24/7 Operation',
      description:
        'Ensure your business is always on, with AI systems that work around the clock to keep operations running smoothly, any time of day.',
    },
  ];

  return (
    <SectionContainer id="features" className="py-80.1 mobile:py-10 ">
      <h4 className="small:text-32 small:text-center text-40 font-bold small:mb-4 mb-10">
        Why Choose Us?
      </h4>
      <div className="grid  justify-center md:grid-cols-3 xl:grid-cols-5 mobile:grid-cols-1  gap-8">
        {FEATURES.map((item, index) => (
          <FeatureCard {...item} key={item.title} index={index + 1} />
        ))}
      </div>
    </SectionContainer>
  );
};

const FeatureCard = (props: IFeatureItem) => {
  const { description, icon: Icon, title, index = 1 } = props;
  return (
    <div
      className="features-card flex flex-col p-5 rounded-xl bg-[#FFFAFA] cursor-pointer "
      data-aos="fade-up"
      data-aos-offset={'0'}
      data-aos-delay={100 * index}
    >
      <div className=" flex flex-col small:mb-4 mb-8 justify-center shadow-sm items-center bg-white rounded-lg w-[60px] h-[60px] ">
        <Icon />
      </div>
      <h1 className="text-2xl font-bold text-neutral-900 small:mb-2 mb-4">{title}</h1>
      <p className="small:text-sm text-base font-normal  text-neutral-700">{description}</p>
    </div>
  );
};
