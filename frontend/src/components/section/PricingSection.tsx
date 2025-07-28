import { pricingData } from '@/constants/pricingData';

import { PricingCard } from '../molecules';
import { SectionContainer } from '../molecules/SectionContainer';
import { SectionHeading } from './SectionHeading';

export const PricingSection = () => {
  return (
    <div className="pt-80.1 mobile:pt-20 min-h-[90vh] h-full">
      <SectionContainer className="pricing-background min-h-[90vh] h-full flex items-center justify-center py-[60px]">
        <div className="flex flex-col justify-center items-center gap-10">
          <SectionHeading heading="Our Plans" />
          <div className="grid desktop:grid-cols-3 mobile:grid-cols-1 tablet:grid-cols-2  laptop:grid-cols-3 gap-5">
            {pricingData.map((item, index) => (
              <div data-aos="fade-up" data-aos-delay={100 * index} data-aos-offset={'0'}>
                <PricingCard key={index} {...item} />
              </div>
            ))}
          </div>
        </div>
      </SectionContainer>
    </div>
  );
};
