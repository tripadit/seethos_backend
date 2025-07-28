import { TitleSlash } from '@/assets/icons';
import { FeatureDetailImg } from '@/assets/images';
import { cn } from '@/lib/utils';

import { SectionContainer } from '../molecules/SectionContainer';

interface FeatureDetailsProps {
  title: string;
  description: string;
  illustrationBg: string;
  illustration: string;
  alignment?: 'start' | 'end';
}

export const FeatureDetails = () => {
  const featureDetails: FeatureDetailsProps[] = [
    {
      title: 'Autonomous  AI Agents',
      description:
        'Our advanced AI technology empowers your business with professional assistants that handle Marketing, Customer Service, and Sales, streamlining your operations and enhancing efficiency.',
      illustrationBg: 'bg-blue-500',
      illustration: FeatureDetailImg,
    },
    {
      title: 'Cost-Effective Solutions',
      description:
        'Cost-Effective Solutions: Unreal AI significantly reduces operational costs by automating routine tasks, allowing your team to focus on strategic initiatives that drive business growth.',
      illustrationBg: 'bg-blue-500',
      illustration: FeatureDetailImg,
    },
    {
      title: 'Autonomous  AI Agents',
      description:
        'Our advanced AI technology empowers your business with professional assistants that handle Marketing, Customer Service, and Sales, streamlining your operations and enhancing efficiency.',
      illustrationBg: 'bg-blue-500',
      illustration: FeatureDetailImg,
    },
  ];

  return (
    <>
      {featureDetails.map((featureDetail, index) => (
        <SectionContainer
          id="as-seen-on"
          className={cn('py-80.1 mobile:py-10', { 'bg-[#FFFAFA]': index % 2 == 0 })}
        >
          <FeatureDetailsItem {...featureDetail} alignment={index % 2 == 0 ? 'start' : 'end'} />
        </SectionContainer>
      ))}
      s
    </>
  );
};

const FeatureDetailsItem = ({
  title,
  description,
  illustration,
  alignment,
}: FeatureDetailsProps) => {
  return (
    <div
      className={cn('flex items-center justify-between ', {
        'flex-row-reverse bg-transparent': alignment === 'end',
      })}
    >
      <div className="max-w-[500px] flex flex-col gap-4">
        <Title title={title} align={alignment} />
        <p className="text-[22px] text-neutral-700 ">{description}</p>
      </div>
      <div>
        <img src={illustration} alt="title" />
      </div>
    </div>
  );
};

const Title = ({ title, align = 'start' }: { title: string; align?: 'start' | 'end' }) => {
  return (
    <div className="relative w-max">
      <h2 className="text-[40px] relative text-neutral-900 font-bold z-10">{title}</h2>
      <TitleSlash
        className={cn('absolute bottom-0', {
          'right-0': align == 'end',
          'left-0': align === 'start',
        })}
      />
    </div>
  );
};
