import { BasicFeatureIcon, FeatureIcon, SaleDealIcon } from '@/assets/icons';

import { SectionContainer } from '../molecules/SectionContainer';
import { SectionHeading } from './SectionHeading';
interface IFeatureItem {
  icon: any;
  title: string;
  description: string;
  index?: number;
}
export const HowItworks = () => {
  const FEATURES: IFeatureItem[] = [
    {
      icon: FeatureIcon,
      title: 'Precision Scraping',
      description:
        "Dive deep into your site's content, extracting the essence of your brand and offerings.",
    },
    {
      icon: BasicFeatureIcon,
      title: 'Engage & Guide',
      description:
        'Proactively greet visitors, answer queries, and navigate them to their desired destinations.',
    },
    {
      icon: SaleDealIcon,
      title: 'Seal the Deal',
      description:
        ' For services, set up meetings. For e-commerce, drive sales. Duality AI focuses on conversion.',
    },
  ];
  return (
    <SectionContainer id="works" className="bg-purple-0  py-80.1 mobile:py-10 how-it-works">
      <div className="flex flex-col gap-10 ">
        <div>
          <SectionHeading heading="How it works" subHeading="From Data to Dialogue: Our Process" />
        </div>
        <div className="w-full h-[432px]">{/* Video Section */}</div>
        <div className="grid  grid-cols-3 mobile:grid-cols-1  gap-5 mobile:gap-6 py-6">
          {FEATURES.map((item, index) => (
            <FeatureItem {...item} key={item.title} index={index + 1} />
          ))}
        </div>
      </div>
    </SectionContainer>
  );
};

const FeatureItem = (props: IFeatureItem) => {
  const { description, icon: Icon, title, index = 1 } = props;
  return (
    <div
      className="flex flex-col items-center gap-5"
      data-aos="fade-up"
      data-aos-offset={'0'}
      data-aos-delay={150 * index}
    >
      <div className="rounded-full flex flex-col justify-center items-center w-24 h-24 bg-purple-100/80">
        <div className="rounded-full p-5 w-16 h-16 bg-white">
          <Icon />
        </div>
      </div>
      <h1 className="text-2xl font-bold text-neutral-900 text-center">{title}</h1>
      <p className="text-base font-normal text-center text-neutral-700">{description}</p>
    </div>
  );
};
